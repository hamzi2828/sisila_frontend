'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { checkoutService, type ShippingAddress } from '../services/checkoutService';
import { toast } from 'react-hot-toast';
import { getAuthToken, isAuthenticated } from '@/helper/helper';

type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  qty: number;
  variant?: {
    color?: string;
    size?: string;
  };
};
type CheckoutState = {
  contact?: { email: string; phone?: string };
  address?: { name: string; line1: string; line2?: string; city: string; region: string; postal: string; country: string };
  shipping?: 'standard' | 'express';
  payment?: { method: 'stripe' | 'card' | 'cod'; last4?: string; name?: string };
  discount?: number;
};

// Backend cart item types
type ProductData = {
  _id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  thumbnailUrl?: string;
  bannerUrls?: string[];
  productType?: string;
  colorMedia?: {
    [color: string]: {
      thumbnailUrl: string;
      bannerUrls: string[];
    };
  };
  variants?: Array<{
    variantId: string;
    color: string;
    size: string;
    price: number;
    discountedPrice?: number;
    sku: string;
  }>;
};

type BackendCartItem = {
  productId: ProductData;
  quantity: number;
  variant?: {
    variantId?: string;
    color?: string;
    size?: string;
    price?: number;
    variantSku?: string;
  };
  _id?: string; // Cart item ID
};

type ColorMedia = {
  [color: string]: {
    thumbnailUrl: string;
    bannerUrls: string[];
  };
};

type BackendCartResponse = {
  success: boolean;
  data: {
    items: BackendCartItem[];
    totalQuantity: number;
    totalPrice: number;
  };
};

