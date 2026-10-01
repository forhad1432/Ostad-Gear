import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  User, 
  Truck, 
  CreditCard, 
  AlertCircle,
  Trash2,
  ShoppingBag
} from 'lucide-react';
import { CartItem, Order, PaymentMethod } from '../types';
import { BANGLADESH_DISTRICTS, PAYMENT_NUMBERS } from '../data/bangladeshDistricts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedCoupon: string | null;
  couponDiscount: number;
  onOrderSuccess: (order: Order) => Promise<void> | void;
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, newQty: number) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedCoupon,
  couponDiscount,
  onOrderSuccess,
  onRemoveItem,
  onUpdateQuantity,
}) => {
  if (!isOpen) return null;

  // Form states - Default to Cash on Delivery for frictionless BD checkout
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Dhaka');
  const [thanaCity, setThanaCity] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryZone, setDeliveryZone] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [trxId, setTrxId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Financial calculations
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = deliveryZone === 'inside_dhaka' ? 60 : 120;
  const total = Math.max(0, subtotal - couponDiscount) + deliveryFee;

  // Update delivery zone when district changes
  const handleDistrictChange = (distName: string) => {
    setSelectedDistrict(distName);
    const dist = BANGLADESH_DISTRICTS.find(d => d.name === distName);
    if (dist?.isDhaka) {
      setDeliveryZone('inside_dhaka');
    } else {
      setDeliveryZone('outside_dhaka');
    }
  };

  const copyPaymentNumber = (num: string) => {
    navigator.clipboard.writeText(num.replace(/-/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!customerName.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 11) {
      setErrorMsg('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন।');
      return;
    }
    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') && !trxId.trim()) {
      setErrorMsg('পেমেন্ট সফল করার পর প্রাপ্ত Transaction ID (TrxID) প্রদান করুন।');
      return;
    }

    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedOrderNumber = `OG-BD-${randomSuffix}`;

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: generatedOrderNumber,
      customerName: customerName.trim(),
      phone: phone.trim(),
      altPhone: altPhone.trim() || undefined,
      district: selectedDistrict,
      thanaCity: thanaCity.trim() || selectedDistrict,
      address: address.trim(),
      deliveryZone,
      deliveryFee,
      paymentMethod,
      paymentNumber: senderNumber.trim() || undefined,
      trxId: trxId.trim() || undefined,
      items: items.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        category: item.product.category,
        image: item.product.image,
        size: item.selectedSize,
        color: item.selectedColor,
        price: item.product.price,
        quantity: item.quantity,
      })),
      subtotal,
      discount: couponDiscount,
      total,
      status: 'pending',
      orderDate: new Date().toISOString(),
      deliveryCourier: deliveryZone === 'inside_dhaka' ? 'Pathao Courier / RedX' : 'Steadfast Courier',
      trackingCode: `STF-${randomSuffix}`,
      notes: notes.trim() || undefined,
    };

    try {
      await Promise.resolve(onOrderSuccess(newOrder));
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      console.error('Order submission error:', err);
      setIsSubmitting(false);
      setErrorMsg(err?.message || 'অর্ডার সাবমিট করতে সমস্যা হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#12141a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0c0d10] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                চেকআউট ও ডেলিভারি তথ্য
              </h2>
              <p className="text-xs text-zinc-400">
                নিরাপদ পেমেন্ট ও হোম ডেলিভারি নিশ্চিত করুন
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

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Customer & Delivery Address */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                <User className="w-4 h-4 text-amber-400" />
                <span>গ্রাহক ও ডেলিভারি ঠিকানা</span>
              </h3>

              <div className="space-y-3">
                {/* Customer Name */}
                <div>
                  <label className="text-xs text-zinc-300 font-semibold mb-1 block">
                    আপনার নাম *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="পুরো নাম লিখুন (যেমন: ফরহাদ আহমেদ)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Phone Numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-300 font-semibold mb-1 block">
                      মোবাইল নম্বর *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="tel"
                        required
                        placeholder="017xxxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-300 font-semibold mb-1 block">
                      বিকল্প নম্বর (ঐচ্ছিক)
                    </label>
                    <input
                      type="tel"
                      placeholder="018xxxxxxxx"
                      value={altPhone}
                      onChange={(e) => setAltPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                {/* District & Delivery Zone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-300 font-semibold mb-1 block">
                      জেলা (District) *
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full bg-[#181a22] border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                    >
                      {BANGLADESH_DISTRICTS.map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name} ({d.bnName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-300 font-semibold mb-1 block">
                      থানা / এরিয়া / উপজেলা
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: মিরপুর / ধানমন্ডি / সদর"
                      value={thanaCity}
                      onChange={(e) => setThanaCity(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Delivery Zone Selector Cards */}
                <div>
                  <label className="text-xs text-zinc-300 font-semibold mb-1.5 block">
                    ডেলিভারি এরিয়া সিলেক্ট করুন:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryZone('inside_dhaka')}
                      className={`p-3 rounded-xl border text-left transition ${
                        deliveryZone === 'inside_dhaka'
                          ? 'border-amber-400 bg-amber-400/10'
                          : 'border-white/10 bg-white/5 opacity-70'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">ঢাকার ভিতরে</div>
                      <div className="text-[11px] text-zinc-400">চার্জ: ৳৬০ (২৪-৪৮ ঘণ্টা)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryZone('outside_dhaka')}
                      className={`p-3 rounded-xl border text-left transition ${
                        deliveryZone === 'outside_dhaka'
                          ? 'border-amber-400 bg-amber-400/10'
                          : 'border-white/10 bg-white/5 opacity-70'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">ঢাকার বাইরে</div>
                      <div className="text-[11px] text-zinc-400">চার্জ: ৳১২০ (২-৪ দিন)</div>
                    </button>
                  </div>
                </div>

                {/* Full Address */}
                <div>
                  <label className="text-xs text-zinc-300 font-semibold mb-1 block">
                    সম্পূর্ণ ঠিকানা (বাসা/রোড নম্বর) *
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
                    <textarea
                      required
                      rows={2}
                      placeholder="বাড়ি নম্বর, রোড নম্বর, ফ্ল্যাট নম্বর, এলাকা..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Optional Notes */}
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">
                    ডেলিভারি নোট বা বিশেষ নির্দেশনা (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: বিকেলে ডেলিভারি করবেন বা ফোন দিয়ে আসবেন"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

              </div>
            </div>

            {/* Right Column: Payment Method & Order Summary */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>পেমেন্ট মেথড নির্বাচন করুন</span>
              </h3>

              {/* Payment Option Selector */}
              <div className="grid grid-cols-2 gap-2">
                {/* bKash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                    paymentMethod === 'bkash'
                      ? 'border-[#e2136e] bg-[#e2136e]/15 text-white font-bold'
                      : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-[#e2136e] text-white flex items-center justify-center font-bold text-[10px]">
                    b
                  </span>
                  <div className="text-left">
                    <div className="text-xs font-bold">বিকাশ (bKash)</div>
                    <div className="text-[10px] text-zinc-400">Send Money</div>
                  </div>
                </button>

                {/* Nagad */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                    paymentMethod === 'nagad'
                      ? 'border-[#f7941d] bg-[#f7941d]/15 text-white font-bold'
                      : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-[#f7941d] text-white flex items-center justify-center font-bold text-[10px]">
                    N
                  </span>
                  <div className="text-left">
                    <div className="text-xs font-bold">নগদ (Nagad)</div>
                    <div className="text-[10px] text-zinc-400">Send Money</div>
                  </div>
                </button>

                {/* Rocket */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('rocket')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                    paymentMethod === 'rocket'
                      ? 'border-[#8c3494] bg-[#8c3494]/15 text-white font-bold'
                      : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-[#8c3494] text-white flex items-center justify-center font-bold text-[10px]">
                    R
                  </span>
                  <div className="text-left">
                    <div className="text-xs font-bold">রকেট (Rocket)</div>
                    <div className="text-[10px] text-zinc-400">Send Money</div>
                  </div>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-500 bg-emerald-500/15 text-white font-bold'
                      : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-[10px]">
                    ৳
                  </span>
                  <div className="text-left">
                    <div className="text-xs font-bold">ক্যাশ অন ডেলিভারি</div>
                    <div className="text-[10px] text-zinc-400">পণ্য পেয়ে মূল্য দিন</div>
                  </div>
                </button>
              </div>

              {/* Dynamic Payment Instruction Panel */}
              {paymentMethod !== 'cod' ? (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">
                      {paymentMethod === 'bkash' ? 'বিকাশ নম্বর' : paymentMethod === 'nagad' ? 'নগদ নম্বর' : 'রকেট নম্বর'} (Personal/Agent):
                    </span>
                    <button
                      type="button"
                      onClick={() => copyPaymentNumber(PAYMENT_NUMBERS[paymentMethod])}
                      className="flex items-center gap-1 font-mono font-bold text-amber-400 hover:text-amber-300 text-xs bg-white/5 px-2 py-1 rounded"
                    >
                      {PAYMENT_NUMBERS[paymentMethod]}
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-white/5 pt-1.5">
                    <span className="text-zinc-400">বিকল্প পেমেন্ট নম্বর:</span>
                    <button
                      type="button"
                      onClick={() => copyPaymentNumber(PAYMENT_NUMBERS.secondaryNumber)}
                      className="flex items-center gap-1 font-mono font-bold text-zinc-300 hover:text-amber-300 text-xs bg-white/5 px-2 py-0.5 rounded"
                    >
                      {PAYMENT_NUMBERS.secondaryNumber}
                      <Copy className="w-3 h-3 text-zinc-400" />
                    </button>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 text-[11px] text-zinc-300 space-y-1">
                    <p className="font-semibold text-amber-400">পেমেন্ট করার নিয়ম:</p>
                    <ol className="list-decimal pl-4 space-y-0.5 text-zinc-400">
                      <li>অ্যাপ থেকে "Send Money" করুন: <span className="text-white font-mono">{PAYMENT_NUMBERS[paymentMethod]}</span> বা <span className="text-white font-mono">{PAYMENT_NUMBERS.secondaryNumber}</span></li>
                      <li>টাকার পরিমাণ লিখুন: <span className="text-amber-400 font-bold font-mono">৳{total}</span></li>
                      <li>পেমেন্ট শেষে প্রাপ্ত <span className="text-white font-semibold">TrxID</span> নিচে লিখে কনফার্ম করুন</li>
                    </ol>
                  </div>

                  {/* TrxID & Sender Phone */}
                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                        ট্রানজেকশন আইডি (TrxID) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: 8N47A6B29C"
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                        className="w-full bg-black/50 border border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none uppercase font-mono tracking-wider"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">
                        যে নম্বর থেকে টাকা পাঠিয়েছেন (ঐচ্ছিক)
                      </label>
                      <input
                        type="tel"
                        placeholder="01xxxxxxxxx"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>ক্যাশ অন ডেলিভারি (Cash on Delivery) সক্রিয়</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    ডেলিভারি ম্যান আপনার ঠিকানায় পার্সেল নিয়ে গেলে চেক করে টাকা পরিশোধ করতে পারবেন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।
                  </p>
                </div>
              )}

              {/* Order Summary Receipt Box */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span className="font-bold text-white text-xs">
                    অর্ডার সামারি ({items.reduce((acc, i) => acc + i.quantity, 0)} টি আইটেম)
                  </span>
                  <span className="text-[10px] text-amber-400 font-medium">
                    প্রোডাক্ট মুছুন বা পরিবর্তন করুন
                  </span>
                </div>

                {items.length === 0 ? (
                  <div className="py-6 text-center space-y-2">
                    <ShoppingBag className="w-8 h-8 text-zinc-600 mx-auto" />
                    <p className="text-zinc-400 text-xs font-semibold">আপনার অর্ডারে কোনো প্রোডাক্ট নেই</p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-3.5 py-1.5 bg-amber-500 text-black font-bold text-xs rounded-lg hover:bg-amber-400 transition"
                    >
                      শপিংয়ে ফিরে যান
                    </button>
                  </div>
                ) : (
                  <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                    {items.map((i) => (
                      <div key={i.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-black/40 border border-white/5 group">
                        <img 
                          src={i.product.image} 
                          alt="" 
                          className="w-10 h-12 object-cover rounded-lg bg-zinc-800 shrink-0" 
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-[11px] font-semibold text-white truncate max-w-[170px]" title={i.product.title}>
                              {i.product.title}
                            </h4>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(i.id)}
                              className="text-zinc-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition shrink-0"
                              title="অর্ডার থেকে এই প্রোডাক্টটি মুছুন (Remove)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
                            <div className="flex items-center gap-1.5">
                              <span className="bg-white/10 px-1.5 py-0.2 rounded text-[10px] text-zinc-300 font-mono font-bold">
                                {i.selectedSize}
                              </span>
                              
                              {/* Quantity Stepper */}
                              <div className="flex items-center border border-white/10 rounded-md bg-white/5 ml-1">
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(i.id, i.quantity - 1)}
                                  className="px-1.5 py-0.5 text-zinc-400 hover:text-white font-bold text-xs"
                                  title="কমান"
                                >
                                  -
                                </button>
                                <span className="px-1.5 font-mono text-[10px] font-bold text-white">{i.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(i.id, i.quantity + 1)}
                                  className="px-1.5 py-0.5 text-zinc-400 hover:text-white font-bold text-xs"
                                  title="বাড়ান"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <span className="font-mono font-bold text-white text-xs">
                              ৳{i.product.price * i.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-white/10 pt-2 space-y-1 text-zinc-400">
                  <div className="flex justify-between">
                    <span>আইটেম মোট</span>
                    <span className="font-mono text-white">৳{subtotal}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>কুপন ডিসকাউন্ট ({appliedCoupon})</span>
                      <span className="font-mono">-৳{couponDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>ডেলিভারি চার্জ ({deliveryZone === 'inside_dhaka' ? 'ঢাকা' : 'ঢাকার বাইরে'})</span>
                    <span className="font-mono text-white">৳{deliveryFee}</span>
                  </div>
                  <div className="border-t border-white/10 pt-1.5 flex justify-between font-extrabold text-sm text-white">
                    <span>সর্বমোট প্রদেয়</span>
                    <span className="text-amber-400 font-mono text-base">৳{total}</span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-black font-extrabold text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>অর্ডার প্রসেস হচ্ছে...</span>
                ) : items.length === 0 ? (
                  <span>অর্ডারে পণ্য যুক্ত করুন</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 fill-black" />
                    <span>অর্ডার কনফার্ম করুন (৳{total})</span>
                  </>
                )}
              </button>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
