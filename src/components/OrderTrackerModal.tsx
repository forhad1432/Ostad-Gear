import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  Package, 
  CheckCircle, 
  Clock, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';
import { Order } from '../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialSearchQuery?: string;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialSearchQuery = '',
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState(initialSearchQuery);
  const [searched, setSearched] = useState(Boolean(initialSearchQuery));

  const cleanQuery = query.trim().toLowerCase();

  const foundOrder = orders.find(
    o => o.orderNumber.toLowerCase() === cleanQuery || 
         o.phone.replace(/\D/g, '') === cleanQuery.replace(/\D/g, '')
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const stages = [
    { key: 'placed', label: 'অর্ডার গৃহীত', desc: 'কাস্টমার অর্ডার সাবমিট করেছেন' },
    { key: 'confirmed', label: 'অর্ডার কনফার্মড', desc: 'আইটেম ও পেমেন্ট ভেরিফাই করা হয়েছে' },
    { key: 'shipped', label: 'কুরিয়ারে হস্তান্তর', desc: 'পার্সেল কুরিয়ার হাব-এ পৌঁছানো হয়েছে' },
    { key: 'delivered', label: 'ডেলিভার্ড', desc: 'গ্রাহকের নিকট পার্সেল পৌঁছে গেছে' },
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': 
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentStageIdx = foundOrder ? getStageIndex(foundOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#12141a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-auto p-5 sm:p-7 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                অর্ডার ট্র্যাকিং (Live Tracking)
              </h2>
              <p className="text-xs text-zinc-400">
                আপনার অর্ডার নম্বর অথবা মোবাইল নম্বর দিয়ে স্ট্যাটাস দেখুন
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

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="অর্ডার নম্বর (eg: OG-BD-1042) বা মোবাইল নম্বর লিখুন"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearched(false);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 placeholder-zinc-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm rounded-xl transition"
          >
            ট্র্যাক করুন
          </button>
        </form>

        {/* Results */}
        {searched && (
          <div>
            {foundOrder ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0c0d10] border border-white/10 space-y-5 text-xs">
                
                {/* Order Top Info */}
                <div className="flex items-start justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">অর্ডার কোড</span>
                    <div className="font-mono text-base font-bold text-amber-400">
                      {foundOrder.orderNumber}
                    </div>
                    <div className="text-zinc-400 text-[11px] mt-0.5">
                      গ্রাহক: {foundOrder.customerName} ({foundOrder.phone})
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">বর্তমান অবস্থা</span>
                    <div className="font-bold text-xs mt-0.5 capitalize">
                      {foundOrder.status === 'cancelled' ? (
                        <span className="text-rose-400">অর্ডার বাতিল (Cancelled)</span>
                      ) : foundOrder.status === 'delivered' ? (
                        <span className="text-emerald-400">ডেলিভার্ড (Delivered)</span>
                      ) : (
                        <span className="text-amber-400 uppercase font-mono">{foundOrder.status}</span>
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      কুরিয়ার: {foundOrder.deliveryCourier || 'Steadfast Courier'}
                    </div>
                  </div>
                </div>

                {/* Tracking Progress Timeline */}
                {foundOrder.status !== 'cancelled' ? (
                  <div className="space-y-4 py-2">
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                      {stages.map((stg, idx) => {
                        const isCompleted = idx <= currentStageIdx;
                        const isCurrent = idx === currentStageIdx;

                        return (
                          <div key={stg.key} className="relative flex items-start gap-3">
                            {/* Marker Icon */}
                            <span 
                              className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                isCompleted
                                  ? 'bg-amber-500 text-black shadow-md'
                                  : 'bg-zinc-800 text-zinc-500 border border-white/10'
                              }`}
                            >
                              {isCompleted ? '✓' : idx + 1}
                            </span>

                            <div>
                              <div className={`font-bold text-xs ${isCurrent ? 'text-amber-400' : isCompleted ? 'text-white' : 'text-zinc-500'}`}>
                                {stg.label}
                              </div>
                              <div className="text-[11px] text-zinc-400 mt-0.5">
                                {stg.desc}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                    এই অর্ডারটি কোনো কারণে বাতিল করা হয়েছে। বিস্তারিত জানতে আমাদের হেল্পলাইনে 01712-345678 যোগাযোগ করুন।
                  </div>
                )}

                {/* Items & Address Summary */}
                <div className="border-t border-white/10 pt-3 space-y-2 text-zinc-400 text-[11px]">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>ডেলিভারি ঠিকানা: {foundOrder.address}, {foundOrder.district}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white pt-1">
                    <span>সর্বমোট বিল:</span>
                    <span className="font-mono text-amber-400">৳{foundOrder.total} ({foundOrder.paymentMethod.toUpperCase()})</span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center p-6 space-y-3 bg-white/5 rounded-2xl border border-white/5">
                <AlertCircle className="w-8 h-8 text-zinc-500 mx-auto" />
                <div className="text-sm font-semibold text-white">কোনো অর্ডার পাওয়া যায়নি</div>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  আপনার দেওয়া অর্ডার নম্বর বা মোবাইল নম্বরের সাথে মিল পাওয়া যায়নি। সঠিক তথ্য দিয়ে পুনরায় চেষ্টা করুন।
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