const CART_KEY = 'silsila_cart';
const CHECKOUT_KEY = 'silsila_checkout';
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const money = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [backendCartItems, setBackendCartItems] = useState<BackendCartItem[]>([]);
  const [state, setState] = useState<CheckoutState>({});
  const [method, setMethod] = useState<'stripe' | 'card' | 'cod'>('stripe');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch cart from backend
  const fetchBackendCart = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.log('No token, skipping backend cart fetch');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: BackendCartResponse = await response.json();
        if (data.success && data.data?.items) {
          setBackendCartItems(data.data.items);

          // Also transform to display format
          const transformedCart: CartItem[] = data.data.items.map((item) => {
            const product = item.productId;

            // Get image - handle variant products with colorMedia
            let image = '';

            if (product.colorMedia && Object.keys(product.colorMedia).length > 0) {
              // For variant products, try to get image based on selected variant color
              if (item.variant?.variantId && product.variants) {
                const selectedVariant = product.variants.find(v => v.variantId === item.variant?.variantId);
                if (selectedVariant?.color && product.colorMedia[selectedVariant.color]) {
                  image = product.colorMedia[selectedVariant.color].thumbnailUrl;
                }
              }

              // Fallback to first available color if variant color not found
              if (!image) {
                const firstColor = Object.keys(product.colorMedia)[0];
                image = product.colorMedia[firstColor]?.thumbnailUrl || '';
              }
            } else {
              // For regular products, use thumbnailUrl or first banner
              image = product.thumbnailUrl || product.bannerUrls?.[0] || '';
            }

            const fullImage = image && !image.startsWith('http') ? `${API_BASE_URL}${image}` : image;

            // Get variant details
            let variantInfo = undefined;
            if (item.variant?.variantId && product.variants) {
              const selectedVariant = product.variants.find(v => v.variantId === item.variant?.variantId);
              if (selectedVariant) {
                variantInfo = {
                  color: selectedVariant.color,
                  size: selectedVariant.size
                };
              }
            }

            return {
              id: item._id || product._id, // Use cart item ID for uniqueness
              title: product.name,
              price: item.variant?.price || product.discountedPrice || product.price,
              image: fullImage,
              qty: item.quantity,
              variant: variantInfo,
            };
          });

          setCart(transformedCart);
        }
      }
    } catch (error) {
      console.error('Error fetching backend cart:', error);
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem(CHECKOUT_KEY);
    if (raw) {
      const s: CheckoutState = JSON.parse(raw);
      setState(s);
      if (s.payment) {
        setMethod(s.payment.method);
        setCardName(s.payment.name || '');
        setDiscount(s.discount || 0);
      }
    }

    // Fetch cart from backend for Stripe checkout
    if (isAuthenticated()) {
      fetchBackendCart();
    } else {
      // Try to load from localStorage as fallback
      const c = localStorage.getItem(CART_KEY);
      if (c) setCart(JSON.parse(c));
    }
  }, []);

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const shipCost = state.shipping === 'express' ? 14.95 : subtotal >= 75 ? 0 : 6.95;
  const totalBefore = subtotal + shipCost;
  const total = Math.max(0, totalBefore - discount);

  const applyCode = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo codes
    const map: Record<string, number> = { SILSILA10: 10, WELCOME5: 5 };
    const off = map[code.toUpperCase()] || 0;
    setDiscount(off);
  };

  const saveAndNext = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isSubmitting) return;

    // Check if user is authenticated
    if (!isAuthenticated()) {
      toast.error('Please login to continue with checkout');
      router.push('/login?redirect=/checkout/payment');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CheckoutState = {
        ...state,
        payment: method === 'stripe' ? { method: 'stripe' } : method === 'card' ? { method, last4: cardNumber.slice(-4), name: cardName } : { method: 'cod' },
        discount,
      };
      localStorage.setItem(CHECKOUT_KEY, JSON.stringify(payload));

      // If payment method is Stripe, create checkout session
      if (method === 'stripe') {
        if (!backendCartItems || backendCartItems.length === 0) {
          toast.error('Your cart is empty. Please add items to your cart before checking out.');
          setIsSubmitting(false);
          return;
        }

        if (!state.address || !state.contact) {
          toast.error('Please complete shipping information first');
          router.push('/checkout');
          setIsSubmitting(false);
          return;
        }

        try {
          // Transform shipping address from checkout state
          const shippingAddress: ShippingAddress = {
            email: state.contact.email,
            phone: state.contact.phone || '',
            name: state.address.name,
            address: state.address.line1,
            line2: state.address.line2,
            city: state.address.city,
            region: state.address.region,
            postal: state.address.postal,
            country: state.address.country || 'United States'
          };

          // Transform cart items to Stripe format
          const stripeCartItems = backendCartItems.map(item => {
            // Find variant details
            let variantId = item.variant?.variantId || '';
            let sku = item.variant?.variantSku || '';
            let size = 'N/A';
            let color = 'N/A';
            let price = item.productId.discountedPrice || item.productId.price;

            // Find specific variant in product variants array
            if (item.productId.variants && variantId) {
              const variant = item.productId.variants.find(v => v.variantId === variantId);
              if (variant) {
                size = variant.size;
                color = variant.color;
                price = variant.discountedPrice || variant.price;
                sku = variant.sku;
              }
            }

            return {
              productId: item.productId._id,
              variantId: variantId,
              sku: sku,
              product: {
                _id: item.productId._id,
                name: item.productId.name,
                images: item.productId.bannerUrls || []
              },
              quantity: item.quantity,
              price: price,
              size: size,
              color: color
            };
          });

          // Create Stripe checkout session
          await checkoutService.createStripeCheckout(
            stripeCartItems,
            shippingAddress,
            shippingAddress // Use same for billing
          );

          // The user will be redirected to Stripe checkout
          // No need to handle success here as Stripe will redirect back
        } catch (error: any) {
          console.error('Stripe checkout error:', error);
          toast.error(error.message || 'Failed to initialize payment. Please try again.');
          setIsSubmitting(false);
        }
        return;
      }

      // For COD or other methods, redirect to review
      if (method === 'cod') {
        window.location.href = '/checkout/review';
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Failed to process payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-10">
        <div className="mx-auto max-w-7xl">
          <Steps step={2} />

          <div className="mt-6 grid gap-8 lg:grid-cols-12">
            {/* Payment form */}
            <form
              className="space-y-6 lg:col-span-7 rounded-2xl border border-stone-200 bg-white p-6"
              onSubmit={saveAndNext}
            >
              <h2 className="text-lg font-semibold">Payment</h2>

              <div className="grid gap-3">
                <Radio
                  name="payment"
                  label="Stripe (Credit / Debit Card)"
                  sub="Secure payment via Stripe - Redirects to Stripe checkout"
                  checked={method === 'stripe'}
                  onChange={() => setMethod('stripe')}
                />
                <Radio
                  name="payment"
                  label="Cash on Delivery (COD)"
                  sub="Pay when you receive your order"
                  checked={method === 'cod'}
                  onChange={() => setMethod('cod')}
                />
              </div>

              {method === 'stripe' && (
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-info-circle text-blue-600 mt-0.5"></i>
                    <div className="text-sm text-stone-700">
                      <p className="font-medium">You will be securely redirected to Stripe</p>
                      <p className="mt-1 text-stone-600">
                        Complete your payment on Stripe's secure checkout page. Your card details are never stored on our servers.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <form onSubmit={applyCode} className="flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Promo code (SILSILA10)"
                    className="flex-1 rounded-xl border border-stone-300/80 px-3 py-2 text-sm outline-none focus:border-stone-400"
                  />
                  <button className="rounded-xl border border-stone-300/80 px-3 py-2 text-sm hover:bg-stone-50">
                    Apply
                  </button>
                </form>
                {discount > 0 && <p className="mt-1 text-sm text-emerald-700">Discount applied: -{money(discount)}</p>}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link href="/checkout" className="text-sm text-stone-600 hover:text-stone-900">
                  ← Back to shipping
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : method === 'stripe' ? (
                    'Pay with Stripe'
                  ) : (
                    'Review order'
                  )}
                </button>
              </div>
            </form>

            {/* Summary */}
            <aside className="lg:col-span-5 rounded-2xl border border-stone-200 bg-white p-6">
              <h3 className="text-base font-semibold">Order Summary</h3>

              {/* Cart Items */}
              {cart.length > 0 && (
                <div className="mt-4 space-y-3 border-b border-stone-200 pb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                            priority={false}
                          />
                        )}
                        <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-xs text-white z-10">
                          {item.qty}
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-sm font-medium text-stone-900 line-clamp-1">{item.title}</p>
                          {item.variant && (
                            <p className="text-xs text-stone-500">
                              {item.variant.color} / {item.variant.size}
                            </p>
                          )}
                          <p className="text-xs text-stone-500">Qty: {item.qty}</p>
                        </div>
                        <p className="text-sm font-medium text-stone-900">{money(item.price * item.qty)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Summary */}
              <div className="mt-3 space-y-2 text-sm">
                <Row label="Subtotal" value={money(subtotal)} />
                <Row label="Shipping" value={money(shipCost)} />
                {discount > 0 && <Row label="Discount" value={`-${money(discount)}`} />}
                <div className="border-t pt-2">
                  <Row label="Total" value={money(total)} bold />
                </div>
              </div>
              <p className="mt-2 text-xs text-stone-500">Secure payments — SSL encrypted.</p>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function Steps({ step }: { step: 1 | 2 | 3 }) {
  const s = ['Shipping', 'Payment', 'Review'];
  return (
    <div className="flex gap-2 text-sm text-stone-600">
      {s.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <span className={i + 1 <= step ? 'font-semibold text-stone-900' : ''}>{i + 1}. {label}</span>
          {i < s.length - 1 && <span className="text-stone-300">/</span>}
        </div>
      ))}
    </div>
  );
}

function Input({
  label, value, onChange, required, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-stone-600">{label}{required ? ' *' : ''}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="rounded-xl border border-stone-300/80 px-3 py-2 text-sm outline-none focus:border-stone-400"
      />
    </label>
  );
}

function Radio({ name, label, sub, checked, onChange }: { name: string; label: string; sub?: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-300/80 bg-white px-3 py-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {sub && <p className="text-xs text-stone-600 mt-0.5">{sub}</p>}
      </div>
      <input type="radio" name={name} checked={checked} onChange={onChange} className="h-4 w-4" />
    </label>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-stone-600">{label}</span>
      <span className={bold ? 'font-semibold' : ''}>{value}</span>
    </div>
  );
}