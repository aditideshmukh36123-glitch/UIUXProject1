import React, { useState } from 'react';
import { X, Copy, Check, Mail, ArrowRight } from 'lucide-react';

interface EditorialNoticeProps {
  type: 'work' | 'about' | 'contact' | null;
  onClose: () => void;
}

export const EditorialNotice: React.FC<EditorialNoticeProps> = ({ type, onClose }) => {
  const [copied, setCopied] = useState(false);
  const email = 'aditideshmukh361234@gmail.com';

  if (!type) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#18171B] border border-[#F4F0EA]/10 p-8 md:p-10 shadow-2xl relative text-[#F4F0EA]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 text-[#A69FAE] hover:text-[#F4F0EA] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'work' ? (
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] font-mono text-[#B8A9C2] mb-3">
              [ Selected Works ]
            </div>
            <h3 className="font-display font-bold text-3xl text-[#F4F0EA] tracking-tight mb-1">
              Curated Archive
            </h3>
            <p className="font-serif italic text-lg text-[#A69FAE] mb-4">
              Graphic Design &amp; Visual Systems
            </p>
            <p className="text-sm md:text-base leading-relaxed text-[#CBC5D1] mb-6">
              Selected editorial layouts, tactile print compositions, and digital visual designs are currently being formatted for presentation.
            </p>
            <div className="border-t border-[#F4F0EA]/10 pt-4 flex justify-between items-center text-xs text-[#A69FAE]">
              <span>Portfolio in active curation</span>
              <button
                onClick={onClose}
                className="text-[#F4F0EA] font-medium hover:text-[#B8A9C2] transition-colors cursor-pointer"
              >
                Close →
              </button>
            </div>
          </div>
        ) : type === 'about' ? (
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] font-mono text-[#B8A9C2] mb-3">
              [ Profile ]
            </div>
            <h3 className="font-display font-bold text-3xl text-[#F4F0EA] tracking-tight mb-1">
              ANNIE
            </h3>
            <p className="font-serif italic text-lg text-[#A69FAE] mb-4">
              Graphic Designer
            </p>
            <p className="text-sm md:text-base leading-relaxed text-[#CBC5D1] mb-6">
              Independent graphic designer dedicated to art-directed visual identity, editorial publication design, and calm, tactile aesthetics.
            </p>
            <div className="border-t border-[#F4F0EA]/10 pt-4 flex justify-between items-center text-xs text-[#A69FAE]">
              <span>Selected Works 2024—2026</span>
              <button
                onClick={onClose}
                className="text-[#F4F0EA] font-medium hover:text-[#B8A9C2] transition-colors cursor-pointer"
              >
                Back to Hero →
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] font-mono text-[#B8A9C2] mb-3">
              [ Inquiries ]
            </div>
            <h3 className="font-display font-bold text-3xl text-[#F4F0EA] tracking-tight mb-1">
              Let's Connect
            </h3>
            <p className="font-serif italic text-base text-[#A69FAE] mb-5">
              Available for select freelance commissions and collaborations
            </p>

            <div className="border border-[#F4F0EA]/10 bg-[#121113] p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#B8A9C2]" />
                <span className="text-xs md:text-sm font-mono text-[#F4F0EA]">{email}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-[#F4F0EA] hover:text-[#B8A9C2] font-medium cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 bg-[#F4F0EA] text-[#121113] px-6 py-3 text-xs uppercase tracking-wider font-medium hover:bg-[#B8A9C2] hover:text-[#121113] transition-colors"
              >
                <span>Compose Email</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onClose}
                className="text-xs text-[#A69FAE] hover:text-[#F4F0EA] transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
