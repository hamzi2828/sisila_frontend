"use client";

import React from "react";
import Link from "next/link"; // <-- add this
import "@fortawesome/fontawesome-free/css/all.css";
import CheckoutForm from "./components/CheckoutForm";
import OrderSummary from "./components/OrderSummary";

const CheckoutPage = () => {
  return (
    <main className="pt-24">
      <section className="px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20 bg-white">
        <div className="mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
            <Link href="/cart" className="hover:text-black">
              Cart
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-black">Checkout</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <CheckoutForm />
            <OrderSummary />
          </div>
        </div>
      </section>
    </main>
  );
};

export default CheckoutPage;