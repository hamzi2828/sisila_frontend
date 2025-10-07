import React from 'react';
import Image from 'next/image'; 


export const MainImageSection: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-8 lg:px-20" style={{ backgroundColor: '#ffffff' }}>
    <div className="mx-auto about-us-section1-fade-in">
      <div className="about-us-section1-image-overlay about-us-section1-hover-card">
        <Image
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Modern gym with premium equipment"
          width={1920}
          height={1080}
          className="w-full h-96 sm:h-[500px] lg:h-[600px] object-cover transition-transform duration-700 hover:scale-105"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 hover:opacity-100 transition-opacity duration-400">
          <div
            className="backdrop-blur-sm px-8 py-4 rounded-full"
            style={{ background: 'rgba(255, 255, 255, 0.9)' }}
          >
            <span className="font-semibold" style={{ color: '#000000' }}>
              Where It All Began
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
