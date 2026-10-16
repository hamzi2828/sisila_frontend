import React from 'react';
import Image from 'next/image';

interface HeaderProps {
  isSignUp: boolean;
  isForgot: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isSignUp, isForgot }) => {
  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="w-20 h-20 rounded-3xl bg-stone-900 flex items-center justify-center mx-auto shadow-2xl ring-1 ring-stone-800">
          <Image
            src="/images/silsila-logo.png"
            alt="Silsila"
            width={56}
            height={56}
            className="h-12 w-12 object-contain brightness-0 invert"
          />
        </div>
      </div>
      <h1
        className="text-4xl md:text-5xl font-semibold uppercase text-stone-900 leading-tight tracking-tight mb-3"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        {isForgot ? 'Reset Password' : isSignUp ? 'Join Silsila' : 'Welcome back'}
      </h1>
      <p className="text-stone-600 text-base font-medium leading-relaxed">
        {isForgot
          ? 'Set a new password for your account'
          : isSignUp
          ? 'Create an account for early access to new drops and member-only offers'
          : 'Sign in to track orders and pick up your wishlist where you left off'}
      </p>
    </div>
  );
};
