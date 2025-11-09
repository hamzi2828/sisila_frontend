import { getAuthToken } from "@/helper/helper";
import { loadStripe } from '@stripe/stripe-js';

export interface ShippingAddress {
  email: string;
  country: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;
  address: string;
  line1?: string;
  line2?: string;
  city: string;
  state?: string;
  region?: string;
  postalCode?: string;
  postal?: string;
  zipCode?: string;
  phoneNumber?: string;
  phone?: string;
}

export interface PaymentMethod {
  type: 'stripe' | 'card' | 'cod' | 'other';
  method?: 'card' | 'cod' | 'stripe';
  cardNumber?: string;
  expirationDate?: string;
  securityCode?: string;
  cardHolderName?: string;
  useShippingAddress?: boolean;
}

export interface OrderRequest {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  dutiesTaxes?: 'pay_now' | 'pay_on_delivery';
  discountCode?: string;
}

export interface OrderResponse {
  _id: string;
  userId: string;
  orderNumber: string;
  items: Array<{
    productId: {
      _id: string;
      name: string;
      price: number;
      discountedPrice?: number;
      thumbnailUrl?: string;
    };
    quantity: number;
    variant?: {
      color?: string;
      size?: string;
      price?: number;
    };
    price: number;
  }>;
  shippingAddress: ShippingAddress;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class CheckoutService {
  private baseUrl: string;
  private stripePromise: ReturnType<typeof loadStripe> | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  }

