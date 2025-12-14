import { toast } from './toastHelper';
import { isAuthenticated, getCurrentUser, getAuthToken } from './helper';

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  variant?: {
    variantId?: string;  // Unique variant identifier
    color?: string;
    size?: string;
    price?: number;
    variantSku?: string;
    originalVariantStock?: number;
  };
  thumbnailUrl?: string;
  stock?: number;
}

export interface AddToCartParams {
  productId: string;
  productName: string;
  price: number;
  discountedPrice?: number;
  quantity?: number;
  variant?: {
    variantId?: string;  // Unique variant identifier
    color?: string;
    size?: string;
    price?: number;
    variantSku?: string;
    originalVariantStock?: number;
  };
  thumbnailUrl?: string;
  stock?: number;
}

class CartHelper {
  private static instance: CartHelper;

  public static getInstance(): CartHelper {
    if (!CartHelper.instance) {
      CartHelper.instance = new CartHelper();
    }
    return CartHelper.instance;
  }

  // Check if user is logged in
  private isUserLoggedIn(): boolean {
    if (typeof window === 'undefined') {
      console.log('🌍 Window undefined - SSR context');
      return false;
    }
    
    // Use your existing auth helper
    const authenticated = isAuthenticated();
    console.log('🔑 User authenticated (from helper.ts):', authenticated);
    
    const token = getAuthToken();
    console.log('🔑 Auth token exists:', !!token);
    console.log('🔑 Token (first 50 chars):', token?.substring(0, 50) + '...');
    
    return authenticated;
  }

  // Get user ID from token or storage
  private getUserId(): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      // Use your existing helper to get current user
      const user = getCurrentUser();
      console.log('👤 Current user from helper:', user);
      
      if (user && user.id) {
        console.log('👤 User ID:', user.id);
        return user.id;
      }
      
      console.log('❌ No user ID found');
      return null;
    } catch (error) {
      console.error('❌ Error getting user ID:', error);
      return null;
    }
  }

  // Add item to cart in database
  private async addToCartDatabase(userId: string, item: CartItem): Promise<boolean> {
    try {
      const token = getAuthToken();
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart`;
      
      console.log('🛒 Adding to cart database:');
      console.log('- API URL:', apiUrl);
      console.log('- User ID:', userId);
      console.log('- Product ID:', item.productId);
      console.log('- Has token:', !!token);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: item.productId,
          quantity: item.quantity,
          variant: item.variant,
        }),
      });

      console.log('- Response status:', response.status);
      console.log('- Response ok:', response.ok);
      
      let responseData;
      try {
        responseData = await response.text();
        console.log('- Response data (text):', responseData);
        
        // Try to parse as JSON if possible
        try {
          const jsonData = JSON.parse(responseData);
          console.log('- Response data (parsed JSON):', jsonData);
        } catch {
          console.log('- Response data is not valid JSON');
        }
      } catch (textError) {
        console.error('- Error reading response text:', textError);
        responseData = 'Error reading response';
      }

      if (!response.ok) {
        console.error('❌ Response not OK:', response.status, responseData);
        throw new Error(`Failed to add to cart: ${response.status} - ${responseData}`);
      }

      console.log('✅ Cart API call successful');
      return true;
    } catch (error) {
      console.error('❌ Error adding to cart in database:', error);
      if (error instanceof Error) {
        console.error('❌ Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      } else {
        console.error('❌ Unknown error occurred:', error);
      }
      return false;
    }
  }

  // Add item to local storage cart (fallback or guest users)
  private addToCartLocalStorage(item: CartItem): void {
    try {
      const existingCart = this.getLocalCart();
      const existingItemIndex = existingCart.findIndex(
        (cartItem) => 
          cartItem.productId === item.productId &&
          JSON.stringify(cartItem.variant) === JSON.stringify(item.variant)
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        existingCart[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item
        existingCart.push(item);
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));
    } catch (error) {
      console.error('Error adding to local cart:', error);
    }
  }

  // Get cart from local storage
  private getLocalCart(): CartItem[] {
    try {
      const cart = localStorage.getItem('cart');
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error getting local cart:', error);
      return [];
    }
  }

  // Main add to cart function
  public async addToCart(params: AddToCartParams): Promise<void> {
    console.log('🛒 Starting addToCart with params:', params);
    
    const {
      productId,
      productName,
      price,
      discountedPrice,
      quantity = 1,
      variant,
      thumbnailUrl,
      stock
    } = params;

    console.log('🔐 Checking user authentication...');
    const isLoggedIn = this.isUserLoggedIn();
    console.log('- User logged in:', isLoggedIn);

    // Check if user is logged in
    if (!isLoggedIn) {
      console.log('❌ User not logged in - showing error message');
      toast.error('Please login to add products to cart', {
        duration: 4000,
        position: 'top-center',
      });
      
      // Optionally redirect to login page
      // window.location.href = '/login';
      return;
    }


    const userId = this.getUserId();
    if (!userId) {
      toast.error('User authentication error. Please login again.', {
        duration: 4000,
        position: 'top-center',
      });
      return;
    }

    const cartItem: CartItem = {
      productId,
      productName,
      price: variant?.price || discountedPrice || price,
      discountedPrice,
      quantity,
      variant,
      thumbnailUrl,
      stock,
    };

    try {
      // Show loading toast
      const loadingToast = toast.loading('Adding to cart...');

      // Try to add to database
      const success = await this.addToCartDatabase(userId, cartItem);

      loadingToast.dismiss();

      if (success) {
        toast.success(`${productName} added to cart!`, {
          duration: 3000,
          position: 'top-center',
        });

        // Optionally update local cart as backup
        this.addToCartLocalStorage(cartItem);

        // Trigger cart update event for UI components
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cartItem }));
      } else {
        // Fallback to local storage
        this.addToCartLocalStorage(cartItem);
        toast.success(`${productName} added to cart! (Saved locally)`, {
          duration: 3000,
          position: 'top-center',
        });

        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cartItem }));
      }
    } catch (error) {
      toast.error('Failed to add item to cart. Please try again.', {
        duration: 4000,
        position: 'top-center',
      });
      console.error('Add to cart error:', error);
    }
  }

  // Get cart items count (local storage only - use fetchCartCount for accurate count)
  public getCartItemsCount(): number {
    try {
      const cart = this.getLocalCart();
      return cart.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error('Error getting cart items count:', error);
      return 0;
    }
  }

  // Fetch cart count from database for logged-in users
  public async fetchCartCount(): Promise<number> {
    try {
      const isLoggedIn = this.isUserLoggedIn();

      if (!isLoggedIn) {
        // Guest user - use local storage
        return this.getCartItemsCount();
      }

      const token = getAuthToken();
      if (!token) {
        return this.getCartItemsCount();
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch cart from API');
        return this.getCartItemsCount();
      }

      const data = await response.json();

      if (data.success && data.data && data.data.items) {
        const count = data.data.items.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0);
        return count;
      }

      return 0;
    } catch (error) {
      console.error('Error fetching cart count:', error);
      return this.getCartItemsCount();
    }
  }

  // Clear cart
  public clearCart(): void {
    try {
      localStorage.removeItem('cart');
      window.dispatchEvent(new CustomEvent('cartCleared'));
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }
}

// Export singleton instance
export const cartHelper = CartHelper.getInstance();

// Convenience function for easy import
export const addToCart = (params: AddToCartParams) => cartHelper.addToCart(params);