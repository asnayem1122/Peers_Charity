'use client';

import { useState } from 'react';
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
  Edit3,
  Camera,
  Upload,
  Gamepad2,
  X,
  Check,
} from 'lucide-react';

// Authentic SVG Vector Logos for Valorant & PC Gaming Characters
const makeSvgLogo = (
  bgGradient: string,
  iconPath: string,
  label: string
) => {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        ${bgGradient}
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="28" fill="url(#g)" />
    <path d="${iconPath}" fill="#ffffff" />
    <text x="50%" y="86%" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="900" font-family="sans-serif" opacity="0.95">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

const GAMING_AVATARS = [
  // Valorant Characters
  {
    id: 'val-jett',
    name: 'Jett',
    game: 'Valorant',
    url: makeSvgLogo(
      `<stop offset="0%" stop-color="#06b6d4"/><stop offset="100%" stop-color="#1d4ed8"/>`,
      `M50 18 L68 45 L50 40 L32 45 Z M50 44 L75 75 L50 68 L25 75 Z`,
      `JETT`
    ),
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  },
  {
    id: 'val-reyna',
    name: 'Reyna',
    game: 'Valorant',
    url: makeSvgLogo(
      `<stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#be185d"/>`,
      `M50 18 C65 18 78 30 78 45 C78 65 50 80 50 80 C50 80 22 65 22 45 C22 30 35 18 50 18 Z M50 32 A12 12 0 1 0 50 56 A12 12 0 1 0 50 32 Z`,
      `REYNA`
    ),
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  {
    id: 'val-omen',
    name: 'Omen',
    game: 'Valorant',
    url: makeSvgLogo(
      `<stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#312e81"/>`,
      `M30 25 L70 25 L78 60 L50 78 L22 60 Z M38 42 H46 V48 H38 Z M54 42 H62 V48 H54 Z M46 56 H54 V62 H46 Z`,
      `OMEN`
    ),
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  },
  {
    id: 'val-sage',
    name: 'Sage',
    game: 'Valorant',
    url: makeSvgLogo(
      `<stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#0891b2"/>`,
      `M50 16 L72 38 L50 80 L28 38 Z M50 32 L60 44 L50 64 L40 44 Z`,
      `SAGE`
    ),
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  {
    id: 'val-phoenix',
    name: 'Phoenix',
    game: 'Valorant',
    url: makeSvgLogo(
      `<stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#b91c1c"/>`,
      `M50 16 C55 30 75 35 75 55 C75 68 64 78 50 78 C36 78 25 68 25 55 C25 35 45 30 50 16 Z M50 42 C45 50 40 54 40 62 C40 67 44 71 50 71 C56 71 60 67 60 62 C60 54 55 50 50 42 Z`,
      `PHOENIX`
    ),
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  {
    id: 'val-chamber',
    name: 'Chamber',
    game: 'Valorant',
    url: makeSvgLogo(
      `<stop offset="0%" stop-color="#eab308"/><stop offset="100%" stop-color="#854d0e"/>`,
      `M50 18 L70 35 L62 75 L50 68 L38 75 L30 35 Z M50 28 L58 40 L50 60 L42 40 Z`,
      `CHAMBER`
    ),
    badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },

  // Famous PC Gaming Legends
  {
    id: 'pc-geralt',
    name: 'Geralt of Rivia',
    game: 'The Witcher 3',
    url: makeSvgLogo(
      `<stop offset="0%" stop-color="#475569"/><stop offset="100%" stop-color="#0f172a"/>`,
      `M50 18 L72 32 L66 65 L50 78 L34 65 L28 32 Z M42 38 L48 44 L42 50 Z M58 38 L52 44 L58 50 Z M50 58 L44 64 H56 Z`,
      `WITCHER`
    ),
    badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  },
  {
    id: 'pc-kratos',
    name: 'Kratos',
    game: 'God of War',
    url: makeSvgLogo(
      `<stop offset="0%" stop-color="#dc2626"/><stop offset="100%" stop-color="#1c1917"/>`,
      `M50 16 C68 16 80 30 80 48 C80 62 68 76 54 78 V64 C62 62 68 54 68 46 C68 36 60 28 50 28 C40 28 32 36 32 46 C32 54 38 62 46 64 V78 C32 76 20 62 20 48 C20 30 32 16 50 16 Z`,
      `KRATOS`
    ),
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  {
    id: 'pc-masterchief',
    name: 'Master Chief',
    game: 'Halo',
    url: makeSvgLogo(
      `<stop offset="0%" stop-color="#15803d"/><stop offset="100%" stop-color="#064e3b"/>`,
      `M25 30 L75 30 L80 50 L70 75 L30 75 L20 50 Z M32 40 H68 V55 H32 Z`,
      `HALO`
    ),
    badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  {
    id: 'pc-cyberpunk',
    name: 'Cyberpunk V',
    game: 'Cyberpunk 2077',
    url: makeSvgLogo(
      `<stop offset="0%" stop-color="#facc15"/><stop offset="100%" stop-color="#06b6d4"/>`,
      `M20 25 L80 25 L70 45 L80 65 L20 65 L30 45 Z M35 38 H65 V52 H35 Z`,
      `SAMURAI`
    ),
    badgeColor: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
  },
];

export default function CharityCardProfilePage() {
  const [activeTab, setActiveTab] = useState<'donations' | 'achievements' | 'reviews' | 'circle' | 'activity'>('donations');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatarCategory, setSelectedAvatarCategory] = useState<'ALL' | 'Valorant' | 'PC Legends'>('ALL');

  // Profile State initialized with official Jett (Valorant) Logo
  const [profile, setProfile] = useState({
    name: 'Nayem',
    email: 'nayem@student.university.edu',
    bio: 'Academic Benefactor & Computer Science Student',
    university: 'State University of Technology',
    department: 'Computer Science & Engineering',
    semester: 'Level 3 / Term 2',
    studentId: '2024-CSE-042',
    avatarUrl: GAMING_AVATARS[0].url,
    avatarName: 'Jett (Valorant Official Logo)',
    charityPoints: 0,
    donationsCount: 0,
    studentsHelped: 0,
  });

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

  const handleSelectGameAvatar = (avatar: (typeof GAMING_AVATARS)[0]) => {
    setDraft((prev) => ({
      ...prev,
      avatarUrl: avatar.url,
      avatarName: `${avatar.name} (${avatar.game})`,
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...draft });
    setIsEditing(false);
  };

  const filteredAvatars = GAMING_AVATARS.filter((av) => {
    if (selectedAvatarCategory === 'Valorant') return av.game === 'Valorant';
    if (selectedAvatarCategory === 'PC Legends') return av.game !== 'Valorant';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Clean Profile Header Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-2xl relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar & Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 text-center sm:text-left">
            {/* Profile Picture / Vector Logo with Edit Overlay */}
            <div className="relative group shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-accent/30 shadow-xl"
              />
              <button
                onClick={() => {
                  setDraft({ ...profile });
                  setIsEditing(true);
                }}
                className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold gap-1"
                title="Change Avatar or Upload Picture"
              >
                <Camera className="w-5 h-5 text-accent" />
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
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-accent/10 text-accent border border-accent/30 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>New Benefactor</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  🎮 {profile.avatarName}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground font-semibold">
                {profile.department} • {profile.semester} • {profile.university}
              </p>

              <p className="text-xs text-slate-300 italic max-w-lg">
                "{profile.bio}"
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-3 pt-2 text-xs">
                <span className="inline-flex items-center gap-1 text-accent font-semibold bg-accent/10 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Student (ID: {profile.studentId})</span>
                </span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Joined Semester 1, 2024</span>
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
              <Gamepad2 className="w-4 h-4 text-accent" />
              <span>Change Character Logo</span>
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
              className="px-4 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs hover:bg-accent/90 transition-all shadow-lg shadow-accent/25 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Donate</span>
            </Link>
          </div>
        </div>

        {/* Reputation Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/60">
          <div className="p-4 rounded-2xl bg-card-hover border border-border/60 text-center relative group">
            <div className="flex justify-center text-amber-400 mb-1">
              <Award className="w-5 h-5" />
            </div>
            <span className="block text-2xl font-black text-amber-400">{profile.charityPoints}</span>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Charity Points
            </span>
            <div className="w-full h-1 rounded-full bg-muted mt-2 overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: '0%' }} />
            </div>
            <span className="text-[9px] text-muted-foreground mt-1 block">+10 pts per note uploaded</span>
          </div>

          <div className="p-4 rounded-2xl bg-card-hover border border-border/60 text-center">
            <div className="flex justify-center text-accent mb-1">
              <FileText className="w-5 h-5" />
            </div>
            <span className="block text-2xl font-black text-accent">{profile.donationsCount}</span>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Donations Shared
            </span>
            <span className="text-[9px] text-muted-foreground mt-2 block font-semibold">No notes yet</span>
          </div>

          <div className="p-4 rounded-2xl bg-card-hover border border-border/60 text-center">
            <div className="flex justify-center text-purple-400 mb-1">
              <Users className="w-5 h-5" />
            </div>
            <span className="block text-2xl font-black text-purple-400">{profile.studentsHelped}</span>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Classmates Saved
            </span>
            <span className="text-[9px] text-muted-foreground mt-2 block font-semibold">Awaiting peer reach</span>
          </div>

          <div className="p-4 rounded-2xl bg-card-hover border border-border/60 text-center">
            <div className="flex justify-center text-emerald-400 mb-1">
              <Star className="w-5 h-5" />
            </div>
            <span className="block text-2xl font-black text-emerald-400">—</span>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Avg Trust Score
            </span>
            <span className="text-[9px] text-muted-foreground mt-2 block font-semibold">0 Peer Ratings</span>
          </div>
        </div>
      </div>

      {/* Multi-Tab Navigation */}
      <div className="border-b border-border/60 flex items-center gap-4 sm:gap-8 text-xs sm:text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('donations')}
          className={`pb-3 border-b-2 shrink-0 transition-all flex items-center gap-2 ${
            activeTab === 'donations' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Donations (0)</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`pb-3 border-b-2 shrink-0 transition-all flex items-center gap-2 ${
            activeTab === 'achievements' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Achievements (0)</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 border-b-2 shrink-0 transition-all flex items-center gap-2 ${
            activeTab === 'reviews' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Peer Reviews (0)</span>
        </button>

        <button
          onClick={() => setActiveTab('circle')}
          className={`pb-3 border-b-2 shrink-0 transition-all flex items-center gap-2 ${
            activeTab === 'circle' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Charity Circle (0)</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 border-b-2 shrink-0 transition-all flex items-center gap-2 ${
            activeTab === 'activity' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Contribution Trail</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'donations' && (
        <div className="p-8 rounded-2xl bg-card border border-border/80 text-center space-y-4 flex flex-col items-center justify-center min-h-[220px]">
          <FileText className="w-8 h-8 text-muted-foreground" />
          <h3 className="text-base font-bold">You haven't uploaded any notes yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            "Share lecture notes, class slides, or solved exam banks to start your academic charity journey."
          </p>
          <Link
            href="/donate"
            className="px-5 py-2 rounded-xl bg-accent text-white font-semibold text-xs hover:bg-accent/90 transition-all shadow-md shadow-accent/20 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Your First Note</span>
          </Link>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="p-8 rounded-2xl bg-card border border-border/80 text-center space-y-3">
          <Award className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold">No Badges Unlocked Yet</h3>
          <p className="text-xs text-muted-foreground">
            "Donate notes and help peers to unlock badges like First Donation, Exam Savior, and Top Benefactor!"
          </p>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="p-8 rounded-2xl bg-card border border-border/80 text-center space-y-3">
          <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold">No Peer Reviews Yet</h3>
          <p className="text-xs text-muted-foreground">
            "Peer thank-you ratings and reviews will appear here once classmates download your shared resources."
          </p>
        </div>
      )}

      {activeTab === 'circle' && (
        <div className="p-8 rounded-2xl bg-card border border-border/80 text-center space-y-3">
          <UserCheck className="w-8 h-8 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold">Your Charity Circle is Empty</h3>
          <p className="text-xs text-muted-foreground">
            "Follow classmates and professors to stay notified of their latest academic uploads."
          </p>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-4 text-xs">
          <h2 className="font-bold text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            <span>Recent Academic Altruism Activity</span>
          </h2>
          <p className="text-muted-foreground">No recent activity. Your contribution timeline will record every note you share.</p>
        </div>
      )}

      {/* Edit Profile & Character Logo Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#131b2e] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-white">Select Official Character Logo or Upload</h2>
                  <p className="text-xs text-slate-400">Choose official Valorant character emblems or upload from PC.</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
              {/* Picture Picker */}
              <div className="space-y-3 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={draft.avatarUrl}
                      alt="Avatar Preview"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-accent"
                    />
                    <div>
                      <span className="block font-bold text-sm text-white">Active Logo Emblem</span>
                      <span className="text-[11px] text-accent font-semibold">{draft.avatarName}</span>
                    </div>
                  </div>

                  {/* Direct Local PC File Upload Button */}
                  <label className="px-4 py-2.5 rounded-xl bg-accent text-white font-semibold cursor-pointer hover:bg-accent/90 transition-all flex items-center gap-2 text-xs shadow-md shadow-accent/20">
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

                {/* Official Game Character Logos Gallery */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                      Official Character Logos:
                    </span>

                    {/* Filter Category Tabs */}
                    <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setSelectedAvatarCategory('ALL')}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                          selectedAvatarCategory === 'ALL' ? 'bg-accent text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedAvatarCategory('Valorant')}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                          selectedAvatarCategory === 'Valorant' ? 'bg-accent text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Valorant Logos
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedAvatarCategory('PC Legends')}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                          selectedAvatarCategory === 'PC Legends' ? 'bg-accent text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        PC Legends
                      </button>
                    </div>
                  </div>

                  {/* Avatars Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-h-56 overflow-y-auto p-1">
                    {filteredAvatars.map((av) => {
                      const isSelected = draft.avatarUrl === av.url;
                      return (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => handleSelectGameAvatar(av)}
                          className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 relative group ${
                            isSelected
                              ? 'bg-accent/20 border-accent ring-2 ring-accent'
                              : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-500 hover:bg-slate-800'
                          }`}
                        >
                          <img
                            src={av.url}
                            alt={av.name}
                            className="w-14 h-14 rounded-xl object-contain shadow-md"
                          />
                          <span className="font-bold text-[11px] text-white truncate w-full">
                            {av.name}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${av.badgeColor}`}>
                            {av.game}
                          </span>
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold shadow-md">
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
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:border-accent font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Bio / Motto</label>
                  <textarea
                    rows={2}
                    value={draft.bio}
                    onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Department</label>
                    <input
                      type="text"
                      value={draft.department}
                      onChange={(e) => setDraft({ ...draft, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Semester / Level</label>
                    <input
                      type="text"
                      value={draft.semester}
                      onChange={(e) => setDraft({ ...draft, semester: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Student ID Number</label>
                  <input
                    type="text"
                    value={draft.studentId}
                    onChange={(e) => setDraft({ ...draft, studentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 flex items-center gap-1.5 shadow-md shadow-accent/25"
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
