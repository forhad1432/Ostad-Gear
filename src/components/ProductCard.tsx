import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { Product, ProductSize } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: ProductSize) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[0] || 'L');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'dropshoulder': return 'Drop Shoulder';
      case 'jersey': return 'Sports Jersey';
      case 'hoodie': return 'Heavy Hoodie';
      case 'tshirt': return 'Crewneck Tee';
      default: return category;
    }
  };

  return (
    <div 
      onClick={() => onQuickView(product)}
      className="group relative bg-[#13161c] rounded-2xl border border-white/5 hover:border-amber-500/40 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer shadow-lg hover:shadow-amber-500/5"
    >
      {/* Product Image Box */}
      <div className="relative aspect-[3/4] bg-zinc-900 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercentage > 0 && (
            <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-md">
              -{discountPercentage}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-500 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
              HOT DROP
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition z-10 ${
            isWishlisted 
              ? 'bg-rose-500 text-white' 
              : 'bg-black/40 text-white/80 hover:text-white hover:bg-black/70'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex items-center gap-1.5 bg-white text-black text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg hover:bg-amber-400 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>বিস্তারিত দেখুন</span>
          </button>
        </div>
      </div>

      {/* Product Details Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-mono text-amber-400/90 font-medium">
              {getCategoryLabel(product.category)}
            </span>
            <div className="flex items-center gap-1 text-zinc-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-[11px]">{product.rating}</span>
              <span className="text-zinc-500 text-[10px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-white group-hover:text-amber-400 transition line-clamp-2 leading-snug">
            {product.title}
          </h3>
          {product.titleBn && (
            <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1 font-normal">
              {product.titleBn}
            </p>
          )}
        </div>

        {/* Size Selection Pills */}
        <div className="pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-zinc-400 font-medium mr-1">সাইজ:</span>
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition ${
                  selectedSize === size
                    ? 'bg-amber-500 text-black shadow-sm font-bold'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing & Add To Cart Button */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-extrabold text-white font-mono flex items-baseline gap-1.5">
              <span>৳{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-zinc-400 line-through font-normal">
                  ৳{product.originalPrice}
                </span>
              )}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium">
              ইন স্টক ({product.stock} টি অবশিষ্ট)
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
              addedAnimation
                ? 'bg-emerald-500 text-white'
                : 'bg-white/10 hover:bg-amber-500 hover:text-black text-white'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>যোগ হয়েছে!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>ব্যাগে নিন</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
