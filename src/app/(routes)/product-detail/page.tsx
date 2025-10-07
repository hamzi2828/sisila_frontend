"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "@fortawesome/fontawesome-free/css/all.css";

const ProductDetail = () => {
  const [selectedColor, setSelectedColor] = useState("NAVY BLUE");
  const [selectedSize, setSelectedSize] = useState("S");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("images/gym-2.svg");
  const [accordionOpen, setAccordionOpen] = useState<{ [key: string]: boolean }>({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  type ColorOption = {
    name: string;
    image: string;
    value: string;
  };

  const colorOptions: ColorOption[] = [
    { name: "PEARL WHITE", image: "images/gym-5.svg", value: "pearl-white" },
    { name: "CHARCOAL BLACK", image: "images/gym-3.svg", value: "charcoal-black" },
    { name: "NAVY BLUE", image: "images/gym-4.svg", value: "navy-blue" },
  ];

  const handleColorChange = (color: ColorOption) => {
    setSelectedColor(color.name);
    setMainImage(color.image);
  };

  const toggleAccordion = (section: string) => {
    setAccordionOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <main className="pt-24">
      {/* Product Detail Section */}
      <section className="product-detail-section bg-white px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto">
          <div className="product-detail-wrapper flex flex-col lg:flex-row gap-16 items-center">
            {/* Left Side - Product Image */}
            <div className="product-image-container flex-1">
              <Image
                id="mainProductImage"
                src={`/${mainImage}`}
                alt="Wordmark Crew Socks 3 Pack Pearl White"
                width={600}
                height={600}
                className="product-main-image w-full h-auto object-cover rounded-lg transition-all duration-300 hover:scale-105"
                priority
              />
            </div>

            {/* Right Side - Product Info */}
            <div className="product-info-container flex-1 space-y-8">
              {/* Product Header */}
              <div className="product-header-section space-y-6">
                <div className="product-title-section space-y-4">
                  <div className="product-name-brand space-y-1">
                    <h1 className="product-name text-black font-bold text-xl uppercase tracking-tight opacity-90">
                      WORDMARK CREW SOCKS 3 PACK -PEARL WHITE
                    </h1>
                    <p className="product-brand text-gray-600 text-sm font-normal">CRE CUT</p>
                  </div>
                  <div className="product-price text-gray-600 font-semibold text-base">
                    Rs <span id="productPrice">21,600.00</span>
                  </div>
                </div>

                {/* Product Actions Header */}
                <div className="product-actions-header flex items-center justify-between">
                  <div className="product-logo-points flex items-center gap-2">
                    <span className="product-logo text-black font-bold text-base tracking-tight">LOGO</span>
                    <span className="points-text text-black font-medium text-base tracking-tight">
                      EARN <span id="vipPoints">291</span> PACKVIP POINTS
                    </span>
                  </div>

                  <div className="product-rating-actions flex items-center gap-2">
                    <div className="rating-display flex items-center gap-1.5">
                      <span className="rating-number text-black text-sm">5.0</span>
                      <i className="fas fa-star text-yellow-400 text-xs"></i>
                    </div>
                    <div className="action-icons flex items-center gap-1.5">
                      <button className="action-btn p-2 rounded-full hover:bg-gray-100 transition-colors" title="Add to Wishlist">
                        <i className="far fa-heart text-black text-lg"></i>
                      </button>
                      <button className="action-btn p-2 rounded-full hover:bg-gray-100 transition-colors" title="Download">
                        <i className="fas fa-download text-black text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Selection */}
              <div className="color-selection-section space-y-1.5">
                <h3 className="color-label text-black font-semibold text-base tracking-tight">
                  COLOR: <span>{selectedColor}</span>
                </h3>
                <div className="color-options flex gap-4">
                  {colorOptions.map((color) => (
                    <div
                      key={color.value}
                      className={`color-option w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 transform hover:scale-105 ${
                        selectedColor === color.name ? "border-black active-color" : "border-transparent hover:border-gray-400"
                      }`}
                      onClick={() => handleColorChange(color)}
                    >
                      <Image
                        src={`/${color.image}`}
                        alt={color.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="size-selection-section space-y-1.5">
                <h3 className="size-label text-black font-semibold text-base tracking-tight">
                  SIZE: <span>{selectedSize}</span>
                </h3>
                <div className="size-options flex gap-4">
                  {["S", "M", "L"].map((size) => (
                    <button
                      key={size}
                      className={`size-option-btn py-1.5 px-6 font-bold text-lg tracking-tight w-22 text-center transition-all duration-200 hover:scale-105 ${
                        selectedSize === size ? "selected bg-black text-white" : "bg-gray-200 text-black hover:bg-gray-300"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="quantity-selection-section space-y-1.5">
                <h3 className="quantity-label text-black font-semibold text-base tracking-tight">QUANTITY</h3>
                <div className="quantity-controls flex items-center gap-4">
                  <button
                    onClick={decreaseQuantity}
                    className="qty-btn bg-gray-200 hover:bg-gray-300 text-black w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="quantity-display text-black font-semibold text-lg min-w-[2rem] text-center">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="qty-btn bg-gray-200 hover:bg-gray-300 text-black w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="add-to-cart-section">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="add-to-cart-btn text-black font-semibold text-sm py-3 px-6 rounded-lg w-full shadow-lg hover:bg-green-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isAddingToCart ? (
                    <span className="btn-loading">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      ADDING...
                    </span>
                  ) : (
                    <span className="btn-text">ADD TO CART</span>
                  )}
                </button>
              </div>

              {/* Success Message */}
              {showSuccess && (
                <div className="success-message bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>Product added to cart successfully!</span>
                    <Link href="/cart" className="ml-3 underline font-semibold">
                      View Cart
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Highlight Section */}
      <section className="product-highlight bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-16 px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20">
          {/* Content Section */}
          <div className="flex-1 space-y-8">
            {/* Section Header */}
            <header className="flex justify-between items-center">
              <h2 className="product-highlight__title text-black text-xl">Product Highlight</h2>
              <button className="text-gray-700 hover:text-black transition-colors">
                <i className="fas fa-chevron-up text-2xl"></i>
              </button>
            </header>

            {/* Product Content */}
            <div className="space-y-8">
              <figure className="w-full">
                <Image
                  src="/images/gym-2.svg"
                  alt="Product highlight image"
                  width={800}
                  height={384}
                  className="product-highlight__image w-full h-96 object-cover rounded-lg"
                />
              </figure>

              <div className="border-b border-gray-400 pb-4">
                <p className="product-highlight__description text-black text-base">
                  Made for comfort and durability, these socks provide a reliable fit for everyday wear
                </p>
              </div>

              {/* Accordion Sections */}
              <div className="space-y-0">
                {/* Purpose Section */}
                <article className="product-highlight__accordion-item border-b border-gray-200" id="purpose">
                  <button
                    className="product-highlight__accordion-button w-full flex justify-between items-center py-4 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => toggleAccordion("purpose")}
                  >
                    <h3 className="product-highlight__section-title text-black text-base font-medium">Purpose</h3>
                    <i
                      className={`fas transition-transform duration-300 text-gray-700 ${accordionOpen.purpose ? "fa-chevron-up" : "fa-chevron-down"}`}
                    ></i>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      accordionOpen.purpose ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pb-4 text-gray-700 px-2">
                      <p>
                        Designed for active individuals who demand both performance and style. These premium socks offer
                        superior moisture-wicking properties and enhanced cushioning for all-day comfort during workouts,
                        daily activities, or professional settings.
                      </p>
                    </div>
                  </div>
                </article>

                {/* Features & Fit Section */}
                <article className="product-highlight__accordion-item border-b border-gray-200" id="features">
                  <button
                    className="product-highlight__accordion-button w-full flex justify-between items-center py-4 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => toggleAccordion("features")}
                  >
                    <h3 className="product-highlight__section-title text-black text-base font-medium">Features & Fit</h3>
                    <i
                      className={`fas transition-transform duration-300 text-gray-700 ${accordionOpen.features ? "fa-chevron-up" : "fa-chevron-down"}`}
                    ></i>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      accordionOpen.features ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pb-4 text-gray-700 px-2">
                      <ul className="space-y-2">
                        <li>• Seamless toe construction for reduced friction</li>
                        <li>• Reinforced heel and toe for durability</li>
                        <li>• Compression arch support</li>
                        <li>• Available in sizes S, M, L for perfect fit</li>
                        <li>• Crew length design</li>
                      </ul>
                    </div>
                  </div>
                </article>

                {/* Materials & Care Section */}
                <article className="product-highlight__accordion-item border-b border-gray-200" id="materials">
                  <button
                    className="product-highlight__accordion-button w-full flex justify-between items-center py-4 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => toggleAccordion("materials")}
                  >
                    <h3 className="product-highlight__section-title text-black text-base font-medium">Materials & Care</h3>
                    <i
                      className={`fas transition-transform duration-300 text-gray-700 ${accordionOpen.materials ? "fa-chevron-up" : "fa-chevron-down"}`}
                    ></i>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      accordionOpen.materials ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pb-4 text-gray-700 px-2">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold">Materials:</h4>
                          <p>75% Cotton, 20% Polyester, 5% Elastane</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Care Instructions:</h4>
                          <p>Machine wash cold, tumble dry low, do not bleach</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>

                {/* Reviews Section */}
                <article className="product-highlight__accordion-item border-b border-gray-200" id="reviews">
                  <button
                    className="product-highlight__accordion-button w-full flex justify-between items-center py-4 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => toggleAccordion("reviews")}
                  >
                    <div className="flex items-center justify-between w-full">
                      <h3 className="product-highlight__section-title text-black text-base font-medium">Reviews</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
                          <i className="fas fa-star text-yellow-400 text-sm"></i>
                          <i className="fas fa-star text-yellow-400 text-sm"></i>
                          <i className="fas fa-star text-yellow-400 text-sm"></i>
                          <i className="fas fa-star text-yellow-400 text-sm"></i>
                          <i className="fas fa-star text-yellow-400 text-sm"></i>
                        </div>
                        <i
                          className={`fas transition-transform duration-300 text-gray-700 ${
                            accordionOpen.reviews ? "fa-chevron-up" : "fa-chevron-down"
                          }`}
                        ></i>
                      </div>
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      accordionOpen.reviews ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pb-4 text-gray-700 space-y-4 px-2">
                      <div className="border-l-4 border-green-400 pl-4">
                        <p className="font-medium">&quot;Incredibly comfortable and durable&quot;</p>
                        <p className="text-sm text-gray-600">- Sarah M. ⭐⭐⭐⭐⭐</p>
                      </div>
                      <div className="border-l-4 border-green-400 pl-4">
                        <p className="font-medium">&quot;Perfect fit and great quality materials&quot;</p>
                        <p className="text-sm text-gray-600">- Mike R. ⭐⭐⭐⭐⭐</p>
                      </div>
                      <div className="text-center pt-2">
                        <Link href="#reviews" className="text-blue-600 hover:text-blue-800 font-medium">
                          View All Reviews →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1">
            <figure>
              <Image
                src="/images/gym-2.svg"
                alt="Additional product showcase"
                width={600}
                height={600}
                className="product-highlight__image w-full h-full object-cover rounded-lg"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* Add to Cart Bottom Section */}
      <section className="add-to-cart">
        <div className="add-to-cart__container">
          <div className="add-to-cart__product-info">
            <h2 className="add-to-cart__product-title">WORDMARK CREW SOCKS 3 PACK / PEARL WHITE / Rs 4,700.00</h2>
          </div>

          <div className="add-to-cart__actions">
            <div className="add-to-cart__size-selector" role="group" aria-label="Size selection">
              {["S", "M", "L"].map((size) => (
                <button
                  key={size}
                  className={`add-to-cart__size-option ${selectedSize === size ? "selected" : ""}`}
                  onClick={() => setSelectedSize(size)}
                  aria-label={`Size ${size}`}
                >
                  <span className="add-to-cart__size-text">{size}</span>
                </button>
              ))}
            </div>

            <button className="add-to-cart__button" onClick={handleAddToCart} aria-label="Add selected item to cart">
              <span className="add-to-cart__button-text">ADD TO CART</span>
              <i className="fas fa-shopping-cart add-to-cart__button-icon"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Complete Your Looks Section */}
      <section className="wordmark-section-container px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20 bg-white">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <h2 className="wordmark-title text-black">You may also like</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Product Card 1 */}
          <article className="flex flex-col space-y-8">
            <Link
              href="/product-detail"
              className="wordmark-card bg-transparent rounded-lg overflow-hidden flex flex-col relative group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex-1 relative overflow-hidden">
                <Image
                  className="wordmark-card-image w-full h-full transition-transform duration-500 group-hover:scale-105"
                  src="/images/gym-2.svg"
                  alt="Compression Leggings - Charcoal"
                  width={300}
                  height={400}
                />
                <button
                  className="wordmark-icon-button absolute top-3 right-3 p-2 rounded-lg hover:bg-white hover:bg-opacity-80 transition-all duration-200"
                  aria-label="Add to wishlist"
                >
                  <i className="far fa-heart text-black text-lg hover:text-red-500 transition-colors duration-200"></i>
                </button>
              </div>

              <footer className="wordmark-card-footer p-2">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex-1">
                    <h3 className="wordmark-battle-box text-black">Best Seller</h3>
                    <p className="wordmark-price text-black">$42.99</p>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200" aria-label="Add to cart">
                    <i className="fas fa-plus text-black text-lg"></i>
                  </button>
                </div>
              </footer>
            </Link>

            <div className="space-y-2">
              <h3 className="wordmark-product-title">COMPRESSION LEGGINGS - CHARCOAL GREY</h3>
              <p className="wordmark-product-price">Rs 4,299.00</p>
            </div>
          </article>

          {/* Product Card 2 */}
          <article className="flex flex-col space-y-8">
            <Link
              href="/product-detail"
              className="wordmark-card bg-transparent rounded-lg overflow-hidden flex flex-col relative group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex-1 relative overflow-hidden">
                <Image
                  className="wordmark-card-image w-full h-full transition-transform duration-500 group-hover:scale-105"
                  src="/images/gym-3.svg"
                  alt="Sports Bra - Ocean Blue"
                  width={300}
                  height={400}
                />
                <button
                  className="wordmark-icon-button absolute top-3 right-3 p-2 rounded-lg hover:bg-white hover:bg-opacity-80 transition-all duration-200"
                  aria-label="Add to wishlist"
                >
                  <i className="far fa-heart text-black text-lg hover:text-red-500 transition-colors duration-200"></i>
                </button>
              </div>

              <footer className="wordmark-card-footer p-2">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex-1">
                    <h3 className="wordmark-battle-box text-black">New Arrival</h3>
                    <p className="wordmark-price text-black">$24.99</p>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200" aria-label="Add to cart">
                    <i className="fas fa-plus text-black text-lg"></i>
                  </button>
                </div>
              </footer>
            </Link>

            <div className="space-y-2">
              <h3 className="wordmark-product-title">HIGH SUPPORT SPORTS BRA - OCEAN BLUE</h3>
              <p className="wordmark-product-price">Rs 2,499.00</p>
            </div>
          </article>

          {/* Product Card 3 */}
          <article className="flex flex-col space-y-8 md:col-span-2 xl:col-span-1">
            <Link
              href="/product-detail"
              className="wordmark-card bg-transparent rounded-lg overflow-hidden flex flex-col relative group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex-1 relative overflow-hidden">
                <Image
                  className="wordmark-card-image w-full h-full transition-transform duration-500 group-hover:scale-105"
                  src="/images/gym-4.svg"
                  alt="Zip Hoodie - Heather Grey"
                  width={300}
                  height={400}
                />
                <button
                  className="wordmark-icon-button absolute top-3 right-3 p-2 rounded-lg hover:bg-white hover:bg-opacity-80 transition-all duration-200"
                  aria-label="Add to wishlist"
                >
                  <i className="far fa-heart text-black text-lg hover:text-red-500 transition-colors duration-200"></i>
                </button>
              </div>

              <footer className="wordmark-card-footer p-2">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex-1">
                    <h3 className="wordmark-battle-box text-black">Limited Edition</h3>
                    <p className="wordmark-price text-black">$59.99</p>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200" aria-label="Add to cart">
                    <i className="fas fa-plus text-black text-lg"></i>
                  </button>
                </div>
              </footer>
            </Link>

            <div className="space-y-2">
              <h3 className="wordmark-product-title">PERFORMANCE ZIP HOODIE - HEATHER GREY</h3>
              <p className="wordmark-product-price">Rs 5,999.00</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;