import Image from 'next/image';




const OrderSummary: React.FC = ({


}) => {


  return (
    <div className="lg:pl-8">
    <div className="sticky top-24 bg-white rounded-lg shadow-sm p-6 space-y-8">
      {/* Product Item */}
      <div className="space-y-6">
        {/* Product Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            {/* Product Image */}
            <div className="flex-shrink-0 relative w-20 h-20 md:w-24 md:h-24">
              <Image
                className="checkout-product-image rounded-lg"
                src="/images/gym-2.svg"
                alt="WORDMARK CREW SOCKS 3 PACK -PEARL WHITE"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <div className="space-y-2">
                <div
                  className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2"
                >
                  <h3 className="checkout-product-title flex-1 pr-2 font-medium">
                    WORDMARK CREW SOCKS 3 PACK -PEARL WHITE
                  </h3>
                  <div
                    className="checkout-shipping-price flex-shrink-0 font-medium"
                  >
                    Rs 21,600.00
                  </div>
                </div>
                <p className="checkout-product-size text-sm text-gray-600">SIZE: S</p>
              </div>
            </div>

            {/* Quantity Badge */}
            <div className="flex-shrink-0">
              <span className="checkout-quantity-badge inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-800 font-medium text-sm">1</span>
            </div>
          </div>
        </div>

        {/* Discount Code Field */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Discount code or gift card"
              className="checkout-input w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              id="discount-input"
            />
          </div>
          <button
            type="button"
            className="px-6 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors checkout-input duration-200"
            id="apply-discount"
          >
            APPLY
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-4">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="checkout-subtotal-label text-gray-600">Subtotal</span>
          <span className="checkout-shipping-price font-medium" id="subtotal">Rs 21,600.00</span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between">
          <span className="checkout-subtotal-label text-gray-600">Shipping</span>
          <span className="checkout-shipping-price font-medium" id="shipping">Rs 4,366.00</span>
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="checkout-total-label font-bold text-lg">Total</span>
            <span className="checkout-total-price font-bold text-lg" id="total">Rs 25,966.00</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default OrderSummary;