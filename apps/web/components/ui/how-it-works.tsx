"use client";

import React, { useState, useEffect } from "react";

interface CardProps {
  number: string;
  title: string;
  description: string;
  colorTheme?: "orange" | "blue" | "purple";
  className?: string;
  rotate?: string;
}

const Pin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

const Card = ({
  number,
  title,
  description,
  colorTheme = "blue",
  className = "",
  rotate = "",
}: CardProps) => {
  const defaultBgColors = {
    orange: "bg-amber-500/10 dark:bg-amber-500/10",
    blue: "bg-card dark:bg-card",
    purple: "bg-purple-500/10 dark:bg-purple-500/10",
  };
  const defaultTextColors = {
    orange: "text-amber-500 dark:text-amber-400",
    blue: "text-foreground dark:text-foreground",
    purple: "text-purple-500 dark:text-purple-400",
  };
  const defaultBorderColors = {
    orange: "border-amber-500/30 dark:border-amber-500/30",
    blue: "border-border dark:border-border",
    purple: "border-purple-500/30 dark:border-purple-500/30",
  };

  const bgColor = defaultBgColors[colorTheme];
  const textColor = defaultTextColors[colorTheme];
  const borderColor = defaultBorderColors[colorTheme];

  return (
    <div
      className={`relative w-full md:w-[280px] transition-all duration-300 hover:z-30 hover:scale-105 ${rotate} ${className}`}
    >
      <div className="bg-card/95 backdrop-blur-2xl p-3 rounded-[24px] shadow-2xl border border-border">
        <Pin className={`w-7 h-7 ${textColor} z-20 mb-3 mx-auto`} />
        <div
          className={`${bgColor} border ${borderColor} rounded-[18px] p-4 h-full flex flex-col relative overflow-hidden`}
        >
          <span
            className={`${textColor} text-3xl font-mono font-black mb-2`}
          >
            {number}
          </span>
          <h3 className="text-lg font-bold font-mono text-foreground leading-tight mb-2">
            {title}
          </h3>
          <p className="text-muted-foreground text-xs leading-relaxed font-sans">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export interface Step {
  title: string;
  description: string;
  colorTheme?: "orange" | "blue" | "purple";
}

export interface StepPosition {
  className?: string;
  rotate?: string;
}

export interface HowItWorksProps {
  features?: Step[];
  className?: string;
  stepPositions?: StepPosition[];
}

const DEFAULT_CARD_POSITIONS: StepPosition[] = [
  { className: "md:absolute md:top-0 md:left-[8%]", rotate: "md:rotate-3" },
  {
    className: "md:absolute md:top-[120px] md:right-[8%]",
    rotate: "md:-rotate-3",
  },
  { className: "md:absolute md:top-[420px] md:left-[8%]", rotate: "md:rotate-3" },
  {
    className: "md:absolute md:top-[540px] md:right-[6%]",
    rotate: "md:-rotate-3",
  },
  { className: "md:absolute md:top-[820px] md:left-[8%]", rotate: "md:rotate-3" },
];

export default function HowItWorks({
  features,
  className = "",
  stepPositions,
}: HowItWorksProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultFeatures: Step[] = [
    {
      title: "Donate Notes",
      description:
        "Upload lecture notes, solved question banks, or cheat sheets to support your peer circle.",
      colorTheme: "orange",
    },
    {
      title: "Quality Verification",
      description:
        "Bayesian rating algorithms and deduplication hashes guarantee authentic academic quality.",
      colorTheme: "blue",
    },
    {
      title: "Earn Charity Points",
      description:
        "Accumulate points and unlock badges as a top academic philanthropist.",
      colorTheme: "purple",
    },
    {
      title: "Free Peer Access",
      description:
        "Classmates download verified notes instantly with zero monetary cost.",
      colorTheme: "orange",
    },
    {
      title: "Save a Semester",
      description:
        "Thrive together during midterms and finals with community-backed study materials.",
      colorTheme: "blue",
    },
  ];

  const data = features && features.length > 0 ? features : defaultFeatures;
  const positions = stepPositions || DEFAULT_CARD_POSITIONS;

  let height = 1080;
  if (data.length === 1) height = 340;
  else if (data.length === 2) height = 400;
  else if (data.length === 3) height = 740;
  else if (data.length === 4) height = 860;
  else height = 1080;

  return (
    <div
      className={`bg-transparent max-md:py-6 md:py-12 px-2 sm:px-8 relative w-full ${className}`}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div
          className="relative w-full max-w-[1000px] mx-auto flex flex-col space-y-6 md:space-y-0 md:block h-auto md:h-[var(--md-height)]"
          style={{ "--md-height": `${height}px` } as React.CSSProperties}
        >
          {data.length > 1 && (
            <svg
              className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block z-0 opacity-75"
              viewBox={`0 0 1000 ${height}`}
              preserveAspectRatio="none"
            >
              {(() => {
                const pathD = data.reduce((acc, _, index) => {
                  if (index >= data.length - 1) return acc;
                  if (index === 0)
                    return "M 290 150 C 500 150, 550 270, 710 270"; // 1 -> 2
                  if (index === 1)
                    return acc + " C 850 270, 500 350, 290 450"; // 2 -> 3
                  if (index === 2)
                    return acc + " C 290 600, 550 720, 750 720"; // 3 -> 4
                  if (index === 3)
                    return acc + " C 950 720, 500 800, 290 850"; // 4 -> 5
                  return acc;
                }, "");
                return (
                  <path
                    d={pathD}
                    stroke="currentColor"
                    className="text-foreground/40 dark:text-foreground/40 animate-pulse"
                    strokeWidth="2.5"
                    strokeDasharray="8 6"
                    fill="none"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })()}
            </svg>
          )}

          {data.map((step, index) => {
            const position = positions[index % positions.length];

            return (
              <Card
                key={step.title}
                number={`0${index + 1}`}
                title={step.title}
                description={step.description}
                colorTheme={step.colorTheme || "blue"}
                rotate={position.rotate}
                className={position.className}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
