import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AnnouncementBar = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 15,
    seconds: 0
  });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number): string => String(num).padStart(2, '0');

  if (!isVisible) return null;

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

        .announcement-bar {
          width: 100%;
          padding: 10px 0;
          background-color: #000000;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          position: relative;
          padding-left: 16px;
          padding-right: 16px;
        }

        .announcement-content {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .announcement-text {
          color: #ffffff;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          line-height: normal;
        }

        .countdown-timer {
          color: #ffffff;
          font-size: 16px;
          font-weight: 400;
          font-family: 'Poppins', sans-serif;
          line-height: normal;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .close-button {
          position: absolute;
          right: 16px;
          color: #ffffff;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .close-button:hover {
          color: #d1d5db;
        }

        @media (max-width: 768px) {
          .announcement-text {
            font-size: 14px;
            text-align: center;
          }

          .countdown-timer {
            font-size: 14px;
          }
        }
      `}</style>

      <div className="announcement-bar">
        <div className="announcement-content">
          <div className="announcement-text">
            LIMITED OFFER: 30% OFF. Use RABBIT30 at Checkout.
          </div>
          <div className="countdown-timer">
            <span>{formatTime(timeLeft.hours)}</span>
            <span>:</span>
            <span>{formatTime(timeLeft.minutes)}</span>
            <span>:</span>
            <span>{formatTime(timeLeft.seconds)}</span>
          </div>
        </div>
        
        <button
          onClick={() => setIsVisible(false)}
          className="close-button"
          aria-label="Close announcement"
        >
          <X size={20} />
        </button>
      </div>
    </>
  );
};

export default AnnouncementBar;