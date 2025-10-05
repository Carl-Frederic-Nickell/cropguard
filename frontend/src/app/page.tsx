'use client'

import { ArrowRight, Cloud, MapPin, TrendingUp, Tractor, Sprout, BarChart3, Shield } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
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
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-500 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">Next.js 15</div>
              <p className="text-gray-600">App Router & SSR</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-500 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">TypeScript</div>
              <p className="text-gray-600">Type Safety</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-500 text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">Tailwind</div>
              <p className="text-gray-600">Modern Styling</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-500 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">PostgreSQL</div>
              <p className="text-gray-600">Neon Serverless</p>
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
            <p>Made with ❤️ for farmers and developers • Carl Frederic Nickell</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
