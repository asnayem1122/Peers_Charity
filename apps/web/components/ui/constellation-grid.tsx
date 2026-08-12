'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    baseX: number;
    baseY: number;
    radius: number;
    label: string;
    pulse: number;
}

interface ConstellationGridProps {
    showOverlayTitle?: boolean;
}

export default function ConstellationGrid({ showOverlayTitle = false }: ConstellationGridProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;

        // Mouse velocity & inertial tracking
        const mouse = {
            x: -1000,
            y: -1000,
            prevX: -1000,
            prevY: -1000,
            vx: 0,
            vy: 0,
            radius: 240,
        };

        let nodes: Node[] = [];

        const handleResize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = canvas.parentElement?.clientWidth || window.innerWidth;
            height = canvas.parentElement?.clientHeight || window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
            initNodes();
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        const initNodes = () => {
            nodes = [];
            const spacing = 50; // Dense grid density
            const cols = Math.ceil(width / spacing) + 1;
            const rows = Math.ceil(height / spacing) + 1;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * spacing;
                    const y = j * spacing;
                    nodes.push({
                        x,
                        y,
                        vx: 0,
                        vy: 0,
                        baseX: x,
                        baseY: y,
                        radius: Math.random() * 1.5 + 1.2,
                        label: `${(i * 7).toString(16).toUpperCase()}:${(j * 11).toString(16).toUpperCase()}`,
                        pulse: Math.random() * Math.PI * 2,
                    });
                }
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        let lastTime = performance.now();

        const render = (now: number) => {
            // Normalize dt across high-refresh displays
            const dt = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;

            // Check theme dynamically every frame
            const isDarkMode = document.documentElement.classList.contains('dark');

            // Mouse velocity calculation
            mouse.vx = (mouse.x - mouse.prevX) / (dt * 1000 || 1);
            mouse.vy = (mouse.y - mouse.prevY) / (dt * 1000 || 1);
            mouse.prevX = mouse.x;
            mouse.prevY = mouse.y;

            const speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);

            // Clear canvas for transparent layering
            ctx.clearRect(0, 0, width, height);

            // High-Contrast Monochrome Color Palette per theme
            const nodeColor = isDarkMode ? '255, 255, 255' : '24, 24, 27';
            const accentColor = isDarkMode ? '255, 255, 255' : '0, 0, 0';
            const baseConnAlpha = isDarkMode ? 0.35 : 0.45;

            // Node Physics Engine (Hooke's Law Spring-Mass-Damping system)
            const SPRING_K = 18;
            const DAMPING = 0.82;

            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                n.pulse += dt * 3;

                // Mouse distance vectors
                const dx = mouse.x - n.x;
                const dy = mouse.y - n.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Dynamic shockwave repulsion based on cursor speed
                if (dist < mouse.radius && dist > 0) {
                    const power = (1 - dist / mouse.radius);
                    const force = power * (1600 + speed * 160);
                    const angle = Math.atan2(dy, dx);

                    n.vx -= Math.cos(angle) * force * dt;
                    n.vy -= Math.sin(angle) * force * dt;
                }

                // Restoring force to base anchor
                const homeDx = n.baseX - n.x;
                const homeDy = n.baseY - n.y;

                n.vx += homeDx * SPRING_K * dt;
                n.vy += homeDy * SPRING_K * dt;

                n.vx *= DAMPING;
                n.vy *= DAMPING;

                n.x += n.vx * dt * 60;
                n.y += n.vy * dt * 60;
            }

            // Draw Connections
            const MAX_CONN_DIST = 70;
            const MAX_CONN_DIST_SQ = MAX_CONN_DIST * MAX_CONN_DIST;

            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];

                for (let j = i + 1; j < nodes.length; j++) {
                    const n2 = nodes[j];
                    const ndx = n.x - n2.x;
                    const ndy = n.y - n2.y;
                    const distSq = ndx * ndx + ndy * ndy;

                    if (distSq < MAX_CONN_DIST_SQ) {
                        const nDist = Math.sqrt(distSq);
                        const alpha = (1 - nDist / MAX_CONN_DIST) * baseConnAlpha;

                        ctx.strokeStyle = `rgba(${nodeColor}, ${alpha})`;
                        ctx.lineWidth = isDarkMode ? 0.8 : 1.0;
                        ctx.beginPath();
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(n2.x, n2.y);
                        ctx.stroke();
                    }
                }
            }

            // Render Node Points
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                const dx = mouse.x - n.x;
                const dy = mouse.y - n.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const isNear = dist < mouse.radius;

                const baseAlpha = isNear ? 0.95 : (isDarkMode ? 0.35 : 0.6) + Math.sin(n.pulse) * 0.15;

                ctx.fillStyle = isNear
                    ? `rgba(${accentColor}, ${baseAlpha})`
                    : `rgba(${nodeColor}, ${baseAlpha})`;

                const currentRadius = isNear
                    ? n.radius * 2.2
                    : n.radius + Math.sin(n.pulse) * 0.3;

                ctx.beginPath();
                ctx.arc(n.x, n.y, Math.max(1.0, currentRadius), 0, Math.PI * 2);
                ctx.fill();

                if (dist < 90) {
                    const pulseRing = ((n.pulse * 20) % 30) + 4;
                    const ringAlpha = (1 - pulseRing / 34) * 0.6;

                    ctx.strokeStyle = `rgba(${accentColor}, ${ringAlpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, pulseRing, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.font = '8px "Geist Mono", SFMono-Regular, Consolas, monospace';
                    ctx.fillStyle = `rgba(${accentColor}, 0.9)`;
                    ctx.fillText(n.label, n.x + 10, n.y - 10);
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div className="relative w-full h-full min-h-screen overflow-hidden select-none pointer-events-none">
            <canvas ref={canvasRef} className="absolute inset-0 block cursor-crosshair pointer-events-auto" />

            {showOverlayTitle && (
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4 pointer-events-none mix-blend-difference text-white">
                    <h1 className="font-mono text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none">
                        Constellation
                    </h1>
                    <p className="mt-4 font-mono text-xs md:text-sm max-w-lg opacity-70">
                        High-velocity dynamic mesh. Sweep your cursor quickly across the grid to unleash kinetic shockwaves.
                    </p>
                </div>
            )}
        </div>
    );
}
