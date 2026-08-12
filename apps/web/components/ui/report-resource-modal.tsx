'use client';

import { useState } from 'react';
import { X, Flag, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { reportResource, ResourceReport } from '@/lib/resources-data';
import { useAuth } from '@/lib/auth-context';

interface ReportResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId: string;
  resourceTitle: string;
  onReportSubmitted?: () => void;
  onRequireAuth?: () => void;
}

export default function ReportResourceModal({
  isOpen,
  onClose,
  resourceId,
  resourceTitle,
  onReportSubmitted,
  onRequireAuth,
}: ReportResourceModalProps) {
  const { user } = useAuth();
  const [reason, setReason] = useState<ResourceReport['reason']>('Copyright/ownership concern');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onClose();
      if (onRequireAuth) onRequireAuth();
      return;
    }

    reportResource({
      resourceId,
      resourceTitle,
      reporterId: user.id,
      reporterName: user.name,
      reason,
      details: details || 'No additional details provided.',
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      if (onReportSubmitted) onReportSubmitted();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-2xl space-y-5 text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full border border-border bg-background hover:bg-card-hover text-muted-foreground hover:text-foreground transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-mono uppercase">Report Submitted</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Thank you for keeping Peer's Charity safe. Our moderation admins will review this report in Admin HQ.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-mono uppercase text-foreground">Report Resource</h3>
                <p className="text-xs text-muted-foreground truncate max-w-xs">{resourceTitle}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                Reason for Report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-semibold focus:outline-none focus:border-foreground"
              >
                <option value="Copyright/ownership concern">Copyright / Ownership Concern</option>
                <option value="Incorrect information">Incorrect Information / Outdated</option>
                <option value="Spam">Spam / Low Quality</option>
                <option value="Inappropriate content">Inappropriate / Unrelated Content</option>
                <option value="Other">Other Issues</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                Additional Details (Optional)
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain why this resource requires admin moderation..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-foreground"
              />
            </div>

            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-400 font-mono flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Reports are sent directly to System Overseers. False reporting may lead to account penalties.</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-all shadow-md flex items-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Submit Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
