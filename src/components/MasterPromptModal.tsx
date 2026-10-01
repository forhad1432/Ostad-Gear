import React, { useState } from 'react';
import { X, Copy, Check, FileText, Sparkles, Code } from 'lucide-react';
import { MASTER_PROMPT_TEXT } from '../data/masterPrompt';

interface MasterPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MasterPromptModal: React.FC<MasterPromptModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MASTER_PROMPT_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#12141a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col p-5 sm:p-7 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display flex items-center gap-2">
                <span>মাস্টার AI ইঞ্জিনিয়ারিং প্রম্পট</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded">
                  Ready for AI Studio & Gemini
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                এই প্রম্পটটি কপি করে আপনি যেকোনো সময় Gemini বা AI Studio-তে সরাসরি পেস্ট করতে পারবেন।
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature summary pills */}
        <div className="flex flex-wrap gap-2 text-[11px] text-zinc-300">
          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
            👕 T-Shirts, Jerseys, Drop-Shoulder & Hoodies
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
            💳 bKash, Nagad, Rocket & Cash on Delivery
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
            🛡️ Admin Panel (FORHAD1 / 123456)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
            📦 Product CRUD & Order Manager
          </span>
        </div>

        {/* Code/Prompt container */}
        <div className="relative flex-1 min-h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-[#08090b]">
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-black" />
                  <span>কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>সম্পূর্ণ প্রম্পট কপি করুন</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 sm:p-5 text-xs text-zinc-300 font-mono overflow-y-auto max-h-[50vh] whitespace-pre-wrap leading-relaxed">
            {MASTER_PROMPT_TEXT}
          </pre>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>প্রম্পটটি ইতিমধ্যেই এই অ্যাপ্লিকেশনে ১০০% কার্যকরীভাবে তৈরি করা আছে!</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
