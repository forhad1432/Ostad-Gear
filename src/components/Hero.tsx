import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { CATEGORIES } from '../data/initialProducts';
import { ProductCategory } from '../types';

interface HeroProps {
  onSelectCategory: (category: ProductCategory) => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectCategory, onExploreClick }) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 bg-gradient-to-b from-[#12141a] via-[#0c0d10] to-[#0c0d10]">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Hero Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NEW DROP '26 · DHAKA URBAN STREETWEAR</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-wider leading-[0.92] font-streetwear uppercase select-none">
              WEAR THE VIBE. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
                RULE THE STREETS.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              বাংলাদেশি প্রিমিয়াম ক্লদিং ব্র্যান্ড। পেয়ে যাবেন 220 GSM হেভিওয়েট ড্রপ শোল্ডার টি-শার্ট, অথেনটিক মাইক্রো-মেশ স্পোর্টস জার্সি, ১০০% কম্বড কটন টি-শার্ট এবং ৩২০ GSM উইন্টার ক্যাঙ্গারু হুডি।
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <span>সব কালেকশন দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectCategory('dropshoulder')}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-5 py-3 rounded-xl font-semibold text-sm transition"
              >
                <span>ড্রপ শোল্ডার হট ড্রপ</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-amber-400">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">ক্যাশ অন ডেলিভারি</div>
                  <div className="text-[11px] text-zinc-400">সারা বাংলাদেশে হোম ডেলিভারি</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-amber-400">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">৭ দিনের এক্সচেঞ্জ</div>
                  <div className="text-[11px] text-zinc-400">সাইজ পরিবর্তন সুবিধা</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-amber-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">১০০% কটন গ্যারান্টি</div>
                  <div className="text-[11px] text-zinc-400">বায়ো-ওয়াশ নো-শ্রিঙ্কেজ</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">বিকাশ / নগদ পেমেন্ট</div>
                  <div className="text-[11px] text-zinc-400">সহজ এবং নিরাপদ ভেরিফিকেশন</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Category Showcase Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-zinc-900 border border-white/10 hover:border-amber-500/50 transition-all duration-300 text-left"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-75 group-hover:opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                  <span className="text-[10px] tracking-wider uppercase text-amber-400 font-bold font-mono">
                    {cat.tagline}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white font-display group-hover:text-amber-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {cat.nameBn}
                  </p>
                </div>
              </button>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
