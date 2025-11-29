'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { addToCart } from '@/helper/cartHelper';
import { toggleWishlist, isInWishlist } from '@/helper/wishlistHelper';

export default function ProductBuyBox({
  product,
  productId,
  rawProduct,
  money,
  color,
  setColor,
  size,
  setSize,
}: {
  product: any;
  productId: string;
  rawProduct: any;
  money: (v: number) => string;
  color: string | undefined;
  setColor: (v: string) => void;
  size: string | undefined;
  setSize: (v: string) => void;
}) {
  const inStock = product.stock !== 'out';
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  // Check if product is in wishlist on mount
  useEffect(() => {
    setIsInWishlistState(isInWishlist(productId));
  }, [productId]);

  // Listen for wishlist updates
  useEffect(() => {
    const handleWishlistUpdate = (event: CustomEvent) => {
      const { productId: updatedProductId, isAdded } = event.detail;
      if (updatedProductId === productId) {
        setIsInWishlistState(isAdded);
      }
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate as EventListener);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate as EventListener);
    };
  }, [productId]);

  const handleAddToCart = async () => {
    if (product.stock === 'out') return;

    setIsAddingToCart(true);
    try {
      // Find the selected variant if product has variants
      let variant = undefined;
      if (rawProduct?.productType === 'variant' && rawProduct?.variants && (color || size)) {
        const matchingVariant = rawProduct.variants.find((v: any) =>
          (!color || v.color === color) && (!size || v.size === size)
        );

        if (matchingVariant) {
          variant = {
            variantId: matchingVariant._id || `${color}-${size}`,
            color: matchingVariant.color,
            size: matchingVariant.size,
            price: matchingVariant.price,
            variantSku: matchingVariant.sku,
            originalVariantStock: matchingVariant.stock
          };
        }
      }

      // Get the thumbnail URL
      let thumbnailUrl = product.images[0];
      if (color && rawProduct?.colorMedia?.[color]?.thumbnailUrl) {
        thumbnailUrl = rawProduct.colorMedia[color].thumbnailUrl.startsWith('http')
          ? rawProduct.colorMedia[color].thumbnailUrl
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}${rawProduct.colorMedia[color].thumbnailUrl}`;
      }

      await addToCart({
        productId: productId,
        productName: product.title,
        price: product.price,
        discountedPrice: rawProduct?.discountedPrice,
        quantity: 1,
        variant,
        thumbnailUrl,
        stock: rawProduct?.stock
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    setIsTogglingWishlist(true);
    try {
      const result = await toggleWishlist({
        productId: productId,
        productName: product.title,
        price: product.price,
        discountedPrice: rawProduct?.discountedPrice,
        thumbnailUrl: product.images[0],
        category: rawProduct?.category
      });
      setIsInWishlistState(result);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const pretty = (id: string) =>
    id.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join(' ');

  return (
    <div className="rounded-3xl ring-1 ring-stone-200/70 bg-white/70 p-6 supports-[backdrop-filter]:bg-white/50 backdrop-blur">
      <h1 className="text-2xl md:text-3xl font-semibold">{product.title}</h1>

      <div className="mt-1 flex items-center gap-3">
        {typeof product.rating === 'number' ? (
          <div className="flex items-center gap-1 text-amber-500">
            <i className="fa-solid fa-star" aria-hidden="true" />
            <span className="text-sm text-stone-700">{product.rating.toFixed(1)}</span>
            {product.reviews ? <span className="text-sm text-stone-500">({product.reviews})</span> : null}
          </div>
        ) : null}
      </div>

      <p className="mt-3 text-xl">{money(product.price)}</p>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span
          className={[
            'inline-flex items-center gap-2 rounded-full px-3 py-1',
            product.stock === 'low'
              ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-200'
              : product.stock === 'out'
              ? 'bg-rose-50 text-rose-800 ring-1 ring-rose-200'
              : 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200',
          ].join(' ')}
        >
          <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" />
          {product.stock === 'low' ? 'Low stock' : product.stock === 'out' ? 'Out of stock' : 'In stock'}
        </span>

        <span className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-1 text-stone-700 ring-1 ring-stone-200">
          <i className="fa-solid fa-shield-halved" aria-hidden="true" /> 30-day returns
        </span>
      </div>

      {product.colors?.length ? (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-600">Color</p>
            {color ? <p className="text-sm text-stone-800">{color}</p> : null}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.colors.map((c: string) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label={`Select color ${c}`}
                className={['h-9 w-9 rounded-full ring-2 transition', color === c ? 'ring-stone-900' : 'ring-transparent hover:ring-stone-400'].join(' ')}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      ) : null}

      {product.sizes?.length ? (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-600">Size</p>
            <Link href="#" className="text-sm underline underline-offset-4 text-stone-700 hover:text-stone-900">
              Size guide
            </Link>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((s: string) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={['min-w-[3rem] rounded-xl border px-3 py-2 text-sm', size === s ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300 hover:bg-stone-50'].join(' ')}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 'out' || isAddingToCart}
          className={[
            'flex-1 inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition',
            product.stock === 'out' || isAddingToCart ? 'opacity-60 cursor-not-allowed' : 'hover:bg-stone-800'
          ].join(' ')}
        >
          {isAddingToCart ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </>
          ) : (
            'Add to bag'
          )}
        </button>
        <button
          onClick={handleToggleWishlist}
          disabled={isTogglingWishlist}
          aria-label={isInWishlistState ? "Remove from wishlist" : "Add to wishlist"}
          className="inline-flex items-center justify-center rounded-full border border-stone-300/80 bg-white p-3 hover:bg-stone-50 transition disabled:opacity-60"
          title={isInWishlistState ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isTogglingWishlist ? (
            <svg className="animate-spin h-5 w-5 text-stone-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <i className={isInWishlistState ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart"} aria-hidden="true" />
          )}
        </button>
        <button
          aria-label="Share"
          className="inline-flex items-center justify-center rounded-full border border-stone-300/80 bg-white p-3 hover:bg-stone-50"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(window.location.href);
              // Optional: Show toast notification
            } catch {}
          }}
          title="Share"
        >
          <i className="fa-solid fa-share-nodes" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-6 border-t pt-4">
        <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Part of</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Pill label={`Category: ${pretty(product.categoryId)}`} />
          {product.seriesId ? (
            <Pill label={`Series: ${pretty(product.seriesId)}`} />
          ) : product.themeId && product.themeId !== 'general' ? (
            <Pill label={`Theme: ${pretty(product.themeId)}`} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PillLink({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1 text-sm hover:bg-stone-50">
      {label}
    </a>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1 text-sm">
      {label}
    </span>
  );
}

function pretty(id: string) {
  return id.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join(' ');
}