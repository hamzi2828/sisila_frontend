'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { publicProductService, type PublicProduct } from '../../main/services/publicProductService';
import { addToCart } from '@/helper/cartHelper';
import ProductHeader from '../components/ProductHeader';
import ProductGallery from '../components/ProductGallery';
import ProductBuyBox from '../components/ProductBuyBox';
import ProductMore from '../components/ProductMore';

type CategoryId = string;
type ThemeId = string;
type SeriesId = string;

type Product = {
  title: string;
  price: number;
  rating?: number;
  reviews?: number;
  images: string[];
  badges?: ('New' | 'Limited' | 'Drop')[];
  colors?: string[];
  sizes?: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];
  stock?: 'in' | 'low' | 'out';
  categoryId: CategoryId;
  themeId: ThemeId;
  seriesId?: SeriesId;
  description: string;
  shortDescription?: string;
  features?: string;
};

const money = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

// Helper to normalize size names
function normalizeSize(size: string): 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | undefined {
  const sizeMap: { [key: string]: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' } = {
    'extra small': 'XS',
    'xs': 'XS',
    'small': 'S',
    's': 'S',
    'medium': 'M',
    'm': 'M',
    'large': 'L',
    'l': 'L',
    'extra large': 'XL',
    'xl': 'XL',
    'xxl': 'XXL',
    '2xl': 'XXL',
  };
  return sizeMap[size.toLowerCase()];
}

function mapPublicProductToProduct(p: PublicProduct): Product {
  // Map images from colorMedia or bannerUrls
  let images: string[] = [];

  if (p.productType === 'variant' && p.colorMedia) {
    // For variant products, collect images from the first available color
    const firstColor = Object.keys(p.colorMedia)[0];
    if (firstColor && p.colorMedia[firstColor]) {
      const media = p.colorMedia[firstColor];
      if (media.thumbnailUrl) {
        const thumb = media.thumbnailUrl.startsWith('http')
          ? media.thumbnailUrl
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}${media.thumbnailUrl}`;
        images.push(thumb);
      }
      if (media.bannerUrls) {
        media.bannerUrls.forEach((url) => {
          const banner = url.startsWith('http')
            ? url
            : `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;
          images.push(banner);
        });
      }
    }
  } else if (p.bannerUrls && p.bannerUrls.length > 0) {
    images = p.bannerUrls.map((url) =>
      url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`
    );
  } else if (p.thumbnailUrl) {
    const thumb = p.thumbnailUrl.startsWith('http')
      ? p.thumbnailUrl
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}${p.thumbnailUrl}`;
    images = [thumb];
  }

  // Extract unique colors from variants
  const colors = p.productType === 'variant' && p.variants
    ? Array.from(new Set(p.variants.map(v => v.color).filter((c): c is string => Boolean(c))))
    : undefined;

  // Extract unique sizes from variants and normalize them
  const sizes = p.productType === 'variant' && p.variants
    ? Array.from(new Set(p.variants.map(v => v.size ? normalizeSize(v.size) : undefined).filter((s): s is 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' => Boolean(s))))
    : undefined;

  // Determine stock status
  let stock: 'in' | 'low' | 'out' = 'out';
  if (p.stock > 10) stock = 'in';
  else if (p.stock > 0) stock = 'low';

  // Convert category to categoryId format (lowercase with dashes)
  const categoryId: CategoryId = (p.category || 'General')
    .toLowerCase()
    .replace(/\s+/g, '-');

  // Handle theme and series IDs based on collectionType
  let themeId: ThemeId = 'general';
  let seriesId: SeriesId | undefined = undefined;

  if (p.collectionType === 'theme' && p.collectionId) {
    themeId = p.collectionId;
  } else if (p.collectionType === 'series' && p.collectionId) {
    seriesId = p.collectionId;
  }

  return {
    title: p.name,
    price: p.discountedPrice || p.price,
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80'],
    badges: p.featured ? ['New'] : undefined,
    colors,
    sizes,
    stock,
    categoryId,
    themeId,
    seriesId,
    description: p.description || '',
    shortDescription: p.shortDescription || '',
    features: p.features || '',
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [rawProduct, setRawProduct] = useState<PublicProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState<string | undefined>();
  const [size, setSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | undefined>();

  // Update images when color changes
  useEffect(() => {
    if (!rawProduct || !color) return;

    if (rawProduct.productType === 'variant' && rawProduct.colorMedia && rawProduct.colorMedia[color]) {
      const media = rawProduct.colorMedia[color];
      const newImages: string[] = [];

      if (media.thumbnailUrl) {
        const thumb = media.thumbnailUrl.startsWith('http')
          ? media.thumbnailUrl
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}${media.thumbnailUrl}`;
        newImages.push(thumb);
      }

      if (media.bannerUrls) {
        media.bannerUrls.forEach((url) => {
          const banner = url.startsWith('http')
            ? url
            : `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;
          newImages.push(banner);
        });
      }

      if (newImages.length > 0) {
        setProduct(prev => prev ? { ...prev, images: newImages } : null);
        setActiveImage(0);
      }
    }
  }, [color, rawProduct]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await publicProductService.getProductById(productId);

        if (!response.success || !response.data) {
          throw new Error('Product not found');
        }

        setRawProduct(response.data);
        const mappedProduct = mapPublicProductToProduct(response.data);
        setProduct(mappedProduct);

        // Set default color and size
        if (mappedProduct.colors && mappedProduct.colors.length > 0) {
          setColor(mappedProduct.colors[0]);
        }
        if (mappedProduct.sizes && mappedProduct.sizes.length > 0) {
          setSize(mappedProduct.sizes[1] || mappedProduct.sizes[0]);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-stone-300 border-t-stone-600"></div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Product not found'}</p>
          <Link href="/shop" className="mt-4 inline-block text-stone-600 hover:text-stone-900 underline">
            Return to shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <div className="px-6 md:px-10 lg:px-20 pt-6">
        <div className="mx-auto max-w-7xl">
          <ProductHeader product={product} />

          <div className="mt-6 grid gap-8 lg:grid-cols-12">
            <section className="lg:col-span-7">
              <ProductGallery
                title={product.title}
                images={product.images}
                badges={product.badges}
                activeImage={activeImage}
                setActiveImage={setActiveImage}
              />
            </section>

            <aside className="lg:col-span-5">
              <ProductBuyBox
                product={product}
                productId={productId}
                rawProduct={rawProduct}
                money={money}
                color={color}
                setColor={setColor}
                size={size}
                setSize={(v: string) => setSize(v as 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')}
              />
            </aside>
          </div>

          <ProductMore
            product={product}
            money={money}
            collectionType={rawProduct?.collectionType === 'none' ? null : rawProduct?.collectionType}
            currentProductId={productId}
          />
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/85 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">{product.title}</p>
            <p className="text-xs text-stone-600">{money(product.price)}</p>
          </div>
          <button
            onClick={async () => {
              if (product.stock === 'out') return;
              try {
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
                await addToCart({
                  productId: productId,
                  productName: product.title,
                  price: product.price,
                  discountedPrice: rawProduct?.discountedPrice,
                  quantity: 1,
                  variant,
                  thumbnailUrl: product.images[0],
                  stock: rawProduct?.stock
                });
              } catch (error) {
                console.error('Error adding to cart:', error);
              }
            }}
            disabled={product.stock === 'out'}
            className={[
              'inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white',
              product.stock === 'out' ? 'opacity-60 cursor-not-allowed' : 'hover:bg-stone-800'
            ].join(' ')}
          >
            Add to bag
          </button>
        </div>
      </div>
    </main>
  );
}
