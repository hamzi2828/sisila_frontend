"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface WishlistItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  color: string;
  sizes: string[];
  rating: number;
  inStock: boolean;
  discount: number;
  category: string;
  addedDate: string;
}

const WishlistPage: React.FC = () => {
  const initialItems: WishlistItem[] = [
    {
      id: 1,
      name: "WORDMARK CREW SOCKS 3 PACK",
      brand: "CRE CUT",
      price: 21600.0,
      originalPrice: 24000.0,
      image: "/images/gym-2.svg",
      color: "PEARL WHITE",
      sizes: ["S", "M", "L"],
      rating: 5.0,
      inStock: true,
      discount: 10,
      category: "Accessories",
      addedDate: "2024-08-10",
    },
    {
      id: 2,
      name: "COMPRESSION LEGGINGS",
      brand: "CRE CUT",
      price: 4299.0,
      originalPrice: 4999.0,
      image: "/images/gym-3.svg",
      color: "CHARCOAL GREY",
      sizes: ["XS", "S", "M", "L", "XL"],
      rating: 4.8,
      inStock: true,
      discount: 14,
      category: "Bottoms",
      addedDate: "2024-08-12",
    },
    {
      id: 3,
      name: "HIGH SUPPORT SPORTS BRA",
      brand: "CRE CUT",
      price: 2499.0,
      originalPrice: 2999.0,
      image: "/images/gym-4.svg",
      color: "OCEAN BLUE",
      sizes: ["XS", "S", "M", "L"],
      rating: 4.9,
      inStock: false,
      discount: 17,
      category: "Tops",
      addedDate: "2024-08-08",
    },
    {
      id: 4,
      name: "PERFORMANCE ZIP HOODIE",
      brand: "CRE CUT",
      price: 5999.0,
      originalPrice: 6999.0,
      image: "/images/gym-5.svg",
      color: "HEATHER GREY",
      sizes: ["S", "M", "L", "XL"],
      rating: 4.7,
      inStock: true,
      discount: 14,
      category: "Outerwear",
      addedDate: "2024-08-11",
    },
    {
      id: 5,
      name: "ATHLETIC TANK TOP",
      brand: "CRE CUT",
      price: 1899.0,
      originalPrice: 2299.0,
      image: "/images/gym-2.svg",
      color: "MINT GREEN",
      sizes: ["XS", "S", "M", "L"],
      rating: 4.6,
      inStock: true,
      discount: 17,
      category: "Tops",
      addedDate: "2024-08-13",
    },
    {
      id: 6,
      name: "RUNNING SHORTS",
      brand: "CRE CUT",
      price: 3299.0,
      originalPrice: 3899.0,
      image: "/images/gym-3.svg",
      color: "BLACK",
      sizes: ["S", "M", "L", "XL"],
      rating: 4.5,
      inStock: true,
      discount: 15,
      category: "Bottoms",
      addedDate: "2024-08-09",
    },
  ];

  // State
  const [items, setItems] = useState<WishlistItem[]>(initialItems);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: "success" | "info" | "error" }>({
    show: false,
    msg: "",
    type: "success",
  });

  // Derived
  const totalSavings = items.reduce((acc, item) => acc + (item.originalPrice - item.price), 0);

  // Helpers
  const slugify = (text: string) =>
    text.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const showToast = (msg: string, type: "success" | "info" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type }), 2500);
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    if (selectAll) setSelectedItems([]);
    else setSelectedItems(items.map((i) => i.id));
    setSelectAll(!selectAll);
  };

  const handleRemove = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedItems((prev) => prev.filter((x) => x !== id));
    showToast("Removed from wishlist", "info");
  };

  const handleRemoveSelected = () => {
    if (!selectedItems.length) return;
    setItems((prev) => prev.filter((i) => !selectedItems.includes(i.id)));
    setSelectedItems([]);
    showToast("Selected items removed", "info");
  };

  const handleMoveToCart = (ids?: number[]) => {
    const targetIds = ids && ids.length ? ids : selectedItems;
    if (!targetIds.length) return;
    // Simulate add to cart
    showToast(`${targetIds.length} item(s) moved to cart`, "success");
  };

  const handleShareWishlist = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `Check out my wishlist on SunLink!\n${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Wishlist", text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      showToast("Wishlist link copied to clipboard", "success");
    } catch {
      showToast("Could not share wishlist", "error");
    }
  };

  // Sync selectAll state
  useEffect(() => {
    setSelectAll(items.length > 0 && selectedItems.length === items.length);
  }, [selectedItems, items.length]);

  return (
    <main className="pt-20 min-h-screen bg-white font-montserrat">
      <style jsx global>{`
        .font-sora {
          font-family: "Sora", sans-serif;
        }
        .font-manrope {
          font-family: "Manrope", sans-serif;
        }
        .font-montserrat {
          font-family: "Montserrat", sans-serif;
        }
        .text-custom-green {
          color: #bee304;
        }
        .bg-custom-green {
          background-color: #bee304;
        }
        .text-custom-gray-300 {
          color: #aeafb2;
        }
        .text-custom-gray-500 {
          color: #6a6b70;
        }
        .text-custom-gray-900 {
          color: #3b3b3e;
        }
        .border-custom-green {
          border-color: #bee304;
        }
      `}</style>

      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-md ${
            toast.type === "success"
              ? "bg-green-50 text-gray-800 border-l-4 border-green-400"
              : toast.type === "info"
              ? "bg-blue-50 text-blue-800 border-l-4 border-blue-400"
              : "bg-red-50 text-red-700 border-l-4 border-red-400"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="font-semibold">{toast.msg}</span>
            {toast.type !== "error" && (
              <Link href="/cart" className="underline font-semibold">
                View cart
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Wishlist Section */}
      <section className="px-4 sm:px-6 lg:px-20 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 lg:mb-10 gap-4">
          <div className="space-y-2 sm:space-y-3">
            <h1 className="font-sora text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-black leading-tight tracking-tight">
              My Wishlist
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-custom-gray-500 font-manrope text-sm sm:text-base lg:text-lg">
              <span>
                {items.length} item{items.length !== 1 ? "s" : ""}
              </span>
              <span className="w-1 h-1 bg-custom-gray-300 rounded-full" />
              <span className="font-semibold text-custom-green">Save Rs {totalSavings.toLocaleString()}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-colors ${
                  viewMode === "list" ? "bg-custom-green text-black" : "text-custom-gray-500 hover:text-custom-gray-900"
                }`}
              >
                <i className="fas fa-list mr-2" />
                List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-colors ${
                  viewMode === "grid" ? "bg-custom-green text-black" : "text-custom-gray-500 hover:text-custom-gray-900"
                }`}
              >
                <i className="fas fa-th-large mr-2" />
                Grid
              </button>
            </div>

            {/* Share / Clear */}
            <div className="flex gap-2">
              <button
                onClick={handleShareWishlist}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-custom-green hover:text-custom-green font-semibold"
                title="Share wishlist"
              >
                <i className="fas fa-share-alt mr-2" />
                Share
              </button>
              {items.length > 0 && (
                <button
                  onClick={() => {
                    setItems([]);
                    setSelectedItems([]);
                    showToast("Wishlist cleared", "info");
                  }}
                  className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:border-red-500 font-semibold"
                  title="Clear wishlist"
                >
                  <i className="fas fa-trash-alt mr-2" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {items.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 p-3 sm:p-4 bg-gray-50 rounded-lg border gap-3 sm:gap-4">
            <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 sm:w-5 sm:h-5 text-custom-green border-2 border-gray-300 rounded focus:ring-2 focus:ring-custom-green"
              />
              <span className="font-semibold text-custom-gray-900 font-sora text-sm sm:text-base">Select All</span>
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <span className="text-custom-gray-500 font-medium text-xs sm:text-sm">
                {selectedItems.length} of {items.length} selected
              </span>

              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  disabled={selectedItems.length === 0}
                  onClick={() => handleMoveToCart()}
                  className={`px-3 sm:px-6 py-2 font-semibold rounded-lg transition-colors font-sora text-xs sm:text-sm ${
                    selectedItems.length > 0 ? "bg-custom-green text-black hover:bg-green-400" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <i className="fas fa-shopping-cart mr-1 sm:mr-2" />
                  Move to Cart
                </button>
                <button
                  disabled={selectedItems.length === 0}
                  onClick={handleRemoveSelected}
                  className={`px-3 sm:px-6 py-2 font-semibold rounded-lg transition-colors font-sora text-xs sm:text-sm ${
                    selectedItems.length > 0 ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <i className="fas fa-trash mr-1 sm:mr-2" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-xl border">
            <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow">
              <i className="far fa-heart text-3xl text-custom-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-black mb-2">Your wishlist is empty</h3>
            <p className="text-custom-gray-500 mb-6">Save your favorite products to shop later</p>
            <Link
              href="/main"
              className="inline-flex items-center px-6 py-3 bg-custom-green text-black font-semibold rounded-lg hover:bg-green-400"
            >
              <i className="fas fa-shopping-bag mr-2" />
              Continue Shopping
            </Link>
          </div>
        )}

        {/* Wishlist Items - List View */}
        {items.length > 0 && viewMode === "list" && (
          <div className="space-y-4 sm:space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border-2 border-gray-200 hover:border-custom-green transition-all duration-300 hover:shadow-xl p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-custom-green border-2 border-gray-300 rounded focus:ring-2 focus:ring-custom-green mt-1 sm:mt-2 order-1 sm:order-none"
                  />

                  {/* Product Image */}
                  <div className="relative w-full sm:w-24 md:w-32 lg:w-40 aspect-square flex-shrink-0 order-2 sm:order-none">
                    <Link href="/product-detail" className="block">
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} className="rounded-lg" />
                    </Link>

                    {/* Discount Badge */}
                    {item.discount > 0 && (
                      <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-red-500 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow-lg">
                        -{item.discount}%
                      </div>
                    )}

                    {/* Stock Status */}
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold px-2 sm:px-3 py-1 bg-red-500 rounded-full text-xs sm:text-sm">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 order-3 sm:order-none w-full sm:w-auto">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="space-y-2 min-w-0 flex-1">
                        {/* Category */}
                        <Link
                          href={{ pathname: "/main", query: { category: slugify(item.category) } }}
                          className="inline-block px-2 sm:px-3 py-1 bg-gray-100 text-custom-gray-500 text-xs font-medium rounded-full font-manrope hover:text-custom-green"
                        >
                          {item.category}
                        </Link>

                        <Link
                          href="/product-detail"
                          className="font-bold text-custom-gray-900 text-base sm:text-lg leading-tight font-sora break-words hover:underline"
                        >
                          {item.name}
                        </Link>

                        <p className="text-custom-gray-500 font-medium font-manrope text-sm sm:text-base">{item.brand}</p>
                        <p className="text-custom-gray-500 text-xs sm:text-sm font-manrope">Color: {item.color}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fas fa-star text-xs sm:text-sm ${i < Math.floor(item.rating) ? "text-yellow-400" : "text-gray-300"}`} />
                            ))}
                          </div>
                          <span className="text-custom-gray-500 text-xs sm:text-sm font-medium font-manrope">({item.rating})</span>
                        </div>

                        {/* Sizes */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-custom-gray-500 text-xs sm:text-sm font-manrope">Sizes:</span>
                          <div className="flex flex-wrap gap-1">
                            {item.sizes.map((size) => (
                              <span key={size} className="text-xs px-2 py-1 bg-gray-100 text-custom-gray-900 rounded font-medium">
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex flex-col items-start lg:items-end space-y-3 sm:space-y-4 lg:min-w-[192px]">
                        <div className="text-left lg:text-right">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                            <span className="font-bold text-lg sm:text-xl text-black font-sora">Rs {item.price.toLocaleString()}</span>
                            {item.originalPrice > item.price && (
                              <span className="text-custom-gray-300 line-through font-manrope text-sm sm:text-base">
                                Rs {item.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          {item.originalPrice > item.price && (
                            <p className="text-custom-green font-semibold font-manrope text-xs sm:text-sm">
                              Save Rs {(item.originalPrice - item.price).toLocaleString()}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 sm:gap-3 w-full lg:w-auto">
                          <button
                            disabled={!item.inStock}
                            onClick={() => handleMoveToCart([item.id])}
                            className={`flex-1 lg:flex-none px-4 sm:px-6 py-2 sm:py-3 font-semibold rounded-lg transition-all duration-200 font-sora text-xs sm:text-sm ${
                              item.inStock
                                ? "bg-custom-green text-black hover:bg-green-400 hover:shadow-lg transform hover:scale-105"
                                : "bg-gray-200 text-custom-gray-300 cursor-not-allowed"
                            }`}
                          >
                            <i className={`${item.inStock ? "fas fa-shopping-cart" : "fas fa-exclamation-triangle"} mr-1 sm:mr-2`} />
                            {item.inStock ? "Move to Cart" : "Out of Stock"}
                          </button>

                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-2 sm:p-3 text-custom-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Remove from wishlist"
                          >
                            <i className="fas fa-trash text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Wishlist Items - Grid View */}
        {items.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border-2 border-gray-200 hover:border-custom-green transition-all duration-300 hover:shadow-xl overflow-hidden"
              >
                {/* Checkbox */}
                <div className="p-3 border-b border-gray-100">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="w-4 h-4 text-custom-green border-2 border-gray-300 rounded focus:ring-2 focus:ring-custom-green"
                    />
                    <span className="text-sm font-medium text-custom-gray-900">Select</span>
                  </label>
                </div>

                {/* Product Image */}
                <div className="relative aspect-square">
                  <Link href="/product-detail" className="block">
                    <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                  </Link>

                  {/* Discount Badge */}
                  {item.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      -{item.discount}%
                    </div>
                  )}

                  {/* Stock Status */}
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold px-3 py-1 bg-red-500 rounded-full text-sm">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-4 space-y-3">
                  <Link
                    href={{ pathname: "/main", query: { category: slugify(item.category) } }}
                    className="inline-block px-2 py-1 bg-gray-100 text-custom-gray-500 text-xs font-medium rounded-full font-manrope hover:text-custom-green"
                  >
                    {item.category}
                  </Link>

                  <div>
                    <Link href="/product-detail" className="font-bold text-custom-gray-900 text-sm leading-tight font-sora line-clamp-2 hover:underline">
                      {item.name}
                    </Link>
                    <p className="text-custom-gray-500 font-medium font-manrope text-sm mt-1">{item.brand}</p>
                  </div>

                  <p className="text-custom-gray-500 text-xs font-manrope">Color: {item.color}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fas fa-star text-xs ${i < Math.floor(item.rating) ? "text-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                    <span className="text-custom-gray-500 text-xs font-medium font-manrope">({item.rating})</span>
                  </div>

                  {/* Sizes */}
                  <div className="flex flex-wrap gap-1">
                    {item.sizes.map((size) => (
                      <span key={size} className="text-xs px-2 py-1 bg-gray-100 text-custom-gray-900 rounded font-medium">
                        {size}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-black font-sora">Rs {item.price.toLocaleString()}</span>
                      {item.originalPrice > item.price && (
                        <span className="text-custom-gray-300 line-through font-manrope text-sm">
                          Rs {item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {item.originalPrice > item.price && (
                      <p className="text-custom-green font-semibold font-manrope text-xs">
                        Save Rs {(item.originalPrice - item.price).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      disabled={!item.inStock}
                      onClick={() => handleMoveToCart([item.id])}
                      className={`flex-1 px-4 py-2 font-semibold rounded-lg transition-all duration-200 font-sora text-sm ${
                        item.inStock ? "bg-custom-green text-black hover:bg-green-400 hover:shadow-lg" : "bg-gray-200 text-custom-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <i className={`${item.inStock ? "fas fa-shopping-cart" : "fas fa-exclamation-triangle"} mr-2`} />
                      {item.inStock ? "Move to Cart" : "Out of Stock"}
                    </button>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2 text-custom-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Remove from wishlist"
                    >
                      <i className="fas fa-trash text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {items.length > 0 && (
          <div className="mt-12 sm:mt-16 text-center">
            <Link
              href="/main"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 rounded-lg text-custom-gray-900 font-semibold hover:border-custom-green hover:text-custom-green transition-colors font-sora text-sm sm:text-base lg:text-lg"
            >
              <i className="fas fa-arrow-left mr-2 sm:mr-3" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        )}
      </section>

      {/* You Might Also Like */}
      <section className="px-4 sm:px-6 lg:px-20 py-12 sm:py-16 bg-gray-50">
        <div className="mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-6 sm:mb-8 font-sora">You Might Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-custom-green"
              >
                <div className="relative aspect-square group">
                  <Link href="/product-detail" className="block">
                    <Image src="/images/gym-2.svg" alt="Suggested product" fill style={{ objectFit: "cover" }} />
                  </Link>
                  <button
                    onClick={() => showToast("Added to wishlist", "success")}
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200 transform hover:scale-110 shadow-md"
                  >
                    <i className="far fa-heart text-custom-gray-500 hover:text-red-500 text-xs sm:text-sm" />
                  </button>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={() => showToast("Quick added to cart", "success")}
                      className="bg-custom-green text-black px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 font-sora text-xs sm:text-sm"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
                <div className="p-2 sm:p-4">
                  <Link href="/product-detail" className="font-semibold text-custom-gray-900 text-xs sm:text-sm line-clamp-2 mb-2 font-sora hover:underline">
                    Premium Athletic Wear
                  </Link>
                  <div className="flex items-center justify-between">
                    <p className="text-sm sm:text-lg font-bold text-black font-sora">Rs 2,499</p>
                    <div className="flex items-center">
                      <i className="fas fa-star text-yellow-400 text-xs" />
                      <span className="text-xs text-custom-gray-500 ml-1 font-manrope">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-20 py-12 sm:py-16 bg-white border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-custom-green rounded-full flex items-center justify-center">
              <i className="fas fa-heart text-black text-lg sm:text-2xl" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-black mb-2 font-sora">{items.length} Items Saved</h3>
            <p className="text-custom-gray-500 font-manrope text-sm sm:text-base">Keep track of your favorite products</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fas fa-piggy-bank text-custom-green text-lg sm:text-2xl" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-black mb-2 font-sora">Rs {totalSavings.toLocaleString()} Saved</h3>
            <p className="text-custom-gray-500 font-manrope text-sm sm:text-base">Total savings on wishlist items</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-shipping-fast text-blue-500 text-lg sm:text-2xl" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-black mb-2 font-sora">Free Delivery</h3>
            <p className="text-custom-gray-500 font-manrope text-sm sm:text-base">On orders above Rs 2,500</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WishlistPage;