  private async getStripe() {
    if (!this.stripePromise) {
      try {
        console.log('🔑 Fetching Stripe public key...');
        const response = await fetch(`${this.baseUrl}/api/payment/stripe-public-key`);
        const data = await response.json();
        console.log('- Stripe public key response:', data);

        if (data.success && data.publicKey) {
          console.log('- Loading Stripe with public key...');
          this.stripePromise = loadStripe(data.publicKey);
        } else {
          console.error('❌ No public key in response:', data);
        }
      } catch (error) {
        console.error('❌ Error fetching Stripe public key:', error);
      }
    }
    return this.stripePromise;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Create Stripe checkout session
  async createStripeCheckout(cartItems: any[], shippingAddress: ShippingAddress, billingAddress?: ShippingAddress) {
    try {
      console.log('💳 Creating Stripe checkout session...');

      // Format address for Stripe
      const formattedShipping = {
        fullName: shippingAddress.fullName || shippingAddress.name || `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim(),
        email: shippingAddress.email,
        phone: shippingAddress.phone || shippingAddress.phoneNumber || '',
        address: shippingAddress.address || shippingAddress.line1 || '',
        city: shippingAddress.city,
        state: shippingAddress.state || shippingAddress.region || '',
        zipCode: shippingAddress.zipCode || shippingAddress.postalCode || shippingAddress.postal || '',
        country: shippingAddress.country || 'United States'
      };

      const formattedBilling = billingAddress ? {
        fullName: billingAddress.fullName || billingAddress.name || `${billingAddress.firstName || ''} ${billingAddress.lastName || ''}`.trim(),
        email: billingAddress.email,
        phone: billingAddress.phone || billingAddress.phoneNumber || '',
        address: billingAddress.address || billingAddress.line1 || '',
        city: billingAddress.city,
        state: billingAddress.state || billingAddress.region || '',
        zipCode: billingAddress.zipCode || billingAddress.postalCode || billingAddress.postal || '',
        country: billingAddress.country || 'United States'
      } : formattedShipping;

      const response = await fetch(`${this.baseUrl}/api/payment/create-checkout-session`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          cartItems,
          shippingAddress: formattedShipping,
          billingAddress: formattedBilling
        }),
      });

      const result = await response.json();
      console.log('- Checkout session result:', result);

      if (result.success) {
        // If backend provides direct URL, use it (most reliable method)
        if (result.url) {
          console.log('🔗 Redirecting to Stripe checkout URL directly...');
          window.location.href = result.url;
          return result;
        }

        // Fallback: use Stripe.js redirectToCheckout
        if (result.sessionId) {
          console.log('🔗 Redirecting to Stripe using sessionId...');
          const stripe = await this.getStripe();
          if (!stripe) {
            console.error('❌ Stripe not initialized, cannot redirect');
            throw new Error('Stripe not initialized. Please refresh the page and try again.');
          }

          // Redirect to Stripe checkout
          const { error } = await stripe.redirectToCheckout({
            sessionId: result.sessionId
          });

          if (error) {
            console.error('❌ Stripe redirect error:', error);
            throw new Error(error.message);
          }

          return result;
        }

        throw new Error('No sessionId or URL returned from server');
      }

      throw new Error(result.message || 'Failed to create checkout session');
    } catch (error) {
      console.error('❌ Error creating Stripe checkout:', error);
      throw error;
    }
  }

  // Verify payment after redirect from Stripe
  async verifyPayment(sessionId: string) {
    try {
      console.log('✅ Verifying payment for session:', sessionId);

      const response = await fetch(`${this.baseUrl}/api/payment/verify/${sessionId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      console.log('- Verification result:', result);

      return result;
    } catch (error) {
      console.error('❌ Error verifying payment:', error);
      throw error;
    }
  }

  // Get Stripe public key
  async getStripePublicKey() {
    try {
      const response = await fetch(`${this.baseUrl}/api/payment/stripe-public-key`);
      const data = await response.json();
      return data.publicKey;
    } catch (error) {
      console.error('❌ Error getting Stripe public key:', error);
      return null;
    }
  }

  // Create order
  async createOrder(orderData: OrderRequest): Promise<OrderResponse | null> {
    try {
      console.log('🛒 Creating order...');
      console.log('- Order data:', orderData);

      const response = await fetch(`${this.baseUrl}/api/payment/orders`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(orderData),
      });

      console.log('- Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create order: ${response.status} - ${errorText}`);
      }

      const result: ApiResponse<OrderResponse> = await response.json();
      console.log('- Order created:', result);

      if (result.success && result.data) {
        return result.data;
      }

      throw new Error(result.error || 'Failed to create order');
    } catch (error) {
      console.error('❌ Error creating order:', error);
      throw error;
    }
  }

  // Get order by ID
  async getOrder(orderId: string): Promise<OrderResponse | null> {
    try {
      console.log('📦 Fetching order:', orderId);

      const response = await fetch(`${this.baseUrl}/api/payment/orders/${orderId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('- Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.status}`);
      }

      const result: ApiResponse<OrderResponse> = await response.json();
      console.log('- Order data:', result);

      if (result.success && result.data) {
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('❌ Error fetching order:', error);
      throw error;
    }
  }

  // Get user's orders
  async getUserOrders(): Promise<OrderResponse[]> {
    try {
      console.log('📦 Fetching user orders...');

      const response = await fetch(`${this.baseUrl}/api/payment/orders`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('- Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const result: ApiResponse<OrderResponse[]> = await response.json();
      console.log('- Orders data:', result);

      if (result.success && result.data) {
        return result.data;
      }

      return [];
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      throw error;
    }
  }

  // Apply discount code
  async applyDiscount(code: string): Promise<{ valid: boolean; discount: number; message: string }> {
    try {
      console.log('🎟️ Applying discount code:', code);

      const response = await fetch(`${this.baseUrl}/api/discounts/apply`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ code }),
      });

      console.log('- Response status:', response.status);

      if (!response.ok) {
        return { valid: false, discount: 0, message: 'Invalid discount code' };
      }

      const result = await response.json();
      console.log('- Discount result:', result);

      return {
        valid: result.success,
        discount: result.data?.discount || 0,
        message: result.message || 'Discount applied successfully'
      };
    } catch (error) {
      console.error('❌ Error applying discount:', error);
      return { valid: false, discount: 0, message: 'Failed to apply discount' };
    }
  }

  // Validate payment details (client-side validation)
  validatePaymentDetails(payment: PaymentMethod): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (payment.type === 'card') {
      if (!payment.cardNumber) {
        errors.push('Card number is required');
      } else if (payment.cardNumber.replace(/\s/g, '').length < 13) {
        errors.push('Card number must be at least 13 digits');
      }

      if (!payment.expirationDate) {
        errors.push('Expiration date is required');
      } else if (!/^\d{2}\/\d{4}$/.test(payment.expirationDate)) {
        errors.push('Expiration date must be in MM/YYYY format');
      }

      if (!payment.securityCode) {
        errors.push('Security code is required');
      } else if (!/^\d{3,4}$/.test(payment.securityCode)) {
        errors.push('Security code must be 3 or 4 digits');
      }

      if (!payment.cardHolderName) {
        errors.push('Card holder name is required');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Validate shipping address
  validateShippingAddress(address: ShippingAddress): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!address.email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      errors.push('Please enter a valid email address');
    }

    const firstName = address.firstName || '';
    const lastName = address.lastName || '';
    const fullName = address.fullName || address.name || '';

    if (!firstName.trim() && !lastName.trim() && !fullName.trim()) {
      errors.push('Name is required');
    }

    if (!address.country?.trim()) errors.push('Country is required');
    if (!address.address?.trim() && !address.line1?.trim()) errors.push('Address is required');
    if (!address.city?.trim()) errors.push('City is required');
    if (!address.phoneNumber?.trim() && !address.phone?.trim()) errors.push('Phone number is required');

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Format card number for display
  formatCardNumber(cardNumber: string): string {
    return cardNumber.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  // Format expiration date for display
  formatExpirationDate(date: string): string {
    const cleaned = date.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{0,4})$/);
    if (match) {
      return match[2] ? `${match[1]}/${match[2]}` : match[1];
    }
    return date;
  }
}

export const checkoutService = new CheckoutService();
