import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  ShieldCheck, 
  Truck, 
  FileText, 
  Menu, 
  X, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { ProductCategory } from '../types';
import { OstadGearLogo } from './OstadGearLogo';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  onOpenTrackOrder: () => void;
  onOpenMasterPrompt: () => void;
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAdmin,
  onOpenTrackOrder,
  onOpenMasterPrompt,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Stealth multi-tap on logo to open admin (for mobile owners)
  const logoClicksRef = React.useRef(0);
  const logoTimerRef = React.useRef<any>(null);

  const handleLogoClick = () => {
    onSelectCategory('all');
    logoClicksRef.current += 1;
    clearTimeout(logoTimerRef.current);
    logoTimerRef.current = setTimeout(() => {
      logoClicksRef.current = 0;
    }, 2500);

    if (logoClicksRef.current >= 5) {
      logoClicksRef.current = 0;
      onOpenAdmin();
    }
  };

  const categories: { id: ProductCategory | 'all'; label: string; bn: string }[] = [
    { id: 'all', label: 'All Items', bn: 'সব পোশাক' },
    { id: 'dropshoulder', label: 'Drop Shoulder', bn: 'ড্রপ শোল্ডার' },
    { id: 'jersey', label: 'Jerseys', bn: 'জার্সি' },
    { id: 'hoodie', label: 'Hoodies', bn: 'হুডি' },
    { id: 'tshirt', label: 'T-Shirts', bn: 'টি-শার্ট' },
  ];

  return (
    <>
      {/* Top Banner Announcement */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black py-1.5 px-4 text-xs font-semibold text-center tracking-wide flex items-center justify-center gap-2 overflow-hidden">
        <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
        <span>🇧🇩 সারা বাংলাদেশে ক্যাশ অন ডেলিভারি | ঢাকার ভিতরে ডেলিভারি মাত্র ৬০৳ | হেল্পলাইন: 01572923114, 01537-506154</span>
        <span className="hidden md:inline font-mono bg-black/10 px-2 py-0.5 rounded text-[11px]">COUPON: DISCOUNT10</span>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0c0d10]/95 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            
            {/* Mobile Hamburger & Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 lg:mr-4 xl:mr-6">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition shrink-0"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <button 
                onClick={handleLogoClick}
                className="text-left group flex items-center gap-2.5 sm:gap-3 focus:outline-none shrink-0"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-lg shadow-black/50 group-hover:scale-105 transition-transform bg-black flex items-center justify-center border border-white/10 shrink-0">
                  <OstadGearLogo className="w-9 h-9 sm:w-10 sm:h-10" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm sm:text-lg font-black tracking-wider text-white font-brand leading-snug flex items-center">
                    OSTAD&nbsp;<span className="text-amber-400">GEAR</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] tracking-wider text-zinc-400 uppercase font-medium leading-tight mt-0.5 whitespace-nowrap">
                    Dhaka Streetwear &amp; Jersey
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 border-l border-white/10 pl-4 xl:pl-6 shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-white/10 text-amber-400 font-semibold shadow-inner'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </nav>

            {/* Right Actions (Search, Order Track, Master Prompt, Wishlist, Cart, Admin) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              
              {/* Search Toggle / Input */}
              <div className="relative">
                {showSearchInput ? (
                  <div className="flex items-center bg-white/10 rounded-full pl-3 pr-2 py-1 border border-amber-500/50 w-44 sm:w-64 transition-all">
                    <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search tee, jersey, hoodie..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="bg-transparent border-none text-xs sm:text-sm text-white focus:outline-none px-2 w-full placeholder-zinc-500"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setShowSearchInput(false);
                        onSearchChange('');
                      }}
                      className="text-zinc-400 hover:text-white p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearchInput(true)}
                    className="p-2 text-zinc-300 hover:text-white hover:bg-white/5 rounded-full transition"
                    title="Search products"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Facebook Page Button */}
              <a
                href="https://www.facebook.com/profile.php?id=61571997341321"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#1877F2]/15 text-[#1877F2] border border-[#1877F2]/30 hover:bg-[#1877F2]/25 transition"
                title="Follow OSTAD GEAR on Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>

              {/* Master Prompt Button (Only visible to Admin) */}
              {isAdminLoggedIn && (
                <button
                  onClick={onOpenMasterPrompt}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition"
                  title="View the complete AI Studio master prompt (Admin only)"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>মাস্টার প্রম্পট</span>
                </button>
              )}

              {/* Track Order Button */}
              <button
                onClick={onOpenTrackOrder}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition"
                title="Track your order delivery status"
              >
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Track Order</span>
              </button>

              {/* Wishlist Icon */}
              <button
                onClick={onOpenWishlist}
                className="relative p-2 text-zinc-300 hover:text-white hover:bg-white/5 rounded-full transition"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Bag</span>
                <span className="bg-black text-amber-400 text-xs px-1.5 py-0.5 rounded-md font-mono">
                  {cartCount}
                </span>
              </button>

              {/* Admin Panel Button - Easily accessible on desktop & mobile */}
              <button
                onClick={onOpenAdmin}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm ${
                  isAdminLoggedIn
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'text-zinc-400 hover:text-amber-400 hover:bg-white/5 border border-white/5'
                }`}
                title="Admin Dashboard (FORHAD1 / 123456)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{isAdminLoggedIn ? 'এডমিন প্যানেল' : 'এডমিন'}</span>
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#12141a] border-b border-white/10 px-4 pt-3 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500/20 text-amber-400 font-semibold'
                      : 'text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  <div className="font-semibold">{cat.label}</div>
                  <div className="text-[11px] text-zinc-500">{cat.bn}</div>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              {/* Admin Portal Button for Mobile Menu */}
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm bg-amber-500/10 text-amber-400 border border-amber-500/25 hover:bg-amber-500/20 transition"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold">{isAdminLoggedIn ? 'এডমিন প্যানেল (লগইন করা)' : 'স্টোর এডমিন পোর্টাল (FORHAD1)'}</span>
                </span>
                <span className="text-[10px] font-mono font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded">ADMIN</span>
              </button>

              <button
                onClick={() => {
                  onOpenTrackOrder();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/5"
              >
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>অর্ডার ট্র্যাক করুন (Track Order)</span>
                </span>
                <span className="text-xs text-zinc-500">Steadfast / Pathao</span>
              </button>

              {/* Master Prompt in Mobile Drawer - Only visible to Admin */}
              {isAdminLoggedIn && (
                <button
                  onClick={() => {
                    onOpenMasterPrompt();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>মাস্টার AI প্রম্পট কপি করুন (Admin)</span>
                  </span>
                  <span className="text-xs font-mono">PROMPT</span>
                </button>
              )}

              <a
                href="https://www.facebook.com/profile.php?id=61571997341321"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/30"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>অফিশিয়াল ফেসবুক পেইজ (Facebook)</span>
                </span>
                <span className="text-xs font-mono">VISIT</span>
              </a>

              <div className="flex flex-col gap-1 px-3 py-1.5 text-xs text-zinc-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                    <span>হটলাইন: 01572923114 / 01537-506154</span>
                  </span>
                  <span className="text-zinc-500">24/7</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
