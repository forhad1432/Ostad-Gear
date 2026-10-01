import React, { useRef } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Printer, 
  Truck, 
  ShoppingBag, 
  ExternalLink 
} from 'lucide-react';
import { Order } from '../types';
import { OstadGearLogo } from './OstadGearLogo';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onTrackOrder,
}) => {
  if (!order) return null;

  const [copied, setCopied] = React.useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#12141a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-auto p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Success Badge */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
            ধন্যবাদ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            আমাদের কাস্টমার কেয়ার টিম শীঘ্রই আপনার অর্ডারটি ভেরিফাই করে পার্সেল ডিসপ্যাচ করবে।
          </p>
        </div>

        {/* Invoice Summary Card */}
        <div 
          ref={invoiceRef}
          className="p-5 rounded-2xl bg-[#0c0d10] border border-white/10 space-y-4 text-xs"
        >
          {/* Brand & Slip Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-black flex items-center justify-center border border-white/10 shrink-0">
                <OstadGearLogo className="w-8 h-8" />
              </div>
              <div>
                <span className="font-black text-white text-sm font-brand tracking-[0.14em] block">
                  OSTAD <span className="text-amber-400">GEAR</span>
                </span>
                <span className="text-[10px] text-zinc-400">অফিশিয়াল অর্ডার ইনভয়েস</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">অর্ডার নম্বর</span>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="font-mono text-sm font-extrabold text-amber-400">
                  {order.orderNumber}
                </span>
                <button
                  onClick={copyOrderNumber}
                  className="p-1 text-zinc-400 hover:text-white rounded bg-white/5 transition"
                  title="Copy Order ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                {new Date(order.orderDate).toLocaleDateString('bn-BD', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-2 gap-3 text-zinc-300">
            <div>
              <span className="text-zinc-500 block text-[10px]">গ্রাহকের নাম:</span>
              <strong className="text-white text-xs">{order.customerName}</strong>
              <div className="font-mono text-[11px] text-zinc-400">{order.phone}</div>
            </div>

            <div>
              <span className="text-zinc-500 block text-[10px]">ডেলিভারি ঠিকানা:</span>
              <div className="text-[11px] line-clamp-2">
                {order.address}, {order.thanaCity}, {order.district}
              </div>
              <div className="text-[10px] text-amber-400 font-medium mt-0.5">
                {order.deliveryZone === 'inside_dhaka' ? 'ঢাকা (২৪-৪৮ ঘণ্টা)' : 'ঢাকার বাইরে (২-৪ দিন)'}
              </div>
            </div>
          </div>

          {/* Payment Method Badge */}
          <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between text-[11px]">
            <div>
              <span className="text-zinc-400">পেমেন্ট মেথড: </span>
              <strong className="text-white uppercase font-mono">{order.paymentMethod}</strong>
              {order.trxId && (
                <span className="text-zinc-400 font-mono ml-2">
                  (TrxID: <span className="text-amber-400 font-bold">{order.trxId}</span>)
                </span>
              )}
            </div>
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
              {order.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : 'পেমেন্ট সাবমিটেড'}
            </span>
          </div>

          {/* Items Table */}
          <div className="space-y-2 border-t border-white/10 pt-3">
            <span className="text-zinc-500 text-[10px] uppercase tracking-wider block">অর্ডারকৃত আইটেমস</span>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-zinc-300">
                <div className="flex items-center gap-2">
                  <img src={item.image} alt="" className="w-8 h-10 object-cover rounded bg-zinc-800" />
                  <div>
                    <div className="font-medium text-white line-clamp-1">{item.title}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      Size: {item.size} · Qty: {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="font-mono font-bold text-white">
                  ৳{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-white/10 pt-3 space-y-1 text-zinc-400">
            <div className="flex justify-between">
              <span>সাবটোটাল</span>
              <span className="font-mono text-white">৳{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>ডিসকাউন্ট</span>
                <span className="font-mono">-৳{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>ডেলিভারি চার্জ</span>
              <span className="font-mono text-white">৳{order.deliveryFee}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-white border-t border-white/10 pt-2">
              <span>মোট পরিশোধযোগ্য</span>
              <span className="font-mono text-amber-400 text-base">৳{order.total}</span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => {
              onTrackOrder(order.orderNumber);
              onClose();
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition"
          >
            <Truck className="w-4 h-4" />
            <span>অর্ডার ট্র্যাক করুন</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>ইনভয়েস প্রিন্ট</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>আরও শপিং করুন</span>
          </button>
        </div>

      </div>
    </div>
  );
};
