import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Droplets, Activity, Zap, ShieldAlert, Target, Smartphone, BarChart3, ArrowRight } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import Footer from '../components/Footer'

export default function Landing() {
  const { user } = useContext(AuthContext)
  
  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A] text-gray-100 overflow-x-hidden font-sans">
      {/* Navbar overlaying the background */}
      <nav className="absolute top-0 w-full z-50 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Droplets className="h-8 w-8 text-teal-400" />
            <span className="text-xl font-bold tracking-tight text-white">
              AquaMind AI
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#stats" className="hover:text-white transition">Stats</a>
            </div>
            {user ? (
              <Link to="/dashboard" className="px-5 py-2.5 bg-white text-blue-900 hover:bg-gray-100 rounded-lg font-semibold transition-colors shadow-lg">
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition hidden sm:block">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2.5 bg-white text-blue-900 hover:bg-gray-100 rounded-lg font-semibold transition-colors shadow-lg shadow-white/10">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-400 rounded-full blur-[120px] mix-blend-screen transform -translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            Your Water Usage <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
              Simplified
            </span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-gray-400 max-w-2xl mx-auto sm:mx-0 font-light mb-10 leading-relaxed">
            Access real-time analytics, AI-driven recommendations, and premium leak detection — all in one place. Built for a sustainable future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start items-center">
            {user ? (
              <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-bold text-lg transition-colors shadow-xl flex items-center justify-center gap-2">
                Dashboard <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-bold text-lg transition-colors shadow-xl flex items-center justify-center gap-2">
                Start Saving Free <ArrowRight className="h-5 w-5" />
              </Link>
            )}
            <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-[#172033]/80 hover:bg-[#172033] backdrop-blur-sm border border-gray-700 text-white rounded-xl font-semibold text-lg transition-colors flex items-center justify-center">
              Explore Features
            </a>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats" className="py-12 border-y border-gray-800/50 bg-[#0B1121]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-teal-400 mb-2">500k+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Liters Saved</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-blue-500 mb-2">200+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">AI Insights</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-purple-400 mb-2">8</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Modules</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-emerald-400 mb-2">1000+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Active Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="py-24 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to <span className="text-blue-500">Excel</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From real-time monitoring to advanced predictive analytics, AquaMind AI has you covered with curated tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-[#172033] border border-gray-800 hover:border-gray-700 p-8 rounded-2xl transition-all hover:-translate-y-1 group">
              <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="h-8 w-8 text-teal-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Real-time Tracking</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Monitor consumption instantly with precision sensors. Track daily, weekly, and monthly trends effortlessly.
              </p>
            </div>

            <div className="bg-[#172033] border border-gray-800 hover:border-gray-700 p-8 rounded-2xl transition-all hover:-translate-y-1 group">
              <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">AI Recommendations</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Receive smart, actionable tips generated by our AI engine to optimize usage and reduce your footprint.
              </p>
            </div>

            <div className="bg-[#172033] border border-gray-800 hover:border-gray-700 p-8 rounded-2xl transition-all hover:-translate-y-1 group">
              <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldAlert className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Leak Detection</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Catch anomalies and unusual flows instantly before they turn into costly disasters for your home or business.
              </p>
            </div>

            <div className="bg-[#172033] border border-gray-800 hover:border-gray-700 p-8 rounded-2xl transition-all hover:-translate-y-1 group">
              <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Goal Setting</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Set and smash your water-saving targets. Celebrate milestones and earn badges for sustainable habits.
              </p>
            </div>

            <div className="bg-[#172033] border border-gray-800 hover:border-gray-700 p-8 rounded-2xl transition-all hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full"></div>
              <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                <BarChart3 className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white relative z-10">Premium Analytics</h3>
              <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                Unlock high-quality, deep-dive historical reports and predictive billing forecasts at an affordable price.
              </p>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </div>

            <div className="bg-[#172033] border border-gray-800 hover:border-gray-700 p-8 rounded-2xl transition-all hover:-translate-y-1 group">
              <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Mobile Friendly</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Monitor anywhere, anytime. Our responsive platform works perfectly on all devices and screen sizes.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-blue-900 via-indigo-900 to-[#0F172A] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
            Ready to Boost Your Savings?
          </h2>
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
            Join thousands of users already using AquaMind AI to optimize their water usage and build a greener future.
          </p>
          {user ? (
            <Link to="/dashboard" className="inline-block px-8 py-4 bg-white text-blue-900 hover:bg-gray-100 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-xl">
              Return to Dashboard
            </Link>
          ) : (
            <Link to="/register" className="inline-block px-8 py-4 bg-white text-blue-900 hover:bg-gray-100 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-xl">
              Create Free Account
            </Link>
          )}
        </div>
      </div>

      {/* Ensure footer matches theme, forcing a darker theme context if necessary or just letting it inherit */}
      <div className="bg-[#0B1121] border-t border-gray-800/50">
        <Footer />
      </div>
    </div>
  )
}
