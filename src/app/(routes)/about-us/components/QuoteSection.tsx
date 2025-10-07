import React from 'react';
import Image from 'next/image';

export const QuoteSection: React.FC = () => {
  return (
    <div className="relative">
      <div
        className="w-full h-96 sm:h-[600px] lg:h-[700px] overflow-hidden"
        style={{ backgroundColor: '#aeafb2' }}
      >
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Athletes training together"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
          priority
        />
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: 'rgba(0, 0, 0, 0.4)' }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center about-us-section1-fade-in">
          <blockquote className="about-us-section1-quote-card">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-light leading-relaxed mb-6">
              &ldquo;Quality gymwear that moves with you, supports your goals, and
              stands the test of time.&rdquo;
            </p>
            <div
              className="w-16 h-1 mx-auto mb-4"
              style={{ backgroundColor: '#ffffff' }}
            ></div>
            <cite className="text-lg not-italic" style={{ color: '#aeafb2' }}>
              Our Promise to Every Athlete
            </cite>
          </blockquote>
        </div>
      </div>
    </div>
  );
};
