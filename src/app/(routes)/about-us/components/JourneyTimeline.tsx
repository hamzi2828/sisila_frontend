import React from 'react';
import Image from 'next/image';

type JourneyItem = {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
};

const JourneyTimeline: React.FC = () => {
  const journeyItems: JourneyItem[] = [
    {
      title: 'Starting of our journey',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      imageAlt: 'Journey Image 1'
    },
    {
      title: 'Building our foundation',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      imageAlt: 'Journey Image 2'
    },
    {
      title: 'Growing our community',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      imageUrl: 'https://images.unsplash.com/photo-1549476464-37392f717541?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2087&q=80',
      imageAlt: 'Journey Image 3'
    }
  ];

  return (
    <section className="about-us-journey-section about-us-journey-flex-container">
      {/* Left Sticky Title Section */}
      <div className="about-us-journey-left-section">
        <h2 className="about-us-journey-title">Starting of our journey</h2>
      </div>

      {/* Main Content Section */}
      <div className="about-us-journey-main">
        {journeyItems.map((item, index) => (
          <React.Fragment key={index}>
            {/* Content Block */}
            <div className="about-us-journey-content-block">
              <h3 className="about-us-journey-block-title">{item.title}</h3>
              <p className="about-us-journey-description">
                {item.description}
              </p>
            </div>

            {/* Image */}
            <div className="about-us-journey-image relative w-full h-64 md:h-96">
              <Image
                src={item.imageUrl}
                alt={item.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default JourneyTimeline;
