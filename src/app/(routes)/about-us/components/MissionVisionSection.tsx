import React from 'react';

export const MissionVisionSection: React.FC = () => {
  return (
    <div className="py-16 px-4 sm:px-8 lg:px-20 about-us-section1-dark-gradient bg-white">
      <div className="mx-auto about-us-section1-fade-in">
        <div className="text-center space-y-12">
          <div className="space-y-6">
            <h2
              className="mission-heading text-3xl sm:text-4xl lg:text-5xl"
              style={{ color: '#000000' }}
            >
              Mission & Vision
            </h2>
            <div
              className="w-24 h-1 mx-auto rounded-full"
              style={{ background: 'linear-gradient(to right, #bee304, #bee304)' }}
            ></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission Card */}
            <div className="about-us-section1-glass-card p-8 rounded-2xl text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: '#bee304' }}
              >
                <svg
                  className="w-8 h-8"
                  style={{ color: '#000000' }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>
                Our Mission
              </h3>
              <p className="leading-relaxed" style={{ color: '#aeafb2' }}>
                To empower every athlete with premium gymwear that enhances
                performance and confidence.
              </p>
            </div>

            {/* Vision Card */}
            <div className="about-us-section1-glass-card p-8 rounded-2xl text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: '#bee304' }}
              >
                <svg
                  className="w-8 h-8"
                  style={{ color: '#000000' }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>
                Our Vision
              </h3>
              <p className="leading-relaxed" style={{ color: '#aeafb2' }}>
                To be the global leader in innovative, sustainable, and
                performance-driven athletic wear.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
