import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, RefreshCw, Truck, Heart } from 'lucide-react';
import { ProductCategory } from '../types';
import { OstadGearLogo } from './OstadGearLogo';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  onOpenTrackOrder: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenTrackOrder,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-[#08090c] border-t border-white/10 pt-12 pb-8 text-xs text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-white/10 shrink-0">
                <OstadGearLogo className="w-9 h-9" />
              </div>
              <span className="text-base font-black tracking-[0.14em] text-white font-brand">
                OSTAD <span className="text-amber-400">GEAR</span>
              </span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-xs">
              বাংলাদেশের প্রিমিয়াম আরবান স্ট্রিটওয়্যার এবং স্পোর্টস অ্যাপারেল ব্র্যান্ড। হেভিওয়েট ড্রপ শোল্ডার টি-শার্ট, ক্লাব ও আন্তর্জাতিক জার্সি, ১০০% কম্বড কটন টি-শার্ট এবং প্রিমিয়াম উইন্টার হুডি।
            </p>
            <div className="flex items-center gap-2 text-zinc-400 text-xs pt-1">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>১০০% অরিজিনাল কোয়ালিটি ও সাইজ রিপ্লেসমেন্ট নিশ্চয়তা</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono">
              কালেকশনসমূহ
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onSelectCategory('dropshoulder')} 
                  className="hover:text-amber-400 transition"
                >
                  ড্রপ শোল্ডার টি-শার্ট (Drop Shoulder)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('jersey')} 
                  className="hover:text-amber-400 transition"
                >
                  ফুটবল ও ক্রিকেট জার্সি (Jerseys)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('hoodie')} 
                  className="hover:text-amber-400 transition"
                >
                  হেভিওয়েট উইন্টার হুডি (Hoodies)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('tshirt')} 
                  className="hover:text-amber-400 transition"
                >
                  কম্বড কটন রেগুলার টি-শার্ট (T-Shirts)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Services */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono">
              গ্রাহক সেবা
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenTrackOrder} className="hover:text-amber-400 transition">
                  অর্ডার ট্র্যাক করুন
                </button>
              </li>
              <li>
                <span className="hover:text-amber-400 transition cursor-pointer">
                  ৭ দিনের এক্সচেঞ্জ পলিসি
                </span>
              </li>
              <li>
                <span className="hover:text-amber-400 transition cursor-pointer">
                  সাইজ গাইডলাইন
                </span>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-amber-400 transition text-amber-400/80">
                  এডমিন পোর্টাল (FORHAD1)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Warehouse */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono">
              যোগাযোগ ও ঠিকানা
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-zinc-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">335, Abu Sayeed Market (3rd Floor), Rampura, DIT Road, Dhaka, Bangladesh, 1219</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono font-semibold">01572923114, 01537-506154</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>support@ostadgear.com</span>
              </div>
              <div className="pt-1">
                <a
                  href="https://www.facebook.com/profile.php?id=61571997341321"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1877F2]/15 text-[#1877F2] border border-[#1877F2]/30 hover:bg-[#1877F2]/25 font-semibold transition"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook Page (@OSTAD GEAR)</span>
                </a>
              </div>
            </div>

            {/* Payment methods row */}
            <div className="pt-2">
              <span className="text-[11px] text-zinc-500 block mb-1.5 font-medium">
                অনুমোদিত পেমেন্ট মেথড:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#e2136e] text-white px-2 py-0.5 rounded font-mono font-bold text-[10px]">bKash</span>
                <span className="bg-[#f7941d] text-white px-2 py-0.5 rounded font-mono font-bold text-[10px]">Nagad</span>
                <span className="bg-[#8c3494] text-white px-2 py-0.5 rounded font-mono font-bold text-[10px]">Rocket</span>
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-mono font-bold text-[10px]">COD</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} OSTAD GEAR. সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>for Dhaka Streetwear Enthusiasts</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
