'use client'

import { ArrowRight, Cloud, MapPin, TrendingUp, Tractor, Sprout, BarChart3, Shield, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'

export default function LandingPage() {
  const [expandedTech, setExpandedTech] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  const toggleTech = (tech: string) => {
    setExpandedTech(expandedTech === tech ? null : tech)
  }

  const screenshots = [
    { src: '/screenshots/Dashboard_crop.png', alt: 'Dashboard Crop View', title: 'Crop Dashboard' },
    { src: '/screenshots/Cropmap_top.png', alt: 'Interactive Crop Map', title: 'Interactive Map' },
    { src: '/screenshots/Crop_overview.png', alt: 'Crop Overview', title: 'Crop Management' },
    { src: '/screenshots/Weather_analytics.png', alt: 'Weather Analytics', title: 'Weather Analytics' },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length)
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-700">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>

        <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
              <Tractor className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">CropGuard</span>
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-white hover:text-green-100 font-medium transition"
            >
              View Dashboard
            </Link>
          </div>
        </nav>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Smart Harvest Management
            <span className="block text-green-200 mt-2 text-4xl md:text-5xl lg:text-6xl">Made Simple</span>
          </h1>

          <p className="text-xl md:text-2xl text-green-50 mb-8 max-w-3xl mx-auto">
            Data-driven agricultural decisions with real-time weather integration and intelligent risk analysis
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Open Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="https://github.com/Carl-Frederic-Nickell/cropguard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-400 transition border-2 border-green-400"
            >
              View on GitHub
            </a>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-green-50">
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-green-200" />
              <span>Real-time Weather</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-200" />
              <span>Interactive Maps</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-200" />
              <span>Risk Analysis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600">Comprehensive farm management in one modern dashboard</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-500">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Weather Integration</h3>
              <p className="text-gray-600">
                Real-time weather data and 7-day forecasts with agricultural-specific analysis and field work suitability indicators
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-500">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Mapping</h3>
              <p className="text-gray-600">
                Leaflet-powered interactive map with color-coded risk indicators and detailed farm information popups
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-500">
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Risk Analysis</h3>
              <p className="text-gray-600">
                Crop-specific temperature and humidity requirements with multi-factor risk scoring and harvest timing optimization
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-500">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Tractor className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Farm Management</h3>
              <p className="text-gray-600">
                Complete CRUD operations for farms and crops with real-time conditions and harvest countdown tracking
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-500">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">8 Crop Types</h3>
              <p className="text-gray-600">
                Support for Wheat, Barley, Corn, Rapeseed, Sunflowers, Potatoes, Sugar Beets, and Tomatoes with specific algorithms
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-500">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Visualization</h3>
              <p className="text-gray-600">
                Beautiful charts and graphs for weather trends, harvest analysis, and farm performance metrics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built with Modern Tech</h2>
            <p className="text-xl text-gray-600">Production-ready stack optimized for performance and scalability</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Next.js */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-500 overflow-hidden">
              <button
                onClick={() => toggleTech('nextjs')}
                className="w-full p-6 text-center cursor-pointer"
              >
                <div className="flex justify-center mb-3">
                  <svg className="w-16 h-16" viewBox="0 0 180 180" fill="none">
                    <mask id="mask0_408_139" style={{maskType: 'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
                      <circle cx="90" cy="90" r="90" fill="black"/>
                    </mask>
                    <g mask="url(#mask0_408_139)">
                      <circle cx="90" cy="90" r="90" fill="black"/>
                      <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_408_139)"/>
                      <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear_408_139)"/>
                    </g>
                    <defs>
                      <linearGradient id="paint0_linear_408_139" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white"/>
                        <stop offset="1" stopColor="white" stopOpacity="0"/>
                      </linearGradient>
                      <linearGradient id="paint1_linear_408_139" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white"/>
                        <stop offset="1" stopColor="white" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">Next.js 15</div>
                <p className="text-gray-600 text-sm mb-2">App Router & SSR</p>
                <ChevronDown className={`w-5 h-5 mx-auto text-green-600 transition-transform ${expandedTech === 'nextjs' ? 'rotate-180' : ''}`} />
              </button>
              {expandedTech === 'nextjs' && (
                <div className="px-6 pb-6 text-sm text-gray-600 border-t pt-4">
                  <strong className="text-green-600">Why Next.js?</strong>
                  <p className="mt-2">Perfect for SEO with server-side rendering, automatic code splitting for optimal performance, and built-in API routes eliminating the need for a separate backend server.</p>
                </div>
              )}
            </div>

            {/* TypeScript */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-500 overflow-hidden">
              <button
                onClick={() => toggleTech('typescript')}
                className="w-full p-6 text-center cursor-pointer"
              >
                <div className="flex justify-center mb-3">
                  <svg className="w-16 h-16" viewBox="0 0 128 128" fill="none">
                    <rect width="128" height="128" rx="6" fill="#3178C6"/>
                    <path d="M22.67 47h33.27v11.62h-11.15v38.13h-10.97v-38.13h-11.15v-11.62zm43.15 0h11.36v49.75h-11.36v-49.75zm13.54 0h11.04l8.74 13.32 8.74-13.32h11.04l-14.19 21.58 14.96 28.17h-11.5l-9.49-18.35-9.49 18.35h-11.5l14.96-28.17-13.31-21.58z" fill="white"/>
                  </svg>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-2">TypeScript</div>
                <p className="text-gray-600 text-sm mb-2">Type Safety</p>
                <ChevronDown className={`w-5 h-5 mx-auto text-green-600 transition-transform ${expandedTech === 'typescript' ? 'rotate-180' : ''}`} />
              </button>
              {expandedTech === 'typescript' && (
                <div className="px-6 pb-6 text-sm text-gray-600 border-t pt-4">
                  <strong className="text-green-600">Why TypeScript?</strong>
                  <p className="mt-2">Catches bugs at compile time, provides excellent IDE support with autocomplete, and makes refactoring safer. Essential for maintaining code quality in complex applications.</p>
                </div>
              )}
            </div>

            {/* Tailwind CSS */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-500 overflow-hidden">
              <button
                onClick={() => toggleTech('tailwind')}
                className="w-full p-6 text-center cursor-pointer"
              >
                <div className="flex justify-center mb-3">
                  <svg className="w-16 h-16" viewBox="0 0 128 128" fill="none">
                    <path d="M64.004 25.602c-17.067 0-27.73 8.53-32 25.597 6.398-8.531 13.867-11.73 22.398-9.597 4.871 1.214 8.352 4.746 12.207 8.66C72.883 56.629 80.145 64 96.004 64c17.066 0 27.73-8.531 32-25.602-6.399 8.536-13.867 11.735-22.399 9.602-4.87-1.215-8.347-4.746-12.207-8.66-6.27-6.367-13.53-13.738-29.394-13.738zM32.004 64c-17.066 0-27.73 8.531-32 25.602C6.402 81.066 13.87 77.867 22.402 80c4.871 1.215 8.352 4.746 12.207 8.66 6.274 6.367 13.536 13.738 29.395 13.738 17.066 0 27.73-8.53 32-25.597-6.399 8.531-13.867 11.73-22.399 9.597-4.87-1.214-8.347-4.746-12.207-8.66C55.128 71.371 47.868 64 32.004 64zm0 0" fill="#38bdf8"/>
                  </svg>
                </div>
                <div className="text-2xl font-bold text-cyan-500 mb-2">Tailwind CSS</div>
                <p className="text-gray-600 text-sm mb-2">Modern Styling</p>
                <ChevronDown className={`w-5 h-5 mx-auto text-green-600 transition-transform ${expandedTech === 'tailwind' ? 'rotate-180' : ''}`} />
              </button>
              {expandedTech === 'tailwind' && (
                <div className="px-6 pb-6 text-sm text-gray-600 border-t pt-4">
                  <strong className="text-green-600">Why Tailwind CSS?</strong>
                  <p className="mt-2">Rapid UI development with utility-first approach, consistent design system, and tiny production builds. Perfect for creating responsive, modern interfaces quickly.</p>
                </div>
              )}
            </div>

            {/* PostgreSQL */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-500 overflow-hidden">
              <button
                onClick={() => toggleTech('postgresql')}
                className="w-full p-6 text-center cursor-pointer"
              >
                <div className="flex justify-center mb-3">
                  <svg className="w-16 h-16" viewBox="0 0 128 128" fill="none">
                    <path d="M105.121 75.188c-4.121 0-7.684 1.938-11.168 4.27l-.086.063c-2.465 1.707-5.012 3.473-8.012 3.473-1.637 0-3.227-.633-5.012-1.344-2.117-.84-4.535-1.793-7.516-1.793-5.094 0-9.316 2.988-13.398 5.867l-.133.094c-3.227 2.258-6.562 4.594-10.84 4.594-2.625 0-5.094-.859-7.516-1.703-2.496-.867-5.078-1.762-7.953-1.762-2.293 0-4.348.484-6.355.953-1.855.437-3.605.848-5.477.848-3.262 0-5.996-.844-8.691-1.672-2.871-.875-5.566-1.7-9.051-1.7V64.922c5.27 0 9.262 2.063 13.09 4.043 3.398 1.754 6.613 3.41 10.672 3.41 2.25 0 4.34-.484 6.371-.953 1.918-.445 3.727-.867 5.652-.867 4.301 0 7.688 1.676 10.938 3.277 2.934 1.442 5.703 2.805 9.035 2.805 5.059 0 9.266-2.996 13.332-5.879l.149-.105c3.227-2.254 6.559-4.586 10.828-4.586 1.609 0 3.215.629 5.008 1.34 2.113.836 4.524 1.785 7.484 1.785 4.668 0 7.754-2.566 11.234-5.426l.152-.125c2.629-2.156 5.594-4.598 9.668-4.598v12.883c-1.938 0-3.848.863-5.754 1.723-2.371.996-4.824 2.02-7.535 2.02z" fill="#336791"/>
                    <path d="M106.668 61.586c-1.941 0-3.566-.809-5.184-1.617-2.359-1.168-4.801-2.371-8.121-2.371-5.078 0-9.305 2.988-13.387 5.863l-.133.094c-3.227 2.25-6.555 4.582-10.824 4.582-2.629 0-5.098-.855-7.52-1.695-2.492-.871-5.074-1.766-7.949-1.766-2.297 0-4.352.488-6.363.953-1.848.437-3.598.848-5.469.848-3.266 0-6-.844-8.695-1.676-2.871-.871-5.563-1.695-9.047-1.695V47.656c5.27 0 9.262 2.059 13.09 4.043 3.398 1.75 6.613 3.406 10.672 3.406 2.25 0 4.34-.484 6.367-.953 1.922-.445 3.73-.863 5.656-.863 4.301 0 7.688 1.672 10.938 3.277 2.93 1.438 5.703 2.797 9.035 2.797 5.059 0 9.266-2.992 13.332-5.875l.145-.105c3.23-2.25 6.563-4.586 10.828-4.586 1.613 0 3.219.629 5.012 1.344 2.113.832 4.52 1.781 7.48 1.781 4.672 0 7.758-2.566 11.234-5.43l.156-.125c2.625-2.16 5.59-4.598 9.664-4.598v12.887c-1.938 0-3.848.859-5.75 1.719-2.371 1-4.824 2.023-7.539 2.023zm0 0" fill="#336791"/>
                  </svg>
                </div>
                <div className="text-2xl font-bold text-indigo-600 mb-2">PostgreSQL</div>
                <p className="text-gray-600 text-sm mb-2">Neon Serverless</p>
                <ChevronDown className={`w-5 h-5 mx-auto text-green-600 transition-transform ${expandedTech === 'postgresql' ? 'rotate-180' : ''}`} />
              </button>
              {expandedTech === 'postgresql' && (
                <div className="px-6 pb-6 text-sm text-gray-600 border-t pt-4">
                  <strong className="text-green-600">Why PostgreSQL with Neon?</strong>
                  <p className="mt-2">Robust relational database with excellent data integrity. Neon&apos;s serverless platform offers automatic scaling, branching for development, and zero-downtime migrations.</p>
                </div>
              )}
            </div>
          </div>

          {/* Screenshots Carousel */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">See It In Action</h2>
              <p className="text-lg text-gray-600">Explore the dashboard features through live screenshots</p>
            </div>

            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100 p-4">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={screenshots[currentSlide].src}
                  alt={screenshots[currentSlide].alt}
                  fill
                  className="object-contain"
                  priority={currentSlide === 0}
                />
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>

              {/* Title */}
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-gray-900">{screenshots[currentSlide].title}</h3>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-4">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide ? 'bg-green-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-500 p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Production Deployment</h3>
                <p className="text-gray-600 mb-4">
                  Deployed on Vercel with edge network for global low-latency access. Serverless architecture with automatic scaling and 99.9% uptime.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Vercel Edge</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Serverless</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Auto-scaling</span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">HTTPS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Optimize Your Harvest?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Start making data-driven agricultural decisions today
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Open Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Tractor className="h-6 w-6 text-green-500" />
                <span className="text-xl font-bold text-white">CropGuard</span>
              </div>
              <p className="text-sm">
                Smart harvest management with real-time weather integration and intelligent risk analysis.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/dashboard" className="hover:text-green-400 transition">Dashboard</Link></li>
                <li><Link href="/dashboard/farms" className="hover:text-green-400 transition">Farm Management</Link></li>
                <li><Link href="/dashboard/crops" className="hover:text-green-400 transition">Crop Management</Link></li>
                <li><Link href="/dashboard/weather" className="hover:text-green-400 transition">Weather</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Project</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://github.com/Carl-Frederic-Nickell/cropguard" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a href="https://cropguarddashboardcfn.vercel.app/dashboard" className="hover:text-green-400 transition">
                    Live Demo
                  </a>
                </li>
                <li className="text-xs pt-4 text-gray-500">
                  Built with Next.js, TypeScript, and Tailwind CSS
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>Made with 🌱 for farmers and developers • Carl Frederic Nickell</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
