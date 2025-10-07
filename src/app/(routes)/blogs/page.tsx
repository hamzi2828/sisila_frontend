"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Blogs: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <main className="pt-14">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.svg"
            alt="Fitness Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="gym-blog-hero-overlay absolute inset-0"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="font-montserrat font-black text-4xl sm:text-5xl lg:text-7xl uppercase tracking-wider mb-6 gym-blog-text-shadow">
            OUR COMMUNITY
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl font-light mb-8 text-gray-200 max-w-2xl mx-auto">
            Join thousands of fitness enthusiasts sharing their journey, tips,
            and transformations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#featured"
              className="gym-blog-custom-gradient-green text-black font-bold px-8 py-4 rounded-full text-lg hover:scale-105 transition-all duration-300"
            >
              Explore Stories
            </a>
            <a
              href="#guides"
              className="gym-blog-glass-effect text-white font-semibold px-8 py-4 rounded-full text-lg hover:scale-105 transition-all duration-300"
            >
              Training Guides
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <i className="fas fa-chevron-down text-2xl gym-blog-custom-text-green"></i>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section
        id="featured"
        className="px-4 sm:px-12 lg:px-28 py-12 sm:py-16 lg:py-20 gym-blog-custom-bg-darker text-white"
      >
        <div className="mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-montserrat font-bold text-3xl sm:text-4xl uppercase tracking-wide mb-4">
              Featured Stories
            </h2>
            <div className="w-24 h-1 gym-blog-custom-bg-green mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Inspiring transformation stories from our community members
            </p>
          </div>

          {/* Large Featured Card */}
          <div className="mb-16">
            <article className="relative overflow-hidden rounded-2xl gym-blog-hover-lift transition-all duration-500 group">
              <div className="relative h-96 lg:h-[500px]">
                <Image
                  src="/images/gym-large.svg"
                  alt="Amazing Transformation Story"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="gym-blog-image-overlay absolute inset-0"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-12">
                  <span className="gym-blog-custom-bg-green text-black px-4 py-2 rounded-full text-sm font-bold uppercase mb-4 inline-block">
                    Transformation
                  </span>
                  <h3 className="font-montserrat font-bold text-3xl lg:text-5xl mb-4 text-white">
                    From Couch to Competition: Sarah&apos;s Journey
                  </h3>
                  <p className="text-lg lg:text-xl text-gray-200 mb-6 max-w-3xl">
                    How one woman transformed her life in 12 months, going from
                    never stepping foot in a gym to competing in her first
                    bodybuilding competition.
                  </p>
                  <div className="flex items-center gap-2 sm:gap-4 lg:gap-6  text-gray-300">
                    <div className="flex items-center gap-2">
                      <i className="far fa-clock gym-blog-custom-text-green"></i>
                      <span className="text-sm sm:text-base md:text-lg lg:text-xl">
                        8 min read
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="far fa-eye gym-blog-custom-text-green"></i>
                      <span className="text-sm sm:text-base md:text-lg lg:text-xl">
                        12.5k views
                      </span>
                    </div>
                    <Link
                      href="/blogs-detail"
                      className="gym-blog-custom-text-green font-semibold hover:underline flex items-center gap-2 text-sm sm:text-base md:text-lg lg:text-xl"
                    >
                      Read Story <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Featured Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/blogs-detail" className="block">
              <article className="gym-blog-card-gradient rounded-xl overflow-hidden gym-blog-hover-lift transition-all duration-500 group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src="/images/gym-blog-3.svg"
                    alt="Weight Loss Journey"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                      Weight Loss
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-3 group-hover:gym-blog-custom-text-green transition-colors">
                    Lost 50lbs in 6 Months
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Mark&apos;s incredible weight loss journey through consistent
                    training and meal prep dedication.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">5 min read</span>
                    <i className="fas fa-arrow-up-right gym-blog-custom-text-green group-hover:transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                  </div>
                </div>
              </article>
            </Link>

            <Link href="/blogs-detail" className="block">
              <article className="gym-blog-card-gradient rounded-xl overflow-hidden gym-blog-hover-lift transition-all duration-500 group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src="/images/gym-blog-2.svg"
                    alt="Strength Training"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                      Strength
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-3 group-hover:gym-blog-custom-text-green transition-colors">
                    Deadlifting 400lbs at 55
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    How Jessica proved that age is just a number by achieving her
                    strength goals later in life.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">6 min read</span>
                    <i className="fas fa-arrow-up-right gym-blog-custom-text-green group-hover:transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                  </div>
                </div>
              </article>
            </Link>

            <Link href="/blogs-detail" className="block">
              <article className="gym-blog-card-gradient rounded-xl overflow-hidden gym-blog-hover-lift transition-all duration-500 group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src="/images/gym-blog-1.svg"
                    alt="Marathon Training"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                      Endurance
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-3 group-hover:gym-blog-custom-text-green transition-colors">
                    First Marathon at 40
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    David&apos;s journey from casual jogger to marathon finisher in
                    just 8 months of training.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">7 min read</span>
                    <i className="fas fa-arrow-up-right gym-blog-custom-text-green group-hover:transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </div>
      </section>

      {/* Training Guides Section */}
      <section
        id="guides"
        className="px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20 gym-blog-custom-bg-dark text-white"
      >
        <div className="mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16">
            <div>
              <h2 className="font-montserrat font-bold text-3xl sm:text-4xl uppercase tracking-wide mb-4">
                Training Guides
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl">
                Expert-crafted workout programs for every fitness level
              </p>
            </div>
            <a
              href="#"
              className="mt-6 lg:mt-0 gym-blog-custom-gradient-green text-black font-bold px-6 py-3 rounded-full hover:scale-105 transition-all duration-300  gap-2"
            >
              View All Guides <i className="fas fa-arrow-right"></i>
            </a>
          </div>

          {/* Guides Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Large Guide Card */}
            <Link href="/blogs-detail" className="block">
              <article className="lg:row-span-2 relative overflow-hidden rounded-2xl gym-blog-hover-lift transition-all duration-500 group">
                <div className="relative h-80 lg:h-full min-h-[400px]">
                  <Image
                    src="/images/hero.svg"
                    alt="Ultimate Push Day Guide"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="gym-blog-image-overlay absolute inset-0"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="gym-blog-custom-bg-green text-black px-4 py-2 rounded-full text-sm font-bold uppercase mb-4 inline-block">
                      Workout Guide
                    </span>
                    <h3 className="font-montserrat font-bold text-2xl lg:text-4xl mb-4 text-white">
                      Ultimate Push Day Routine
                    </h3>
                    <p className="text-lg text-gray-200 mb-6">
                      Complete chest, shoulders, and triceps workout with
                      progressive overload techniques for maximum muscle growth.
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-300">
                        <i className="far fa-clock mr-1"></i> 45 min workout
                      </span>
                      <span className="text-sm text-gray-300">
                        <i className="fas fa-dumbbell mr-1"></i> Intermediate
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>

            {/* Smaller Guide Cards */}
            <div>
              <Link href="/blogs-detail" className="block">
                <article className="gym-blog-card-gradient rounded-xl overflow-hidden gym-blog-hover-lift transition-all duration-500 group mb-3">
                  <div className="flex h-48">
                    <div className="w-1/2 relative overflow-hidden">
                      <Image
                        src="/images/gym-blog-2.svg"
                        alt="Leg Day Guide"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="w-1/2 p-6 flex flex-col justify-between">
                      <div>
                        <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold uppercase mb-2 inline-block">
                          Lower Body
                        </span>
                        <h3 className="font-semibold text-lg mb-2 group-hover:gym-blog-custom-text-green transition-colors">
                          Complete Leg Day
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Build powerful legs with this comprehensive routine.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">60 min</span>
                        <i className="fas fa-arrow-right gym-blog-custom-text-green"></i>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>

              <Link href="/blogs-detail" className="block">
                <article className="gym-blog-card-gradient rounded-xl overflow-hidden gym-blog-hover-lift transition-all duration-500 group">
                  <div className="flex h-48">
                    <div className="w-1/2 relative overflow-hidden">
                      <Image
                        src="/images/gym-large.svg"
                        alt="HIIT Training"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="w-1/2 p-6 flex flex-col justify-between">
                      <div>
                        <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold uppercase mb-2 inline-block">
                          Cardio
                        </span>
                        <h3 className="font-semibold text-lg mb-2 group-hover:gym-blog-custom-text-green transition-colors">
                          HIIT Fat Burner
                        </h3>
                        <p className="text-gray-400 text-sm">
                          High-intensity intervals for maximum fat loss.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">20 min</span>
                        <i className="fas fa-arrow-right gym-blog-custom-text-green"></i>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="gym-blog-glass-effect rounded-lg p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer">
              <i className="fas fa-dumbbell text-3xl gym-blog-custom-text-green mb-3"></i>
              <h4 className="font-semibold mb-1">Strength</h4>
              <p className="text-sm text-gray-400">24 Workouts</p>
            </div>
            <div className="gym-blog-glass-effect rounded-lg p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer">
              <i className="fas fa-running text-3xl gym-blog-custom-text-green mb-3"></i>
              <h4 className="font-semibold mb-1">Cardio</h4>
              <p className="text-sm text-gray-400">18 Routines</p>
            </div>
            <div className="gym-blog-glass-effect rounded-lg p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer">
              <i className="fas fa-leaf text-3xl gym-blog-custom-text-green mb-3"></i>
              <h4 className="font-semibold mb-1">Yoga</h4>
              <p className="text-sm text-gray-400">12 Sessions</p>
            </div>
            <div className="gym-blog-glass-effect rounded-lg p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer">
              <i className="fas fa-home text-3xl gym-blog-custom-text-green mb-3"></i>
              <h4 className="font-semibold mb-1">Home</h4>
              <p className="text-sm text-gray-400">15 Workouts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nutrition Section */}
      <section className="px-4 sm:px-12 lg:px-28 py-12 sm:py-16 lg:py-20 gym-blog-custom-bg-darker text-white">
        <div className="mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-montserrat font-bold text-3xl sm:text-4xl uppercase tracking-wide mb-4">
              Nutrition Hub
            </h2>
            <div className="w-24 h-1 gym-blog-custom-bg-green mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Fuel your body right with expert nutrition advice and meal plans
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Nutrition Article */}
            <Link href="/blogs-detail" className="block lg:col-span-2">
              <article className="relative overflow-hidden rounded-2xl gym-blog-hover-lift transition-all duration-500 group">
                <div className="relative h-80">
                  <Image
                    src="/images/gym-bdetail1.svg"
                    alt="Meal Prep Mastery"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="gym-blog-image-overlay absolute inset-0"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase mb-4 inline-block">
                      Nutrition Guide
                    </span>
                    <h3 className="font-montserrat font-bold text-2xl lg:text-3xl mb-4 text-white">
                      Meal Prep Mastery: 7 Days in 2 Hours
                    </h3>
                    <p className="text-lg text-gray-200 mb-4">
                      Learn how to prepare a week&apos;s worth of healthy,
                      muscle-building meals in just 2 hours every Sunday.
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-300">
                        <i className="far fa-clock mr-1"></i> 6 min read
                      </span>
                      <span className="text-sm text-gray-300">
                        <i className="fas fa-utensils mr-1"></i> 21 recipes
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>

            {/* Nutrition Tips Sidebar */}
            <div className="space-y-6">
              <Link href="/blogs-detail" className="block">
                <article className="gym-blog-card-gradient rounded-xl p-6 gym-blog-hover-lift transition-all duration-500 group">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src="/images/dry-fruits.png"
                        alt="Protein Guide"
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-xs gym-blog-custom-text-green font-semibold uppercase">
                        Protein
                      </span>
                      <h4 className="font-semibold mb-2 group-hover:gym-blog-custom-text-green transition-colors">
                        Complete Protein Guide
                      </h4>
                      <p className="text-sm text-gray-400">
                        Everything about protein intake for muscle growth.
                      </p>
                    </div>
                  </div>
                </article>
              </Link>

              <Link href="/blogs-detail" className="block">
                <article className="gym-blog-card-gradient rounded-xl p-6 gym-blog-hover-lift transition-all duration-500 group">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src="/images/pure-honey.png"
                        alt="Supplements"
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-xs gym-blog-custom-text-green font-semibold uppercase">
                        Supplements
                      </span>
                      <h4 className="font-semibold mb-2 group-hover:gym-blog-custom-text-green transition-colors">
                        Essential Supplements
                      </h4>
                      <p className="text-sm text-gray-400">
                        Science-backed supplements that actually work.
                      </p>
                    </div>
                  </div>
                </article>
              </Link>

              <Link href="/blogs-detail" className="block">
                <article className="gym-blog-card-gradient rounded-xl p-6 gym-blog-hover-lift transition-all duration-500 group">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src="/images/dry-fruits.png"
                        alt="Hydration"
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-xs gym-blog-custom-text-green font-semibold uppercase">
                        Hydration
                      </span>
                      <h4 className="font-semibold mb-2 group-hover:gym-blog-custom-text-green transition-colors">
                        Optimal Hydration
                      </h4>
                      <p className="text-sm text-gray-400">
                        How much water you really need for performance.
                      </p>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gear Reviews Section */}
      <section className="px-4 sm:px-12 lg:px-32 py-12 sm:py-16 lg:py-20 gym-blog-custom-bg-dark text-white">
        <div className="mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16">
            <div>
              <h2 className="font-montserrat font-bold text-3xl sm:text-4xl uppercase tracking-wide mb-4">
                Gear Reviews
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl">
                Honest reviews of the latest fitness equipment and apparel
              </p>
            </div>
            <a
              href="#"
              className="mt-6 lg:mt-0 gym-blog-glass-effect text-white font-semibold px-6 py-3 rounded-full hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
            >
              All Reviews <i className="fas fa-arrow-right"></i>
            </a>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/blogs-detail" className="block">
              <article className="gym-blog-custom-bg-darker rounded-xl overflow-hidden gym-blog-hover-lift transition-all duration-500 group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src="/images/gym-2.svg"
                    alt="Running Shoes Review"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-gym-blog-custom-bg-green text-black px-2 py-1 rounded font-bold text-sm">
                      8.8/10
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                      Supplements
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-3 group-hover:gym-blog-custom-text-green transition-colors">
                    Optimum Nutrition Gold Standard
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    The gold standard of protein powders tested for taste,
                    mixability, and protein quality.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">$55 • 3 min read</span>
                    <i className="fas fa-star gym-blog-custom-text-green"></i>
                  </div>
                </div>
              </article>
            </Link>

            <Link href="/blogs-detail" className="block">
              <article className="gym-blog-custom-bg-darker rounded-xl overflow-hidden gym-blog-hover-lift transition-all duration-500 group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src="/images/gym-3.svg"
                    alt="Fitness Smartwatch"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-gym-blog-custom-bg-green text-black px-2 py-1 rounded font-bold text-sm">
                      9.5/10
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                      Tech
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-3 group-hover:gym-blog-custom-text-green transition-colors">
                    Garmin Forerunner 955
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Ultimate fitness tracking device with advanced metrics and
                    multi-sport capabilities.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">$499 • 8 min read</span>
                    <i className="fas fa-star gym-blog-custom-text-green"></i>
                  </div>
                </div>
              </article>
            </Link>

            <Link href="/blogs-detail" className="block">
              <article className="gym-blog-custom-bg-darker rounded-xl overflow-hidden gym-blog-hover-lift transition-all duration-500 group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src="/images/gym-4.svg"
                    alt="Fitness Smartwatch"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-gym-blog-custom-bg-green text-black px-2 py-1 rounded font-bold text-sm">
                      9.5/10
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                      Tech
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-3 group-hover:gym-blog-custom-text-green transition-colors">
                    Garmin Forerunner 955
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Ultimate fitness tracking device with advanced metrics and
                    multi-sport capabilities.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">$499 • 8 min read</span>
                    <i className="fas fa-star gym-blog-custom-text-green"></i>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 gym-blog-custom-bg-darker text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="gym-blog-glass-effect rounded-2xl p-8 lg:p-12">
            <h2 className="font-montserrat font-bold text-3xl lg:text-4xl mb-4">
              Join Our Fitness Community
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get weekly workout tips, nutrition guides, and exclusive member
              stories delivered to your inbox
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gym-blog-custom-text-green focus:ring-2 focus:ring-gym-blog-custom-text-green/20"
                required
              />
              <button
                type="submit"
                className="gym-blog-custom-gradient-green text-black font-bold px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300 whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </form>
            <p className="text-sm text-gray-400 mt-4">
              Join 50,000+ fitness enthusiasts. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 gym-blog-custom-bg-dark text-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="font-montserrat font-black text-4xl lg:text-6xl gym-blog-custom-text-green mb-2">
                50K+
              </div>
              <p className="text-gray-400 uppercase tracking-wide text-sm">
                Community Members
              </p>
            </div>
            <div className="text-center">
              <div className="font-montserrat font-black text-4xl lg:text-6xl gym-blog-custom-text-green mb-2">
                500+
              </div>
              <p className="text-gray-400 uppercase tracking-wide text-sm">
                Success Stories
              </p>
            </div>
            <div className="text-center">
              <div className="font-montserrat font-black text-4xl lg:text-6xl gym-blog-custom-text-green mb-2">
                200+
              </div>
              <p className="text-gray-400 uppercase tracking-wide text-sm">
                Workout Programs
              </p>
            </div>
            <div className="text-center">
              <div className="font-montserrat font-black text-4xl lg:text-6xl gym-blog-custom-text-green mb-2">
                1M+
              </div>
              <p className="text-gray-400 uppercase tracking-wide text-sm">
                Lives Transformed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20 gym-blog-custom-bg-dark text-white">
        <div className="mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16">
            <div>
              <h2 className="font-montserrat font-bold text-3xl sm:text-4xl uppercase tracking-wide mb-4">
                Latest Articles
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl">
                Fresh content from our experts and community members
              </p>
            </div>
            <a
              href="#"
              className="mt-6 lg:mt-0 gym-blog-custom-gradient-green text-black font-bold px-6 py-3 rounded-full hover:scale-105 transition-all duration-300  gap-2"
            >
              View All Articles <i className="fas fa-arrow-right"></i>
            </a>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/blogs-detail" className="block">
              <article className="gym-blog-custom-bg-darker rounded-xl overflow-hidden gym-blog-hover-lift transition-all duration-500 group">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src="/images/gym-blog-1.svg"
                    alt="Recovery Tips"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold uppercase">
                      Recovery
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2 group-hover:gym-blog-custom-text-green transition-colors line-clamp-2">
                    5 Recovery Hacks That Actually Work
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    Science-backed recovery strategies to maximize your gains and
                    minimize fatigue.
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>3 min read</span>
                    <span>2 days ago</span>
                  </div>
                </div>
              </article>
            </Link>

            <Link href="/blogs-detail" className="block">
              <article className="gym-blog-custom-bg-darker rounded-xl overflow-hidden gym-blog-hover-lift transition-all duration-500 group">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src="/images/gym-blog-2.svg"
                    alt="Home Gym Setup"
                    width={400}
                    height={160}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold uppercase">
                      Home Gym
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2 group-hover:gym-blog-custom-text-green transition-colors line-clamp-2">
                    Build a Home Gym Under $500
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    Essential equipment for creating an effective home workout
                    space on a budget.
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>5 min read</span>
                    <span>4 days ago</span>
                  </div>
                </div>
              </article>
            </Link>

            <Link href="/blogs-detail" className="block">
              <article className="gym-blog-custom-bg-darker rounded-xl overflow-hidden gym-blog-hover-lift transition-all duration-500 group">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src="/images/gym-blog-3.svg"
                    alt="Mental Health & Fitness"
                    width={400}
                    height={160}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold uppercase">
                      Mental Health
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2 group-hover:gym-blog-custom-text-green transition-colors line-clamp-2">
                    Fitness for Mental Wellness
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    How exercise becomes a powerful tool for managing stress and
                    anxiety.
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>6 min read</span>
                    <span>1 week ago</span>
                  </div>
                </div>
              </article>
            </Link>

            <Link href="/blogs-detail" className="block">
              <article className="gym-blog-custom-bg-darker rounded-xl overflow-hidden gym-blog-hover-lift transition-all duration-500 group">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src="/images/gym-blog-1.svg"
                    alt="Beginner Mistakes"
                    width={400}
                    height={160}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold uppercase">
                      Beginner Tips
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2 group-hover:gym-blog-custom-text-green transition-colors line-clamp-2">
                    10 Gym Mistakes to Avoid
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    Common pitfalls that prevent beginners from reaching their
                    fitness goals.
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>4 min read</span>
                    <span>1 week ago</span>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Blogs;