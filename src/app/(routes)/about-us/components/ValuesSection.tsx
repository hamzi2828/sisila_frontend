import React from 'react';

type ValueCardProps = {
  number: string;
  icon: string;
  title: string;
  description: string;
};

const ValueCard: React.FC<ValueCardProps> = ({ number, icon, title, description }) => (
  <article className="about-us-context-value-card">
    <div className="about-us-context-value-number">{number}</div>
    <div className="about-us-context-value-icon">
      <i className={`${icon} text-2xl`} style={{ color: '#000000' }}></i>
    </div>
    <h3 className="about-us-context-value-title">{title}</h3>
    <p className="about-us-context-value-description">
      {description}
    </p>
  </article>
);

export const ValuesSection: React.FC = () => {
  const values = [
    {
      number: '01',
      icon: 'fas fa-trophy',
      title: 'Performance Excellence',
      description: 'Push your limits with premium gymwear engineered for maximum performance. Every fabric, every cut, every detail is designed to help you achieve greatness in your fitness journey.'
    },
    {
      number: '02',
      icon: 'fas fa-users',
      title: 'Community Strength',
      description: 'Build unbreakable bonds with fellow athletes who share your passion. Together, we create a supportive ecosystem where everyone thrives and achieves their personal best.'
    },
    {
      number: '03',
      icon: 'fas fa-leaf',
      title: 'Sustainable Innovation',
      description: 'Create positive impact through eco-conscious materials and revolutionary designs. We&apos;re committed to protecting the planet while delivering cutting-edge athletic wear.'
    },
    {
      number: '04',
      icon: 'fas fa-fire',
      title: 'Fearless Pursuit',
      description: 'Embrace every challenge as an opportunity to grow stronger. We believe in transforming setbacks into comebacks, turning every workout into a victory.'
    }
  ];

  return (
    <section className="about-us-context-section py-20 px-4 sm:px-8 lg:px-20">
      <div className="mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-start about-us-context-flex-container">
          {/* Title Section */}
          <div className="lg:flex-shrink-0 lg:w-1/3 about-us-context-left-section">
            <h2 className="about-us-context-title">Our Values</h2>
            <p 
              className="text-lg leading-relaxed mt-6 mb-8"
              style={{ color: '#6a6b70', fontFamily: "'Inter', sans-serif" }}
            >
              The principles that drive every stitch, every design, and every
              relationship we build with our athletic community.
            </p>
          </div>

          {/* Values Container */}
          <div className="about-us-context-values-container flex-1 w-full">
            <div className="space-y-6">
              {values.map((value, index) => (
                <ValueCard
                  key={index}
                  number={value.number}
                  icon={value.icon}
                  title={value.title}
                  description={value.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
