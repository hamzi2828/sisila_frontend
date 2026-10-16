'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Printer, Truck } from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';
import { checkoutService } from '../services/checkoutService';
import { getAuthToken, isAuthenticated } from '@/helper/helper';
import { toast } from 'react-hot-toast';
import { formatPrice } from '@/lib/formatPrice';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const money = (v: number) => formatPrice(v);

function SuccessPageContent() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get('session_id');
  const orderId = params.get('order') || '';

  const [isVerifying, setIsVerifying] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyAndClearCart = async () => {
      try {
        // If we have a session_id from Stripe, verify the payment
        if (sessionId) {
          console.log('🔍 Verifying Stripe payment session:', sessionId);

          const result = await checkoutService.verifyPayment(sessionId);

          if (result.success) {
            console.log('✅ Payment verified successfully');
            // Backend returns the saved order as `order` (may be null until the Stripe webhook has run)
            setOrderDetails(
              result.data ||
                result.order ||
                (result.session ? { total: result.session.amount_total, paymentStatus: result.session.payment_status } : null)
            );

            // Clear the cart after successful payment
            await clearCart();
          } else {
            setError('Payment verification failed');
            toast.error('Payment verification failed');
          }
        } else {
          // Cash on Delivery: the review step saved the created order before redirecting here
          const saved = sessionStorage.getItem('silsila_last_order');
          if (saved) {
            const order = JSON.parse(saved);
            if (!orderId || order.orderNumber === orderId) setOrderDetails(order);
          }
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError('Failed to verify payment');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAndClearCart();
  }, [sessionId]);

  // Clear cart from both backend and localStorage
  const clearCart = async () => {
    try {
      console.log('🗑️ Clearing cart after successful payment...');

      // Clear backend cart
      if (isAuthenticated()) {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/api/cart`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          console.log('✅ Backend cart cleared');
        }
      }

      // Clear localStorage carts
      localStorage.removeItem('cart');
      localStorage.removeItem('silsila_cart');
      localStorage.removeItem('silsila_checkout');

      console.log('✅ Local storage cart cleared');

      // Dispatch event to update cart count in header
      window.dispatchEvent(new CustomEvent('cartCleared'));

      toast.success('Order placed successfully! Cart has been cleared.');
    } catch (err) {
      console.error('Error clearing cart:', err);
      // Don't show error to user, cart clearing is not critical
    }
  };

  const subtotal = Number(orderDetails?.subtotal) || 0;
  const shipping = Number(orderDetails?.shippingCost ?? orderDetails?.shipping) || 0;
  // No tax is charged at checkout (the backend's stored `tax` field is informational only), so it isn't shown.
  const total = Number(orderDetails?.total) || subtotal + shipping;

  // Show loading state while verifying
  if (isVerifying) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
        <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto"></div>
            <p className="mt-4 text-stone-600">Verifying your payment...</p>
          </div>
        </section>
      </main>
    );
  }

  // Show error state
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
        <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
              <span className="text-2xl">✕</span>
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Payment Verification Failed
            </h1>
            <p className="mt-2 text-stone-600">{error}</p>
            <div className="mt-5">
              <Link
                href="/checkout"
                className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
              >
                Try again
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
            <CheckCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-semibold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Order placed
          </h1>
          <p className="mt-2 text-stone-600">
            Thank you for your order!
            {orderDetails?.orderNumber || orderId ? (
              <>
                {' '}Your order number is{' '}
                <span className="font-medium text-stone-900">{orderDetails?.orderNumber || orderId}</span>.
              </>
            ) : null}
          </p>

          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
            >
              <Printer className="h-4 w-4" /> Print
            </button>
            <Link
              href="/shop"
              className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="px-6 md:px-10 lg:px-20 pb-20">
        <div className="mx-auto max-w-5xl grid gap-6 lg:grid-cols-12">
          {/* Left: items */}
          <div className="lg:col-span-8 rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Items</p>
              <Link href="/shop" className="text-sm text-stone-700 hover:underline">Shop more</Link>
            </div>
            <div className="mt-3 space-y-4">
              {orderDetails?.items && orderDetails.items.length > 0 ? (
                orderDetails.items.map((item: any, index: number) => {
                  const product = item.productId || item.product;
                  const productInfo = product && typeof product === 'object' ? product : null;
                  const thumb: string | undefined = productInfo?.thumbnailUrl;
                  const name: string = productInfo?.name || item.name || 'Product';
                  const color = item.variant?.color || (!['N/A', 'Default'].includes(item.color) ? item.color : undefined);
                  const size = item.variant?.size || (!['N/A', 'One Size'].includes(item.size) ? item.size : undefined);
                  return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="relative h-20 w-16 overflow-hidden rounded-xl ring-1 ring-stone-200 bg-stone-100">
                      <Image
                        src={thumb ? (thumb.startsWith('http') ? thumb : `${API_BASE_URL}${thumb}`) : '/images/image.png'}
                        alt={name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-xs text-stone-600">Qty {item.quantity}</p>
                      {color || size ? (
                        <p className="text-xs text-stone-500">
                          {[color, size].filter(Boolean).join(' / ')}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-sm">{money(item.price * item.quantity)}</div>
                  </div>
                  );
                })
              ) : (
                <p className="text-sm text-stone-500">No items found</p>
              )}
            </div>
          </div>

          {/* Right: delivery + totals */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold">Delivery</p>
              <div className="mt-2 text-sm text-stone-700">
                {orderDetails?.shippingAddress ? (
                  <>
                    <p>{orderDetails.shippingAddress.fullName || orderDetails.shippingAddress.name}</p>
                    <p>{orderDetails.shippingAddress.address}</p>
                    <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}</p>
                    <p>{orderDetails.shippingAddress.country}</p>
                  </>
                ) : (
                  <p>Shipping address not available</p>
                )}
              </div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-1 text-xs text-stone-700 ring-1 ring-stone-200">
                <Truck className="h-3.5 w-3.5" /> Standard — est. 3–5 business days
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold">Payment</p>
              <p className="mt-2 text-sm text-stone-700">
                {sessionId ? 'Paid via Stripe' : 'Cash on Delivery'}
              </p>
              {orderDetails?.paymentStatus && (
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-800 ring-1 ring-emerald-200">
                  <CheckCircle className="h-3.5 w-3.5" /> {orderDetails.paymentStatus}
                </div>
              )}
              <div className="mt-3 border-t border-stone-200 pt-3 space-y-1 text-sm">
                <Row label="Subtotal" value={money(subtotal)} />
                <Row label="Shipping" value={shipping === 0 ? 'Free' : money(shipping)} />
                <div className="my-2 border-t border-stone-200" />
                <Row label={<span className="font-semibold">Total</span>} value={<span className="font-semibold">{money(total)}</span>} />
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold">Next steps</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-stone-700 space-y-1.5">
                <li>You’ll get a shipping confirmation with tracking.</li>
                <li>Need help? Contact <a href="mailto:hello@silsilla.pk" className="underline">hello@silsilla.pk</a></li>
              </ul>
              <div className="mt-3">
                <Link
                  href={orderId ? `/track?order=${encodeURIComponent(orderId)}` : "/track"}
                  className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-4 py-2 text-sm hover:bg-stone-50"
                >
                  Track your order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-stone-600">{label}</span>
      <span className="text-stone-800">{value}</span>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
        <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto"></div>
            <p className="mt-4 text-stone-600">Loading...</p>
          </div>
        </section>
      </main>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}