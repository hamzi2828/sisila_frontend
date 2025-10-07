"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import "@fortawesome/fontawesome-free/css/all.css";

const BlogsDetail = () => {
  return (
    <div className="min-h-screen">
      {/* Main Content Container */}
      <main className="pt-20 gym-blog-detail-custom-bg-dark text-white">
        {/* Hero Section */}
      
<section className="relative py-20 lg:py-32 overflow-hidden">
  <div className="absolute inset-0">
    <Image
      src="/images/hero.svg"
      alt="Push Day Workout"
      fill
      className="object-cover"
      priority
    />
    <div className="gym-blog-detail-hero-overlay absolute inset-0"></div>
  </div>

  {/* Absolute breadcrumb (top-left) */}
  <nav
    aria-label="Breadcrumb"
    className="absolute top-4 left-4 lg:top-6 lg:left-20 z-20 text-sm text-gray-200"
  >
    <Link href="/blogs" className="hover:gym-blog-detail-custom-text-green">
      Blogs
    </Link>
    <span className="mx-2 text-gray-400">/</span>
    <span className="text-white">Ultimate Push Day Workout</span>
  </nav>

  <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-8">
      <span className="gym-blog-detail-custom-bg-green text-black px-4 py-2 rounded-full text-sm font-bold uppercase mb-6 inline-block">
        Workout Guide
      </span>
      <h1 className="font-montserrat font-black text-4xl sm:text-5xl lg:text-7xl uppercase tracking-wide mb-6 gym-blog-detail-text-shadow">
        Ultimate Push Day Workout
      </h1>
      <p className="text-xl lg:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
        Master your chest, shoulders, and triceps with this comprehensive
        push day routine designed for maximum muscle growth and strength
        gains.
      </p>
    </div>

    {/* Article Meta */}
    <div className="flex flex-wrap items-center justify-center gap-6 text-gray-300">
      <div className="flex items-center gap-2">
        <Image
          src="/images/gym-1.svg"
          alt="Mike Johnson"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <span className="font-semibold">Mike Johnson</span>
      </div>
      <div className="flex items-center gap-2">
        <i className="far fa-calendar"></i>
        <span>Dec 15, 2024</span>
      </div>
      <div className="flex items-center gap-2">
        <i className="far fa-clock"></i>
        <span>8 min read</span>
      </div>
      <div className="flex items-center gap-2">
        <i className="far fa-eye"></i>
        <span>12.5k views</span>
      </div>
      <div className="flex items-center gap-2">
        <i className="fas fa-dumbbell"></i>
        <span>Intermediate</span>
      </div>
    </div>
  </div>
</section>

        {/* Main Content */}
        <section className="px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Article Content */}
              <article className="lg:col-span-3">
                <div className="gym-blog-detail-content-section prose prose-lg max-w-none">
                  {/* Quick Overview */}
                  <div className="gym-blog-detail-card-gradient rounded-xl p-8 mb-12">
                    <h2 className="text-2xl font-bold mb-6 gym-blog-detail-custom-text-green">
                      Workout Overview
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full gym-blog-detail-custom-bg-green text-black flex items-center justify-center mx-auto mb-3">
                          <i className="fas fa-clock text-2xl"></i>
                        </div>
                        <h4 className="font-semibold mb-1">Duration</h4>
                        <p className="text-gray-400">45-60 min</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full gym-blog-detail-custom-bg-green text-black flex items-center justify-center mx-auto mb-3">
                          <i className="fas fa-bullseye text-2xl"></i>
                        </div>
                        <h4 className="font-semibold mb-1">Target</h4>
                        <p className="text-gray-400">Push Muscles</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full gym-blog-detail-custom-bg-green text-black flex items-center justify-center mx-auto mb-3">
                          <i className="fas fa-chart-line text-2xl"></i>
                        </div>
                        <h4 className="font-semibold mb-1">Level</h4>
                        <p className="text-gray-400">Intermediate</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full gym-blog-detail-custom-bg-green text-black flex items-center justify-center mx-auto mb-3">
                          <i className="fas fa-fire text-2xl"></i>
                        </div>
                        <h4 className="font-semibold mb-1">Calories</h4>
                        <p className="text-gray-400">400-600</p>
                      </div>
                    </div>
                  </div>

                  <h2 id="what-is-push">What is Push Day Training?</h2>
                  <p>
                    Push day training focuses on all the muscles involved in
                    pushing movements - primarily your chest, shoulders, and
                    triceps. This workout split is incredibly effective because
                    these muscle groups work synergistically, allowing you to
                    train them more intensively while providing adequate recovery
                    time.
                  </p>

                  <p>
                    The beauty of push day training lies in its efficiency. Since
                    you&apos;re working muscles that naturally complement each other,
                    you can achieve maximum muscle activation while minimizing
                    workout time. This approach has been proven effective by
                    countless bodybuilders and fitness enthusiasts worldwide.
                  </p>

                  <h2 id="why-this-works">Why This Workout Works</h2>
                  <p>
                    This particular push day routine combines compound movements
                    with targeted isolation exercises to ensure complete muscle
                    development. We start with heavy compound movements when your
                    energy is highest, then move to isolation work to fully
                    exhaust the target muscles.
                  </p>

                  <ul>
                    <li>Progressive overload principles built into every exercise</li>
                    <li>Perfect balance of compound and isolation movements</li>
                    <li>Optimized rep ranges for muscle growth</li>
                    <li>Strategic exercise order for maximum performance</li>
                    <li>Scalable for different fitness levels</li>
                  </ul>

                  <h2 id="complete-workout">The Complete Push Day Workout</h2>

                  {/* Exercise Cards */}
                  <div className="space-y-6 my-12">
                    {/* Exercise 1 */}
                    <div className="gym-blog-detail-exercise-card gym-blog-detail-card-gradient rounded-xl p-6 transition-all duration-300">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-1/3">
                          <Image
                            src="/images/gym-2.svg"
                            alt="Barbell Bench Press"
                            width={300}
                            height={200}
                            className="w-full h-48 lg:h-32 object-cover rounded-lg"
                          />
                        </div>
                        <div className="lg:w-2/3">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              1
                            </span>
                            <h3 className="text-xl font-bold text-white">
                              Barbell Bench Press
                            </h3>
                          </div>
                          <p className="text-gray-300 mb-4">
                            The king of chest exercises. Focus on controlled
                            movement and full range of motion.
                          </p>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold gym-blog-detail-custom-text-green">
                                4
                              </div>
                              <div className="text-sm text-gray-400">Sets</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold gym-blog-detail-custom-text-green">
                                6-8
                              </div>
                              <div className="text-sm text-gray-400">Reps</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold gym-blog-detail-custom-text-green">
                                3 min
                              </div>
                              <div className="text-sm text-gray-400">Rest</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Exercise 2 */}
                    <div className="gym-blog-detail-exercise-card gym-blog-detail-card-gradient rounded-xl p-6 transition-all duration-300">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-1/3">
                          <Image
                            src="/images/gym-3.svg"
                            alt="Incline Dumbbell Press"
                            width={300}
                            height={200}
                            className="w-full h-48 lg:h-32 object-cover rounded-lg"
                          />
                        </div>
                        <div className="lg:w-2/3">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              2
                            </span>
                            <h3 className="text-xl font-bold text-white">
                              Incline Dumbbell Press
                            </h3>
                          </div>
                          <p className="text-gray-300 mb-4">
                            Target the upper chest with this essential movement.
                            30-45 degree incline works best.
                          </p>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold gym-blog-detail-custom-text-green">
                                4
                              </div>
                              <div className="text-sm text-gray-400">Sets</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold gym-blog-detail-custom-text-green">
                                8-10
                              </div>
                              <div className="text-sm text-gray-400">Reps</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold gym-blog-detail-custom-text-green">
                                2.5 min
                              </div>
                              <div className="text-sm text-gray-400">Rest</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Exercise 3 */}
                    <div className="gym-blog-detail-exercise-card gym-blog-detail-card-gradient rounded-xl p-6 transition-all duration-300">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-1/3">
                          <Image
                            src="/images/gym-4.svg"
                            alt="Overhead Press"
                            width={300}
                            height={200}
                            className="w-full h-48 lg:h-32 object-cover rounded-lg"
                          />
                        </div>
                        <div className="lg:w-2/3">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              3
                            </span>
                            <h3 className="text-xl font-bold text-white">
                              Standing Overhead Press
                            </h3>
                          </div>
                          <p className="text-gray-300 mb-4">
                            Build powerful shoulders and improve core stability
                            with this compound movement.
                          </p>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold gym-blog-detail-custom-text-green">
                                4
                              </div>
                              <div className="text-sm text-gray-400">Sets</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold gym-blog-detail-custom-text-green">
                                6-8
                              </div>
                              <div className="text-sm text-gray-400">Reps</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold gym-blog-detail-custom-text-green">
                                3 min
                              </div>
                              <div className="text-sm text-gray-400">Rest</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Exercise 4 */}
                    <div className="gym-blog-detail-exercise-card gym-blog-detail-card-gradient rounded-xl p-6 transition-all duration-300">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-1/3">
                          <Image
                            src="/images/gym-5.svg"
                            alt="Lateral Raises"
                            width={300}
                            height={200}
                            className="w-full h-48 lg:h-32 object-cover rounded-lg"
                          />
                        </div>
                        <div className="lg:w-2/3">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              4
                            </span>
                            <h3 className="text-xl font-bold text-white">
                              Lateral Raises
                            </h3>
                          </div>
                          <p className="text-gray-300 mb-4">
                            Isolate the medial deltoids for that coveted shoulder
                            width and definition.
                          </p>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold gym-blog-detail-custom-text-green">
                                3
                              </div>
                              <div className="text-sm text-gray-400">Sets</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold gym-blog-detail-custom-text-green">
                                12-15
                              </div>
                              <div className="text-sm text-gray-400">Reps</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold gym-blog-detail-custom-text-green">
                                2 min
                              </div>
                              <div className="text-sm text-gray-400">Rest</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Exercise 5 */}
                    <div className="gym-blog-detail-exercise-card gym-blog-detail-card-gradient rounded-xl p-6 transition-all duration-300">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-1/3">
                          <Image
                            src="/images/gym-6.svg"
                            alt="Close Grip Bench Press"
                            width={300}
                            height={200}
                            className="w-full h-48 lg:h-32 object-cover rounded-lg"
                          />
                        </div>
                        <div className="lg:w-2/3">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              5
                            </span>
                            <h3 className="text-xl font-bold text-white">
                              Close Grip Bench Press
                            </h3>
                          </div>
                          <p className="text-gray-300 mb-4">
                            The ultimate tricep mass builder. Keep elbows close to
                            your body for maximum effectiveness.
                          </p>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold gym-blog-detail-custom-text-green">
                                4
                              </div>
                              <div className="text-sm text-gray-400">Sets</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold gym-blog-detail-custom-text-green">
                                8-10
                              </div>
                              <div className="text-sm text-gray-400">Reps</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold gym-blog-detail-custom-text-green">
                                2.5 min
                              </div>
                              <div className="text-sm text-gray-400">Rest</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Exercise 6 */}
                    <div className="gym-blog-detail-exercise-card gym-blog-detail-card-gradient rounded-xl p-6 transition-all duration-300">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-1/3">
                          <Image
                            src="/images/gym-7.svg"
                            alt="Tricep Dips"
                            width={300}
                            height={200}
                            className="w-full h-48 lg:h-32 object-cover rounded-lg"
                          />
                        </div>
                        <div className="lg:w-2/3">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              6
                            </span>
                            <h3 className="text-xl font-bold text-white">
                              Tricep Dips
                            </h3>
                          </div>
                          <p className="text-gray-300 mb-4">
                            Finish strong with this bodyweight movement. Add
                            weight if bodyweight becomes too easy.
                          </p>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold gym-blog-detail-custom-text-green">
                                3
                              </div>
                              <div className="text-sm text-gray-400">Sets</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold gym-blog-detail-custom-text-green">
                                12-15
                              </div>
                              <div className="text-sm text-gray-400">Reps</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold gym-blog-detail-custom-text-green">
                                90 sec
                              </div>
                              <div className="text-sm text-gray-400">Rest</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 id="progressive-overload">Progressive Overload Strategy</h2>
                  <p>
                    To see continuous progress, you need to gradually increase the
                    demands on your muscles. Here&apos;s how to apply progressive
                    overload to this workout:
                  </p>

                  <h3>Week 1-2: Establish Your Baseline</h3>
                  <p>
                    Focus on perfecting your form and finding the right weights
                    for each rep range. You should be able to complete all sets
                    with 1-2 reps in reserve.
                  </p>

                  <h3>Week 3-4: Increase the Load</h3>
                  <p>
                    Add 2.5-5 lbs to compound movements and 2.5 lbs to isolation
                    exercises. If you can&apos;t complete all reps, that&apos;s normal -
                    work back up to the full rep count.
                  </p>

                  <h3>Week 5-6: Add Volume or Intensity</h3>
                  <p>
                    Either add an extra set to your main lifts or increase the
                    weight again. Listen to your body and prioritize recovery.
                  </p>

                  <h2 id="common-mistakes">Common Mistakes to Avoid</h2>
                  <ul>
                    <li>Ego lifting - prioritize form over heavy weight</li>
                    <li>Neglecting warm-up - always start with 5-10 minutes of light cardio</li>
                    <li>Rushing through reps - control the weight on both concentric and eccentric phases</li>
                    <li>Inconsistent rest periods - stick to the recommended rest times</li>
                    <li>Training push muscles too frequently - allow 48-72 hours between push sessions</li>
                  </ul>

                  <h2 id="nutrition-recovery">Nutrition and Recovery</h2>
                  <p>
                    Your workout is only as good as your recovery. Make sure
                    you&apos;re eating in a slight caloric surplus with adequate
                    protein (0.8-1g per lb of body weight) and getting 7-9 hours
                    of quality sleep.
                  </p>

                  <p>
                    Post-workout nutrition is crucial. Aim to consume a meal with
                    protein and carbohydrates within 2 hours of finishing your
                    workout to optimize muscle protein synthesis and glycogen
                    replenishment.
                  </p>

                  {/* Call to Action */}
                  <div className="gym-blog-detail-card-gradient rounded-xl p-8 my-12 text-center">
                    <h3 className="text-2xl font-bold mb-4">
                      Ready to Transform Your Push Day?
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Download our complete Push Day workout tracker and nutrition
                      guide to maximize your results.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button className="gym-blog-detail-custom-gradient-green text-black font-bold px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300">
                        <i className="fas fa-download mr-2"></i>
                        Download Workout PDF
                      </button>
                      <button className="gym-blog-detail-glass-effect text-white font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300">
                        <i className="fas fa-video mr-2"></i>
                        Watch Video Guide
                      </button>
                    </div>
                  </div>
                </div>

                {/* Back to Blogs */}
                <div className="mt-8">
                  <Link
                    href="/blogs"
                    className="gym-blog-detail-glass-effect inline-flex items-center gap-2 text-white font-semibold px-5 py-3 rounded-lg hover:scale-105 transition-all duration-300"
                  >
                    <i className="fas fa-arrow-left"></i> Back to Blogs
                  </Link>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-8">
                  {/* Author Info */}
                  <div className="gym-blog-detail-card-gradient rounded-xl p-6">
                    <div className="text-center mb-6">
                      <Image
                        src="/images/gym-8.svg"
                        alt="Mike Johnson"
                        width={80}
                        height={80}
                        className="rounded-full object-cover mx-auto mb-4"
                      />
                      <h3 className="font-bold text-xl mb-2">Mike Johnson</h3>
                      <p className="text-gray-400 text-sm mb-4">
                        Certified Personal Trainer & Nutrition Coach
                      </p>
                      <div className="flex justify-center gap-3">
                        <Link
                          href="#"
                          className="text-gray-400 hover:gym-blog-detail-custom-text-green transition-colors"
                        >
                          <i className="fab fa-youtube"></i>
                        </Link>
                        <Link
                          href="#"
                          className="text-gray-400 hover:gym-blog-detail-custom-text-green transition-colors"
                        >
                          <i className="fab fa-twitter"></i>
                        </Link>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Mike has 10+ years of experience helping clients build
                      muscle and strength. Specializes in powerlifting and
                      bodybuilding training methods.
                    </p>
                  </div>

                  {/* Table of Contents */}
                  <div className="gym-blog-detail-card-gradient rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 gym-blog-detail-custom-text-green">
                      Table of Contents
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a
                          href="#what-is-push"
                          className="text-gray-300 hover:gym-blog-detail-custom-text-green transition-colors"
                        >
                          What is Push Day Training?
                        </a>
                      </li>
                      <li>
                        <a
                          href="#why-this-works"
                          className="text-gray-300 hover:gym-blog-detail-custom-text-green transition-colors"
                        >
                          Why This Workout Works
                        </a>
                      </li>
                      <li>
                        <a
                          href="#complete-workout"
                          className="text-gray-300 hover:gym-blog-detail-custom-text-green transition-colors"
                        >
                          The Complete Workout
                        </a>
                      </li>
                      <li>
                        <a
                          href="#progressive-overload"
                          className="text-gray-300 hover:gym-blog-detail-custom-text-green transition-colors"
                        >
                          Progressive Overload Strategy
                        </a>
                      </li>
                      <li>
                        <a
                          href="#common-mistakes"
                          className="text-gray-300 hover:gym-blog-detail-custom-text-green transition-colors"
                        >
                          Common Mistakes
                        </a>
                      </li>
                      <li>
                        <a
                          href="#nutrition-recovery"
                          className="text-gray-300 hover:gym-blog-detail-custom-text-green transition-colors"
                        >
                          Nutrition and Recovery
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Related Articles */}
                  <div className="gym-blog-detail-card-gradient rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 gym-blog-detail-custom-text-green">
                      Related Articles
                    </h3>
                    <div className="space-y-4">
                      <Link href="/blogs-detail" className="group cursor-pointer block">
                        <div className="flex gap-3">
                          <Image
                            src="/images/gym-bdetail1.svg"
                            alt="Pull Day Workout"
                            width={64}
                            height={64}
                            className="rounded-lg object-cover flex-shrink-0"
                          />
                          <div>
                            <h4 className="font-semibold text-sm group-hover:gym-blog-detail-custom-text-green transition-colors">
                              Ultimate Leg Day Guide
                            </h4>
                            <p className="text-gray-400 text-xs mt-1">7 min read</p>
                          </div>
                        </div>
                      </Link>

                      <Link href="/blogs-detail" className="group cursor-pointer block">
                        <div className="flex gap-3">
                          <Image
                            src="/images/gym-bdetail2.svg"
                            alt="Pre Workout Nutrition"
                            width={64}
                            height={64}
                            className="rounded-lg object-cover flex-shrink-0"
                          />
                          <div>
                            <h4 className="font-semibold text-sm group-hover:gym-blog-detail-custom-text-green transition-colors">
                              Pre-Workout Nutrition
                            </h4>
                            <p className="text-gray-400 text-xs mt-1">4 min read</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Share Article */}
                  <div className="gym-blog-detail-card-gradient rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 gym-blog-detail-custom-text-green">
                      Share This Article
                    </h3>
                    <div className="flex gap-3">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm transition-colors">
                        <i className="fab fa-facebook mr-1"></i> Facebook
                      </button>
                      <button className="flex-1 bg-blue-400 hover:bg-blue-500 text-white py-2 px-3 rounded-lg text-sm transition-colors">
                        <i className="fab fa-twitter mr-1"></i> Twitter
                      </button>
                    </div>
                    <div className="mt-3">
                      <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm transition-colors">
                        <i className="fab fa-whatsapp mr-1"></i> WhatsApp
                      </button>
                    </div>
                  </div>

                  {/* Newsletter Signup */}
                  <div className="gym-blog-detail-card-gradient rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 gym-blog-detail-custom-text-green">
                      Get More Workouts
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Subscribe for weekly workout routines and fitness tips.
                    </p>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Your email"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-gym-blog-detail-custom-text-green"
                      />
                      <button className="w-full gym-blog-detail-custom-gradient-green text-black font-semibold py-2 rounded-lg hover:scale-105 transition-all duration-300">
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Comments Section */}
        <section className="py-16 gym-blog-detail-custom-bg-darker">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-montserrat font-bold text-2xl lg:text-3xl mb-8 gym-blog-detail-custom-text-green">
              Comments & Discussion
            </h2>

            {/* Comment Form */}
            <div className="gym-blog-detail-card-gradient rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-lg mb-4">Share Your Experience</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gym-blog-detail-custom-text-green"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gym-blog-detail-custom-text-green"
                  />
                </div>
                <textarea
                  rows={4}
                  placeholder="Share your thoughts about this workout..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gym-blog-detail-custom-text-green resize-none"
                ></textarea>
                <button
                  type="submit"
                  className="gym-blog-detail-custom-gradient-green text-black font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300"
                >
                  Post Comment
                </button>
              </form>
            </div>

            {/* Sample Comments */}
            <div className="space-y-6">
              <div className="gym-blog-detail-card-gradient rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <Image
                    src="/images/gym-bdetail3.svg"
                    alt="Sarah M"
                    width={48}
                    height={48}
                    className="rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">Sarah M.</h4>
                      <span className="text-sm text-gray-400">2 days ago</span>
                    </div>
                    <p className="text-gray-300 mb-3">
                      This workout is incredible! I&apos;ve been following it for 3
                      weeks and already seeing amazing results. The progression
                      tips are especially helpful. Thanks Mike!
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="text-gray-400 hover:gym-blog-detail-custom-text-green transition-colors">
                        <i className="far fa-thumbs-up mr-1"></i> 24
                      </button>
                      <button className="text-gray-400 hover:gym-blog-detail-custom-text-green transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="gym-blog-detail-card-gradient rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <Image
                    src="/images/gym-large.svg"
                    alt="Alex T"
                    width={48}
                    height={48}
                    className="rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">Alex T.</h4>
                      <span className="text-sm text-gray-400">1 week ago</span>
                    </div>
                    <p className="text-gray-300 mb-3">
                      Great detailed breakdown! Question about the close grip
                      bench press - should I go as heavy as regular bench or
                      lighter to focus on form?
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="text-gray-400 hover:gym-blog-detail-custom-text-green transition-colors">
                        <i className="far fa-thumbs-up mr-1"></i> 12
                      </button>
                      <button className="text-gray-400 hover:gym-blog-detail-custom-text-green transition-colors">
                        Reply
                      </button>
                    </div>

                    {/* Reply */}
                    <div className="mt-4 ml-8 p-4 bg-white/5 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Image
                          src="/images/gym-blog-1.svg"
                          alt="Mike Johnson"
                          width={32}
                          height={32}
                          className="rounded-full object-cover flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold text-sm gym-blog-detail-custom-text-green">
                              Mike Johnson
                            </h5>
                            <span className="text-xs text-gray-500">Author</span>
                          </div>
                          <p className="text-gray-300 text-sm">
                            Great question Alex! Start with about 80-85% of your
                            regular bench press weight. Focus on form first, then
                            gradually increase the load. The triceps are smaller
                            muscles, so they&apos;ll fatigue faster.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Load More Comments */}
            <div className="text-center mt-8">
              <button className="gym-blog-detail-glass-effect text-white font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300">
                Load More Comments
              </button>
            </div>
          </div>
        </section>

        {/* Related/More Guides */}
        <section className="py-16 gym-blog-detail-custom-bg-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-montserrat font-bold text-2xl lg:text-3xl mb-12 text-center gym-blog-detail-custom-text-green">
              More Workout Guides
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Available Article */}
              <article className="gym-blog-detail-card-gradient rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-500 group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src="/images/gym-blog-2.svg"
                    alt="Pull Day Guide"
                    width={400}
                    height={192}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="gym-blog-detail-custom-bg-green text-black px-3 py-1 rounded-full text-xs font-bold uppercase">
                      Available
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-3 group-hover:gym-blog-detail-custom-text-green transition-colors">
                    Ultimate Pull Day Workout
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Complete back, biceps, and rear delt routine for building a
                    powerful upper body pull.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">6 min read</span>
                    <Link
                      href="/blogs-detail"
                      className="gym-blog-detail-custom-text-green font-semibold text-sm hover:underline"
                    >
                      Read Now →
                    </Link>
                  </div>
                </div>
              </article>

              {/* Coming Soon Articles */}
              <article className="gym-blog-detail-card-gradient rounded-xl overflow-hidden opacity-75 group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src="/images/gym-blog-3.svg"
                    alt="Leg Day Guide"
                    width={400}
                    height={192}
                    className="w-full h-full object-cover filter grayscale"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-yellow-500 text-black flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-clock text-2xl"></i>
                      </div>
                      <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold uppercase">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-3 text-gray-400">
                    Ultimate Leg Day Workout
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Comprehensive lower body routine for building massive quads,
                    hamstrings, and glutes.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Expected: Jan 2025</span>
                    <span className="text-yellow-500 font-semibold text-sm">
                      Notify Me →
                    </span>
                  </div>
                </div>
              </article>

              <article className="gym-blog-detail-card-gradient rounded-xl overflow-hidden opacity-75 group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src="/images/gym-bdetail2.svg"
                    alt="Full Body Guide"
                    width={400}
                    height={192}
                    className="w-full h-full object-cover filter grayscale"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-yellow-500 text-black flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-clock text-2xl"></i>
                      </div>
                      <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold uppercase">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-3 text-gray-400">
                    Full Body HIIT Workout
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    High-intensity full body routine perfect for fat loss and
                    conditioning.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Expected: Feb 2025</span>
                    <span className="text-yellow-500 font-semibold text-sm">
                      Notify Me →
                    </span>
                  </div>
                </div>
              </article>
            </div>

            {/* Back to Blogs CTA */}
            <div className="text-center mt-10">
              <Link
                href="/blogs"
                className="gym-blog-detail-custom-gradient-green text-black font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
              >
                <i className="fas fa-book-open"></i> Explore All Blogs
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BlogsDetail;