import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Check, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: () => void;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  couponDiscount: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  couponDiscount,
}) => {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = Math.max(0, subtotal - couponDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = onApplyCoupon(couponInput.trim());
    if (success) {
      setCouponSuccess('কুপন ডিসকাউন্ট সফলভাবে যোগ হয়েছে!');
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('অবৈধ কুপন কোড! চেষ্টা করুন: DISCOUNT10');
      setCouponSuccess('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#12141a] border-l border-white/10 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0c0d10]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                শপিং ব্যাগ ({items.reduce((acc, i) => acc + i.quantity, 0)} টি আইটেম)
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">আপনার শপিং ব্যাগ খালি</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                    টি-শার্ট, জার্সি, ড্রপ শোল্ডার অথবা হুডি কালেকশন থেকে আপনার পছন্দের আইটেম ব্যাগে যুক্ত করুন।
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold shadow-md hover:bg-amber-400 transition"
                >
                  শপিং শুরু করুন
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/5 relative group"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-20 h-24 rounded-xl object-cover object-center bg-zinc-900 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-white line-clamp-1">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-zinc-500 hover:text-rose-400 transition p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                        <span className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono font-bold">
                          {item.selectedSize}
                        </span>
                        {item.selectedColor && (
                          <span>কালার: {item.selectedColor}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-white/10 rounded-lg bg-black/40">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-zinc-400 hover:text-white text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-zinc-400 hover:text-white text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold font-mono text-white">
                          ৳{item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0c0d10] space-y-4">
              
              {/* Promo Coupon Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>কুপন কোড '{appliedCoupon}' অ্যাপ্লাইড (-৳{couponDiscount})</span>
                    </div>
                    <button
                      onClick={onRemoveCoupon}
                      className="text-zinc-400 hover:text-rose-400 text-xs underline"
                    >
                      বাতিল
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="কুপন কোড (eg: DISCOUNT10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 uppercase font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition"
                    >
                      অ্যাপ্লাই
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-400 mt-1">{couponSuccess}</p>}
              </div>

              {/* Delivery & Pricing Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-400 pt-1">
                <div className="flex justify-between">
                  <span>সাবটোটাল</span>
                  <span className="font-mono text-white">৳{subtotal}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>কুপন ডিসকাউন্ট</span>
                    <span className="font-mono">-৳{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-[11px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-amber-400" />
                    ডেলিভারি চার্জ (চেকআউটে সিলেক্ট করুন)
                  </span>
                  <span>ঢাকা ৳৬০ / বাইরে ৳১২০</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between text-sm sm:text-base font-bold text-white">
                  <span>মোট বিল (আইটেমস)</span>
                  <span className="font-mono text-amber-400 text-lg">৳{total}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition"
              >
                <span>অর্ডার সম্পন্ন করতে এগিয়ে যান (Checkout)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>বিকাশ, নগদ, রকেট এবং ক্যাশ অন ডেলিভারি সাপোর্টেড</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
