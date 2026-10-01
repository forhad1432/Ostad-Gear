import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Zap, 
  Heart, 
  Truck, 
  ShieldCheck, 
  Ruler, 
  Check, 
  RotateCcw
} from 'lucide-react';
import { Product, ProductSize } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: ProductSize, quantity: number, color?: string) => void;
  onBuyNow: (product: Product, size: ProductSize, quantity: number, color?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[0] || 'L');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || '');
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeChart, setShowSizeChart] = useState<boolean>(false);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  const images = [product.image, ...(product.additionalImages || [])];

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, quantity, selectedColor);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1500);
  };

  const handleBuyNow = () => {
    onBuyNow(product, selectedSize, quantity, selectedColor);
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  // Size chart guide data
  const sizeMeasurements = [
    { size: 'S', chest: '38 in', length: '26 in', shoulder: '18 in' },
    { size: 'M', chest: '40 in', length: '27 in', shoulder: '19 in' },
    { size: 'L', chest: '42 in', length: '28 in', shoulder: '20 in' },
    { size: 'XL', chest: '44 in', length: '29 in', shoulder: '21 in' },
    { size: 'XXL', chest: '46 in', length: '30 in', shoulder: '22 in' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#12141a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-zinc-300 hover:text-white hover:bg-black/80 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left: Image Gallery */}
          <div className="md:col-span-6 p-4 sm:p-6 flex flex-col gap-3 bg-[#0c0d10]">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
              {discount > 0 && (
                <div className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-xs px-2.5 py-1 rounded-md shadow-lg">
                  -{discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                      selectedImage === img ? 'border-amber-400 scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantees Box */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 text-zinc-300">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>ঢাকার ভেতর ২৪-৪৮ ঘণ্টা</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 text-zinc-300">
                <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
                <span>৭ দিনে ফ্রি সাইজ পরিবর্তন</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              {/* Category, Rating & Wishlist */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold">
                  {product.category} · Premium Quality
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs font-semibold bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-zinc-500">({product.reviewsCount})</span>
                  </div>
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`p-2 rounded-full border transition ${
                      isWishlisted 
                        ? 'border-rose-500 bg-rose-500/10 text-rose-500' 
                        : 'border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display leading-tight">
                  {product.title}
                </h2>
                {product.titleBn && (
                  <p className="text-sm text-zinc-400 mt-1 font-medium">
                    {product.titleBn}
                  </p>
                )}
              </div>

              {/* Pricing in Bangladeshi Taka */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  ৳{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-zinc-400 line-through font-mono">
                    ৳{product.originalPrice}
                  </span>
                )}
                <span className="text-xs text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-500/10 rounded">
                  ৳{product.originalPrice - product.price} সেইভ করুন
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {product.description}
              </p>

              {/* Fabric Specs */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1 text-xs">
                <div className="text-zinc-400">
                  <strong className="text-white">ফ্যাব্রিক ডিটেইলস:</strong> {product.fabricDetails.composition} ({product.fabricDetails.gsm} GSM)
                </div>
                <div className="text-zinc-400">
                  <strong className="text-white">ফিট:</strong> {product.fabricDetails.fit}
                </div>
                <div className="text-zinc-400">
                  <strong className="text-white">যত্ন:</strong> {product.fabricDetails.care}
                </div>
              </div>

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-2 block">
                    কালার সিলেক্ট করুন: <span className="text-amber-400">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                          selectedColor === c.name
                            ? 'border-amber-400 bg-amber-400/10 text-white'
                            : 'border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-white/20" 
                          style={{ backgroundColor: c.hex }} 
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector + Size Chart Modal Button */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-zinc-300">
                    সাইজ সিলেক্ট করুন (Size):
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSizeChart(!showSizeChart)}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>সাইজ চার্ট (Size Guide)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-11 h-10 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                        selectedSize === size
                          ? 'bg-amber-500 text-black shadow-md font-extrabold scale-105'
                          : 'bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white border border-white/5'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Size Chart View */}
                {showSizeChart && (
                  <div className="mt-3 p-3 bg-zinc-900 rounded-xl border border-white/10 text-xs">
                    <div className="font-bold text-white mb-2">স্ট্রিটওয়্যার সাইজ চার্ট (ইঞ্চি / Inches):</div>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-zinc-500 border-b border-white/10">
                          <th className="pb-1">Size</th>
                          <th className="pb-1">Chest (বুকে)</th>
                          <th className="pb-1">Length (লম্বা)</th>
                          <th className="pb-1">Shoulder</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-zinc-300">
                        {sizeMeasurements.map((m) => (
                          <tr key={m.size} className={selectedSize === m.size ? 'text-amber-400 font-bold bg-amber-400/5' : ''}>
                            <td className="py-1">{m.size}</td>
                            <td className="py-1">{m.chest}</td>
                            <td className="py-1">{m.length}</td>
                            <td className="py-1">{m.shoulder}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-zinc-300">পরিমাণ (Quantity):</span>
                <div className="flex items-center border border-white/10 rounded-xl bg-white/5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-zinc-400 hover:text-white text-base font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-bold text-white font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 text-zinc-400 hover:text-white text-base font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-zinc-500">
                  (সর্বোচ্চ {product.stock} টি স্টক আছে)
                </span>
              </div>

            </div>

            {/* Bottom Action CTAs */}
            <div className="space-y-2 pt-4 border-t border-white/10">
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition shadow-lg ${
                    addedNotice
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ব্যাগে যোগ হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>ব্যাগে যোগ করুন</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-lg shadow-amber-500/20 active:scale-95 transition"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>এখনই অর্ডার করুন (Buy Now)</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>বিকাশ, নগদ, রকেট অথবা সরাসরি ক্যাশ অন ডেলিভারিতে নিন</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
