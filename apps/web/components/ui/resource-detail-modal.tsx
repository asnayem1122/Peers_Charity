'use client';

import { useState } from 'react';
import {
  X,
  Star,
  Download,
  Bookmark,
  Flag,
  ExternalLink,
  FileText,
  FileCode,
  ShieldCheck,
  Eye,
  UserCheck,
  MessageSquare,
  Sparkles,
  Check,
  Lock,
} from 'lucide-react';
import { Resource, addReview, toggleSaveResource, recordDownload, getSavedResourceIds } from '@/lib/resources-data';
import { useAuth } from '@/lib/auth-context';

interface ResourceDetailModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReportModal: (resourceId: string, resourceTitle: string) => void;
  onRequireAuth: (actionName: string) => void;
  onResourceUpdated?: () => void;
}

export default function ResourceDetailModal({
  resource,
  isOpen,
  onClose,
  onOpenReportModal,
  onRequireAuth,
  onResourceUpdated,
}: ResourceDetailModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'preview' | 'reviews'>('preview');
  const [userRating, setUserRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !resource) return null;

  const isSaved = getSavedResourceIds().includes(resource.id);

  const handleToggleSave = () => {
    if (!user) {
      onRequireAuth('bookmark resources');
      return;
    }
    toggleSaveResource(resource.id);
    if (onResourceUpdated) onResourceUpdated();
  };

  const handleDownload = () => {
    if (!user) {
      onRequireAuth('download academic materials');
      return;
    }
    recordDownload(resource.id);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
    if (onResourceUpdated) onResourceUpdated();
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onRequireAuth('rate and review resources');
      return;
    }
    if (!commentText.trim()) return;

    setIsSubmittingReview(true);
    addReview(resource.id, {
      userId: user.id,
      userName: user.name,
      rating: userRating,
      comment: commentText,
    });

    setCommentText('');
    setIsSubmittingReview(false);
    if (onResourceUpdated) onResourceUpdated();
  };

  const getSafeUrl = (url?: string): string => {
    if (!url) return '#';
    try {
      const parsed = new URL(url);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return url;
      }
    } catch {}
    return '#';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-2xl space-y-6 text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full border border-border bg-background hover:bg-card-hover text-muted-foreground hover:text-foreground transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header & Badges */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            <span className="px-3 py-1 rounded-xl bg-foreground text-background font-black uppercase tracking-wider">
              {resource.courseCode}
            </span>
            <span className="px-3 py-1 rounded-xl bg-foreground/10 text-foreground border border-border font-bold uppercase">
              {resource.resourceType}
            </span>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
              {resource.contentSource}
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black font-sans tracking-tight text-foreground">
            {resource.title}
          </h2>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground pt-1 border-b border-border pb-4 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-bold text-foreground">
                <UserCheck className="w-4 h-4 text-accent" />
                <span>Shared by: <strong className="text-foreground">{resource.publicDisplayIdentity}</strong></span>
              </span>
              <span>•</span>
              <span>{resource.semester}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{resource.rating.toFixed(1)} ({resource.ratingCount} ratings)</span>
              </span>
              <span>•</span>
              <span className="text-foreground font-semibold">{resource.downloadsCount} downloads</span>
            </div>
          </div>
        </div>

        {/* Content Source Notice */}
        <div className="p-3.5 rounded-2xl bg-muted/60 border border-border text-xs leading-relaxed text-muted-foreground flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Academic Integrity Notice: Material verified for educational sharing.</span>
          </div>
          <button
            onClick={() => onOpenReportModal(resource.id, resource.title)}
            className="text-[11px] font-mono font-bold text-red-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report Resource</span>
          </button>
        </div>

        {/* Description & Tags */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">Description</h3>
          <p className="text-xs sm:text-sm text-foreground leading-relaxed">{resource.description}</p>
          <div className="flex items-center gap-1.5 flex-wrap pt-2 font-mono">
            {resource.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-0.5 rounded-md text-[10px] bg-foreground/5 text-muted-foreground border border-border">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation Tabs (Preview vs Reviews) */}
        <div className="border-b border-border flex items-center gap-6 text-xs font-bold font-mono">
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-2.5 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'preview' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Resource Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2.5 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'reviews' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Peer Reviews ({resource.reviews.length})</span>
          </button>
        </div>

        {/* Tab 1: Preview Section */}
        {activeTab === 'preview' && (
          <div className="space-y-4">
            {resource.resourceType === 'External Link' ? (
              <div className="p-6 rounded-2xl bg-background border border-border text-center space-y-4 font-mono">
                <div className="w-12 h-12 rounded-2xl bg-foreground/10 text-foreground flex items-center justify-center mx-auto">
                  <ExternalLink className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm text-foreground">External Educational Resource</p>
                  <p className="text-xs text-muted-foreground font-sans truncate max-w-md mx-auto">{resource.externalUrl}</p>
                </div>
                <a
                  href={getSafeUrl(resource.externalUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-metal-btn inline-flex items-center gap-2 px-6 py-3 text-xs font-bold shadow-lg"
                >
                  <span>Open External Resource</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-background border border-border space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/60 pb-2">
                  <span className="flex items-center gap-1.5 text-foreground font-bold">
                    <FileText className="w-4 h-4 text-accent" />
                    <span>{resource.fileName || 'Resource_Document.pdf'}</span>
                  </span>
                  <span>{resource.fileSize || '3.5 MB'}</span>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border text-xs leading-relaxed text-foreground font-sans whitespace-pre-line max-h-48 overflow-y-auto">
                  {resource.previewText || 'No preview text snippet provided. Download file to view full contents.'}
                </div>
              </div>
            )}

            {/* Action Bar (Download & Bookmark) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 font-mono">
              <button
                onClick={handleToggleSave}
                className={`w-full sm:w-auto px-5 py-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isSaved
                    ? 'bg-foreground text-background border-foreground shadow-md'
                    : 'border-border bg-card hover:bg-card-hover text-muted-foreground hover:text-foreground'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-background' : ''}`} />
                <span>{isSaved ? 'Bookmarked in Treasure Vault' : 'Save to Treasure Vault'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="liquid-metal-btn w-full sm:w-auto px-7 py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-xl"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Downloaded! (+10 pts)</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Resource</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Reviews Section */}
        {activeTab === 'reviews' && (
          <div className="space-y-5">
            {/* Add Review Form */}
            <form onSubmit={handleAddReviewSubmit} className="p-4 rounded-2xl bg-card border border-border space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-foreground">Write a Peer Review</span>
                {/* Rating Selector */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={2}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={user ? 'How helpful was this resource for your course?' : 'Sign in to write a review...'}
                disabled={!user}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-foreground disabled:opacity-50"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!user || !commentText.trim() || isSubmittingReview}
                  className="px-5 py-2 rounded-xl bg-foreground text-background font-mono font-bold text-xs hover:opacity-90 transition-all disabled:opacity-40 shadow-md"
                >
                  Post Review
                </button>
              </div>
            </form>

            {/* Existing Reviews List */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {resource.reviews.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-muted-foreground bg-background rounded-2xl border border-border">
                  No peer reviews yet. Be the first student to review this resource!
                </div>
              ) : (
                resource.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-background border border-border space-y-1 text-xs">
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-foreground">{rev.userName}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-amber-400">{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground font-sans">{rev.comment}</p>
                    <span className="text-[10px] text-muted-foreground/60 font-mono block pt-1">{rev.createdAt}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
