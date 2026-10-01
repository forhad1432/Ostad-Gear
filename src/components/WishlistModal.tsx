import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, ProductSize } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size: ProductSize) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#12141a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-auto p-5 sm:p-6 space-y-4 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            <h2 className="text-base sm:text-lg font-bold text-white font-display">
              আপনার উইশলিস্ট ({wishlist.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 space-y-3">
          {wishlist.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 space-y-3">
              <Heart className="w-10 h-10 mx-auto text-zinc-600" />
              <p className="text-xs">আপনার উইশলিস্টে কোনো পণ্য যোগ করা নেই।</p>
            </div>
          ) : (
            wishlist.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-14 h-16 object-cover rounded-xl bg-zinc-900"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-white line-clamp-1">
                      {product.title}
                    </h4>
                    <div className="text-xs font-mono font-bold text-amber-400 mt-1">
                      ৳{product.price}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onAddToCart(product, product.sizes[0] || 'L');
                      onRemoveFromWishlist(product.id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>ব্যাগে নিন</span>
                  </button>

                  <button
                    onClick={() => onRemoveFromWishlist(product.id)}
                    className="p-2 text-zinc-500 hover:text-rose-400 transition"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
