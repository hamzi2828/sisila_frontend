import React from 'react';



export const StatsSection: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-8 lg:px-20" style={{ backgroundColor: '#ffffff' }}>
    <div className="mx-auto about-us-section1-fade-in">
      <div className="about-us-section1-stats-grid">
        <div className="about-us-section1-stat-card">
          <div className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>
            2019
          </div>
          <div style={{ color: '#6a6b70' }}>Founded</div>
        </div>
        <div className="about-us-section1-stat-card">
          <div className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>
            50K+
          </div>
          <div style={{ color: '#6a6b70' }}>Happy Athletes</div>
        </div>
        <div className="about-us-section1-stat-card">
          <div className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>
            15+
          </div>
          <div style={{ color: '#6a6b70' }}>Countries</div>
        </div>
        <div className="about-us-section1-stat-card">
          <div className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>
            100%
          </div>
          <div style={{ color: '#6a6b70' }}>Quality Promise</div>
        </div>
      </div>
    </div>
  </div>
  );
};
