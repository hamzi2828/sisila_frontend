"use client";

import React from "react";
import Link from "next/link";
import '@fortawesome/fontawesome-free/css/all.css';
import HeroAbout from "../about-us/components/HeroAbout";

const ContactUsPage = () => {
  return (
    <main className="pt-20">
      <HeroAbout/>
      <section className="bg-white sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* Navigation Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <nav className="bg-white rounded-lg shadow-sm overflow-hidden lg:sticky lg:top-20">
                <Link href="/faqs" className="privacy-faq-nav-tab w-full px-6 py-4 text-left font-medium text-sm border-b border-gray-100 privacy-faq-nav-inactive block">
                  <i className="fas fa-question-circle mr-2"></i>
                  FAQS
                </Link>
                <Link href="/privacy-policy" className="privacy-faq-nav-tab w-full px-6 py-4 text-left font-medium text-sm border-b border-gray-100 privacy-faq-nav-inactive block">
                  <i className="fas fa-shield-alt mr-2"></i>
                  PRIVACY
                </Link>
                <Link href="/contact-us" className="privacy-faq-nav-tab w-full px-6 py-4 text-left font-medium text-sm privacy-faq-nav-active block">
                  <i className="fas fa-envelope mr-2"></i>
                  CONTACT US
                </Link>
              </nav>
            </aside>

            {/* Main Content */}
            <section className="flex-1">
              {/* Contact Content */}
              <div id="contact" className="privacy-faq-tab-content">
                <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8 lg:pt-0">
                  <header className="mb-8">
                    <h1 className="privacy-faq-title text-2xl lg:text-3xl mb-4">
                      CONTACT INFORMATION
                    </h1>
                    <div className="space-y-4 privacy-faq-subtitle">
                      <p>
                        <strong>For Exchanges and Returns:</strong> Read our
                        policy and apply for returns here:
                        <Link href="#" className="text-blue-600 hover:underline">
                          GYMWEAR RETURNS
                        </Link>
                      </p>
                      <p>
                        <strong>For Wholesale Enquiries:</strong> Please use
                        this form:
                        <Link href="#" className="text-blue-600 hover:underline">
                          GYMWEAR WHOLESALE
                        </Link>
                      </p>
                      <p>
                        <strong>For Other Queries:</strong> Email us at
                        support@gymwear.com
                      </p>
                      <p>
                        <strong>Live Chat:</strong> Available 9 AM to 6 PM Dubai
                        Time (GST), Monday to Friday
                      </p>
                      <p>
                        We typically reply within 24-48 hours on email. We
                        appreciate your patience.
                      </p>
                    </div>
                  </header>

                  <div className="bg-gray-50 rounded-lg p-6 lg:p-8">
                    <h2 className="privacy-faq-title text-xl mb-6">
                      FOR ALL OTHER QUERIES
                    </h2>
                    <form className="space-y-6">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          placeholder="Enter your name"
                          className="privacy-faq-form-input w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="emailAddress"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          EMAIL ADDRESS
                        </label>
                        <input
                          type="email"
                          id="emailAddress"
                          name="emailAddress"
                          placeholder="Enter your email"
                          className="privacy-faq-form-input w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Number
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          placeholder="+92 987382 8967"
                          className="privacy-faq-form-input w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="additionalInfo"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Any Additional Information
                        </label>
                        <textarea
                          id="additionalInfo"
                          name="additionalInfo"
                          rows={6}
                          placeholder="Please describe your query or concern..."
                          className="privacy-faq-form-input w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 resize-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="privacy-faq-submit-btn inline-block w-full py-4 px-6 text-center text-white font-semibold rounded-lg transition-colors duration-300 hover:shadow-lg"
                      >
                        <i className="fas fa-paper-plane mr-2"></i>
                        SUBMIT
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactUsPage;
