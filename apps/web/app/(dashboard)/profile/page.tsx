'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  Users,
  Star,
  FileText,
  ShieldCheck,
  Sparkles,
  Trophy,
  Share2,
  Calendar,
  UserCheck,
  TrendingUp,
  Clock,
  MessageSquare,
  PlusCircle,
  Camera,
  Upload,
  Gamepad2,
  X,
  Check,
  Lock,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

// SVG Vector Generator for Google Play Account Avatars
const makePlayAvatarSvg = (
  bgGradient: string,
  iconPath: string,
  label: string
) => {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      <linearGradient id="gPlay" x1="0%" y1="0%" x2="100%" y2="100%">
        ${bgGradient}
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="30" fill="url(#gPlay)" />
    <path d="${iconPath}" fill="#ffffff" />
    <text x="50%" y="87%" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="900" font-family="'Geist Mono', sans-serif" letter-spacing="1" opacity="0.95">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

// Official Google Play Account Avatars
const GOOGLE_PLAY_AVATARS = [
  {
    id: 'play-ninja',
    name: 'Shadow Ninja',
    game: 'Google Play',
    url: makePlayAvatarSvg(
      `<stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/>`,
      `M50 18 C30 18 20 32 20 50 C20 68 35 80 50 80 C65 80 80 68 80 50 C80 32 70 18 50 18 Z M32 44 H68 V52 H32 Z M40 46 A3 3 0 1 1 40 46.1 Z M60 46 A3 3 0 1 1 60 46.1 Z`,
      `PLAY NINJA`
    ),
    badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  },
  {
    id: 'play-android',
    name: 'Android Bot',
    game: 'Google Play',
    url: makePlayAvatarSvg(
      `<stop offset="0%" stop-color="#22c55e"/><stop offset="100%" stop-color="#15803d"/>`,
      `M32 22 L25 15 M68 22 L75 15 M25 35 C25 22 75 22 75 35 H25 Z M38 32 A3 3 0 1 1 38 32.1 Z M62 32 A3 3 0 1 1 62 32.1 Z M25 40 H75 V68 C75 74 68 78 50 78 C32 78 25 74 25 68 Z`,
      `ANDROID`
    ),
    badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  {
    id: 'play-astronaut',
    name: 'Cosmic Astro',
    game: 'Google Play',
    url: makePlayAvatarSvg(
      `<stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/>`,
      `M50 16 C30 16 22 30 22 48 C22 66 32 78 50 78 C68 78 78 66 78 48 C78 30 70 16 50 16 Z M35 34 H65 C70 34 72 40 72 48 C72 56 70 62 65 62 H35 C30 62 28 56 28 48 C28 40 30 34 35 34 Z`,
      `ASTRO`
    ),
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  {
    id: 'play-panther',
    name: 'Neon Panther',
    game: 'Google Play',
    url: makePlayAvatarSvg(
      `<stop offset="0%" stop-color="#ec4899"/><stop offset="100%" stop-color="#be185d"/>`,
      `M20 22 L35 35 L50 20 L65 35 L80 22 L75 52 L50 78 L25 52 Z M36 44 L44 48 L36 52 Z M64 44 L56 48 L64 52 Z`,
      `PANTHER`
    ),
    badgeColor: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  },
  {
    id: 'play-phoenix',
    name: 'Flame Bird',
    game: 'Google Play',
    url: makePlayAvatarSvg(
      `<stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#c2410c"/>`,
      `M50 16 C60 28 78 32 78 52 C78 66 66 78 50 78 C34 78 22 66 22 52 C22 32 40 28 50 16 Z M50 40 C44 48 40 52 40 60 C40 65 44 69 50 69 C56 69 60 65 60 60 C60 52 56 48 50 40 Z`,
      `FLAME`
    ),
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  },
  {
    id: 'play-knight',
    name: 'Pixel Knight',
    game: 'Google Play',
    url: makePlayAvatarSvg(
      `<stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#4338ca"/>`,
      `M50 16 L76 30 V52 C76 68 60 78 50 82 C40 78 24 68 24 52 V30 Z M34 40 H66 V46 H34 Z M47 46 H53 V66 H47 Z`,
      `KNIGHT`
    ),
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  },
  {
    id: 'play-samurai',
    name: 'Cyber Samurai',
    game: 'Google Play',
    url: makePlayAvatarSvg(
      `<stop offset="0%" stop-color="#14b8a6"/><stop offset="100%" stop-color="#0f766e"/>`,
      `M20 28 L50 16 L80 28 L72 45 L80 65 L50 78 L20 65 L28 45 Z M35 42 H65 V50 H35 Z`,
      `SAMURAI`
    ),
    badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  },
  {
    id: 'play-arcade',
    name: 'Game Master',
    game: 'Google Play',
    url: makePlayAvatarSvg(
      `<stop offset="0%" stop-color="#eab308"/><stop offset="100%" stop-color="#a16207"/>`,
      `M22 32 C22 24 35 22 50 22 C65 22 78 24 78 32 V58 C78 68 68 78 58 78 C52 78 48 72 44 72 H56 C52 72 48 78 42 78 C32 78 22 68 22 58 Z M32 40 H40 V48 H32 Z M36 36 V52 Z M62 40 A3 3 0 1 1 62 40.1 Z M68 46 A3 3 0 1 1 68 46.1 Z`,
      `MASTER`
    ),
    badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
];

export default function CharityCardProfilePage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'donations' | 'achievements' | 'reviews' | 'circle' | 'activity'>('donations');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Dynamic Profile State bound to active user
  const [profile, setProfile] = useState({
    name: user?.name || 'Benefactor',
    email: user?.email || 'user@university.edu',
    bio: user?.role === 'ADMIN' ? 'System Administrator & Benefactor Overseer' : 'Academic Benefactor & Computer Science Student',
    university: 'State University of Technology',
    department: 'Computer Science & Engineering',
    semester: user?.role === 'ADMIN' ? 'Faculty Admin' : 'Level 3 / Term 2',
    studentId: user?.role === 'ADMIN' ? 'ADMIN-001' : '2024-CSE-042',
    avatarUrl: user?.avatarUrl || GOOGLE_PLAY_AVATARS[0].url,
    avatarName: user?.avatarName || 'Shadow Ninja (Google Play)',
    charityPoints: user?.role === 'ADMIN' ? 1000 : 0,
    donationsCount: user?.role === 'ADMIN' ? 5 : 0,
    studentsHelped: user?.role === 'ADMIN' ? 42 : 0,
  });

  // Sync profile when auth user changes
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || prev.avatarUrl,
        avatarName: user.avatarName || prev.avatarName,
      }));
    }
  }, [user]);

  const [draft, setDraft] = useState({ ...profile });

  const handleShare = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Upload picture directly from user's PC / local disk
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const customDataUrl = uploadEvent.target.result as string;
          setDraft((prev) => ({
            ...prev,
            avatarUrl: customDataUrl,
            avatarName: `Custom Upload (${file.name})`,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPlayAvatar = (avatar: (typeof GOOGLE_PLAY_AVATARS)[0]) => {
    setDraft((prev) => ({
      ...prev,
      avatarUrl: avatar.url,
      avatarName: `${avatar.name} (${avatar.game})`,
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...draft });
    // Update global auth context state so Topbar avatar and name update instantly!
    updateProfile({
      name: draft.name,
      avatarUrl: draft.avatarUrl,
      avatarName: draft.avatarName,
    });
    setIsEditing(false);
  };

  // Auth Guard: If guest (not logged in), block profile and show clean lock screen
  if (!user) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 sm:p-10 rounded-3xl bg-card border border-border shadow-2xl text-center space-y-6 relative overflow-hidden font-sans">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            Authentication Guard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-mono uppercase tracking-tight text-foreground">
            Sign In Required to View Profile
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            Sign in to access your personal Charity Card, customize your avatar, view earned badges, and track your student impact statistics.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/login"
            className="liquid-metal-btn w-full sm:w-auto px-7 py-3.5 text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-xl"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Continue</span>
          </Link>

          <Link
            href="/register"
            className="liquid-metal-btn-secondary w-full sm:w-auto px-7 py-3.5 text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-lg"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Clean Profile Header Container */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar & Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 text-center sm:text-left">
            {/* Profile Picture / Google Play Avatar Logo with Edit Overlay */}
            <div className="relative group shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-border shadow-xl"
              />
              <button
                onClick={() => {
                  setDraft({ ...profile });
                  setIsEditing(true);
                }}
                className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold gap-1"
                title="Change Avatar or Upload Picture"
              >
                <Camera className="w-5 h-5 text-white" />
                <span className="text-[10px]">Change Logo</span>
              </button>
              <span
                className="w-4 h-4 rounded-full bg-success ring-4 ring-card absolute bottom-1 right-1 flex items-center justify-center text-[9px] text-white font-bold"
                title="Online Benefactor"
              >
                ✓
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{profile.name}</h1>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-foreground/10 text-foreground border border-border flex items-center gap-1 font-mono">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{user?.role === 'ADMIN' ? 'System Overseer' : 'Academic Benefactor'}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-foreground/10 text-muted-foreground border border-border font-mono">
                  🎮 {profile.avatarName}
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 font-mono">
                <span className="px-3.5 py-1.5 rounded-xl bg-foreground text-background font-black text-xs uppercase tracking-wider shadow-md inline-flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>LEVEL & TERM: {profile.semester}</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground font-semibold">
                {profile.department} • {profile.university}
              </p>

              <p className="text-xs text-muted-foreground italic max-w-lg">
                "{profile.bio}"
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-3 pt-2 text-xs">
                <span className="inline-flex items-center gap-1 text-foreground font-semibold bg-foreground/10 px-2.5 py-0.5 rounded-full border border-border">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified ({profile.studentId})</span>
                </span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Joined 2024</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-center gap-3 shrink-0">
            <button
              onClick={() => {
                setDraft({ ...profile });
                setIsEditing(true);
              }}
              className="px-4 py-2.5 rounded-xl border border-border hover:bg-card-hover text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Gamepad2 className="w-4 h-4 text-foreground" />
              <span>Change Play Avatar</span>
            </button>

            <button
              onClick={handleShare}
              className="px-4 py-2.5 rounded-xl border border-border hover:bg-card-hover text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Copied Link!' : 'Share Card'}</span>
            </button>

            <Link
              href="/donate"
              className="px-4 py-2.5 rounded-xl bg-foreground text-background font-semibold text-xs hover:opacity-90 transition-all shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Donate</span>
            </Link>
          </div>
        </div>

        {/* Reputation Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/60">
          <div className="p-4 rounded-2xl bg-card/60 border border-border/60 text-center relative group">
            <div className="flex justify-center text-amber-400 mb-1">
              <Award className="w-5 h-5" />
            </div>
            <span className="block text-2xl font-black text-amber-400">{profile.charityPoints}</span>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Charity Points
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-card/60 border border-border/60 text-center">
            <div className="flex justify-center text-foreground mb-1">
              <FileText className="w-5 h-5" />
            </div>
            <span className="block text-2xl font-black text-foreground">{profile.donationsCount}</span>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Donations Shared
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-card/60 border border-border/60 text-center">
            <div className="flex justify-center text-purple-400 mb-1">
              <Users className="w-5 h-5" />
            </div>
            <span className="block text-2xl font-black text-purple-400">{profile.studentsHelped}</span>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Classmates Saved
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-card/60 border border-border/60 text-center">
            <div className="flex justify-center text-emerald-400 mb-1">
              <Star className="w-5 h-5" />
            </div>
            <span className="block text-2xl font-black text-emerald-400">{user?.role === 'ADMIN' ? '5.0' : '—'}</span>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Avg Trust Score
            </span>
          </div>
        </div>
      </div>

      {/* Multi-Tab Navigation */}
      <div className="border-b border-border/60 flex items-center gap-4 sm:gap-8 text-xs sm:text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('donations')}
          className={`pb-3 border-b-2 shrink-0 transition-all flex items-center gap-2 ${
            activeTab === 'donations' ? 'border-foreground text-foreground font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Donations ({profile.donationsCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`pb-3 border-b-2 shrink-0 transition-all flex items-center gap-2 ${
            activeTab === 'achievements' ? 'border-foreground text-foreground font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Achievements</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 border-b-2 shrink-0 transition-all flex items-center gap-2 ${
            activeTab === 'reviews' ? 'border-foreground text-foreground font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Peer Reviews</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'donations' && (
        <div className="p-8 rounded-2xl glass-panel text-center space-y-4 flex flex-col items-center justify-center min-h-[200px]">
          <FileText className="w-8 h-8 text-muted-foreground" />
          <h3 className="text-base font-bold">Academic Benefactor Vault</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            "Share lecture notes, class slides, or solved exam banks to start your academic charity journey."
          </p>
          <Link
            href="/donate"
            className="px-5 py-2 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-all shadow-md flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Your First Note</span>
          </Link>
        </div>
      )}

      {/* Edit Profile & Google Play Avatar Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-foreground max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-foreground/10 text-foreground flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold">Select Official Google Play Avatar or Upload</h2>
                  <p className="text-xs text-muted-foreground">Choose official Google Play account style avatars or upload from PC.</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-card-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
              {/* Picture Picker */}
              <div className="space-y-3 p-5 rounded-2xl bg-background border border-border">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={draft.avatarUrl}
                      alt="Avatar Preview"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-foreground"
                    />
                    <div>
                      <span className="block font-bold text-sm">Active Play Logo</span>
                      <span className="text-[11px] text-muted-foreground font-semibold font-mono">{draft.avatarName}</span>
                    </div>
                  </div>

                  {/* Direct Local PC File Upload Button */}
                  <label className="px-4 py-2.5 rounded-xl bg-foreground text-background font-bold cursor-pointer hover:opacity-90 transition-all flex items-center gap-2 text-xs shadow-md">
                    <Upload className="w-4 h-4" />
                    <span>Upload Picture from PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLocalImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Google Play Account Avatars Gallery */}
                <div className="pt-4 border-t border-border space-y-3">
                  <span className="font-mono font-bold text-muted-foreground uppercase tracking-wider text-[11px] block">
                    Google Play Avatars Gallery:
                  </span>

                  {/* Avatars Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
                    {GOOGLE_PLAY_AVATARS.map((av) => {
                      const isSelected = draft.avatarUrl === av.url;
                      return (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => handleSelectPlayAvatar(av)}
                          className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 relative group ${
                            isSelected
                              ? 'bg-foreground/15 border-foreground ring-2 ring-foreground'
                              : 'bg-card border-border hover:border-foreground/50'
                          }`}
                        >
                          <img
                            src={av.url}
                            alt={av.name}
                            className="w-16 h-16 rounded-2xl object-contain shadow-md"
                          />
                          <span className="font-bold text-[11px] truncate w-full">
                            {av.name}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold border font-mono ${av.badgeColor}`}>
                            {av.game}
                          </span>
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-bold shadow-md">
                              ✓
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section 2: Profile Metadata Form */}
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-foreground font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Bio / Motto</label>
                  <textarea
                    rows={2}
                    value={draft.bio}
                    onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Department</label>
                    <input
                      type="text"
                      value={draft.department}
                      onChange={(e) => setDraft({ ...draft, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-foreground"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Level & Term</label>
                    <select
                      value={draft.semester}
                      onChange={(e) => setDraft({ ...draft, semester: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-foreground font-semibold"
                    >
                      <option value="Level 1 / Term 1">Level 1 / Term 1</option>
                      <option value="Level 1 / Term 2">Level 1 / Term 2</option>
                      <option value="Level 2 / Term 1">Level 2 / Term 1</option>
                      <option value="Level 2 / Term 2">Level 2 / Term 2</option>
                      <option value="Level 3 / Term 1">Level 3 / Term 1</option>
                      <option value="Level 3 / Term 2">Level 3 / Term 2</option>
                      <option value="Level 4 / Term 1">Level 4 / Term 1</option>
                      <option value="Level 4 / Term 2">Level 4 / Term 2</option>
                      <option value="Faculty Admin">Faculty Admin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Student ID Number</label>
                  <input
                    type="text"
                    value={draft.studentId}
                    onChange={(e) => setDraft({ ...draft, studentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-foreground text-background font-bold hover:opacity-90 flex items-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
