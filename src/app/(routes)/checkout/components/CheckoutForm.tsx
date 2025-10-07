"use client";

import React, { useState } from "react";
import Link from "next/link"; // <-- added
import Image from "next/image";
import "@fortawesome/fontawesome-free/css/all.css";

const CheckoutForm = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [dutiesTaxes, setDutiesTaxes] = useState("pay_now");
  const [useShippingAddress, setUseShippingAddress] = useState(true);

  return (
    <div className="space-y-12">
      <div className="text-center lg:text-left">
        <h1 className="checkout-section-title text-2xl font-bold">Checkout Form</h1>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Email Section */}
        <div className="space-y-2">
          <label className="checkout-label block font-medium">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="checkout-input w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Delivery Section */}
        <div className="space-y-6">
          <h2 className="checkout-section-title text-xl font-bold">Delivery</h2>

          {/* Country */}
          <div className="space-y-2">
            <label className="checkout-label block font-medium">Country</label>
            <div className="relative">
              <select className="checkout-input w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-200">
                <option>Enter your country</option>
                <option>Pakistan</option>
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="checkout-label block font-medium">First Name</label>
              <input
                type="text"
                placeholder="Name"
                className="checkout-input w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="checkout-label block font-medium">Last Name</label>
              <input
                type="text"
                placeholder="Name"
                className="checkout-input w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="checkout-label block font-medium">Address</label>
            <input
              type="text"
              placeholder="Apartment, suite (etc)"
              className="checkout-input w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* City and Postal Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="checkout-label block font-medium">City</label>
              <input
                type="text"
                placeholder="Lahore"
                className="checkout-input w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="checkout-label block font-medium">Postal Code (optional)</label>
              <input
                type="text"
                placeholder="5108"
                className="checkout-input w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="checkout-label block font-medium">Number</label>
            <input
              type="tel"
              placeholder="+92 987382 8967"
              className="checkout-input w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Shipping Method */}
        <div className="space-y-4">
          <label className="checkout-label block font-medium">Shipping Method</label>
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="checkout-shipping-title font-medium">Express Courier (Air)</span>
                <span className="checkout-shipping-price font-medium">$230</span>
              </div>
              <p className="checkout-price-text text-sm text-gray-600">4 to 5 business days</p>
              <p className="checkout-price-text text-sm text-gray-600">
                Prepayment of duties and taxes supported
              </p>
            </div>
          </div>
        </div>

        {/* Duties and Taxes */}
        <div className="space-y-4">
          <label className="checkout-label block font-medium">Duties and taxes</label>

          {/* Pay now option */}
          <label className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-100 transition-colors duration-200 block">
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                name="duties_taxes"
                value="pay_now"
                className="checkout-radio mt-1"
                checked={dutiesTaxes === "pay_now"}
                onChange={() => setDutiesTaxes("pay_now")}
              />
              <div className="flex-1">
                <p className="checkout-label font-medium">Pay now</p>
                <p className="checkout-input text-sm text-gray-600">No additional fees on delivery</p>
              </div>
            </div>
          </label>

          {/* Pay on delivery option */}
          <label className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-100 transition-colors duration-200 block">
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                name="duties_taxes"
                value="pay_on_delivery"
                className="checkout-radio mt-1"
                checked={dutiesTaxes === "pay_on_delivery"}
                onChange={() => setDutiesTaxes("pay_on_delivery")}
              />
              <div className="flex-1">
                <p className="checkout-label font-medium">Pay on delivery</p>
                <p className="checkout-input text-sm text-gray-600">Additional fees may apply</p>
              </div>
            </div>
          </label>
        </div>

        {/* Payment Section */}
        <div className="space-y-6">
          <h2 className="checkout-section-title text-xl font-bold">Payment</h2>

          <div className="space-y-4">
            <label className="checkout-label block font-medium">Payment Method</label>

            {/* Credit/Debit Card Option */}
            <label className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm cursor-pointer block">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      className="checkout-radio mt-1"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    <div>
                      <p className="checkout-label font-medium">Credit or Debit Card</p>
                      <p className="checkout-input text-sm text-gray-600">No additional fees on delivery</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-6 relative">
                      <Image src="/images/MasterCard.svg" alt="Mastercard" fill style={{ objectFit: "contain" }} />
                    </div>
                    <div className="w-8 h-3 relative">
                      <Image src="/images/Visa.svg" alt="Visa" fill style={{ objectFit: "contain" }} />
                    </div>
                    <div className="w-8 h-2 relative">
                      <Image src="/images/PayPal.svg" alt="PayPal" fill style={{ objectFit: "contain" }} />
                    </div>
                    <div className="w-8 h-5 relative">
                      <Image src="/images/unionpay.svg" alt="UnionPay" fill style={{ objectFit: "contain" }} />
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                {paymentMethod === "card" && (
                  <div className="space-y-5" id="card-details">
                    <div className="space-y-2">
                      <label className="checkout-label block font-medium">Card number</label>
                      <input
                        type="text"
                        placeholder="1237 67567 78656"
                        className="checkout-input w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="checkout-label block font-medium">Expiration</label>
                        <input
                          type="text"
                          placeholder="MM/YYYY"
                          className="checkout-input w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="checkout-label block font-medium">Security code</label>
                        <input
                          type="text"
                          placeholder="****"
                          className="checkout-input w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="checkout-label block font-medium">Card holder name</label>
                      <input
                        type="text"
                        placeholder="Name"
                        className="checkout-input w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkout-checkbox mt-1"
                        checked={useShippingAddress}
                        onChange={() => setUseShippingAddress(!useShippingAddress)}
                      />
                      <p className="checkout-label font-medium">Use shipping address as billing</p>
                    </label>
                  </div>
                )}
              </div>
            </label>

            {/* More Payment Options */}
            <label className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-100 transition-colors duration-200 block">
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="payment_method"
                  value="more_options"
                  className="checkout-radio mt-1"
                  checked={paymentMethod === "more_options"}
                  onChange={() => setPaymentMethod("more_options")}
                />
                <p className="checkout-label font-medium">More payment options</p>
              </div>
            </label>
          </div>
        </div>

        {/* Pay Now Button -> Link to success page */}
        <div className="pt-6">
          <Link
            href="/order-success"
            className="checkout-green-bg w-full mx-auto lg:mx-0 px-6 py-3 rounded-lg flex items-center justify-center space-x-2 text-black font-semibold hover:opacity-90 transition-opacity duration-200 bg-green-400 shadow-md"
            aria-label="Pay Now"
          >
            <span className="font-semibold">Pay Now</span>
            <i className="fas fa-arrow-right" />
          </Link>
        </div>

        {/* If you want to pass details: */}
        {/*
        <div className="pt-6">
          <Link
            href={{ pathname: "/order-success", query: { id: "CRC-2024-009", total: 25966, email: "user@email.com", eta: "3–5 business days" } }}
            className="checkout-green-bg w-full mx-auto lg:mx-0 px-6 py-3 rounded-lg flex items-center justify-center space-x-2 text-black font-semibold hover:opacity-90 transition-opacity duration-200 bg-green-400 shadow-md"
          >
            <span className="font-semibold">Pay Now</span>
            <i className="fas fa-arrow-right" />
          </Link>
        </div>
        */}
      </form>
    </div>
  );
};

export default CheckoutForm;