import React, { memo } from 'react';
import { ArrowRight, Lock, Shield, Smartphone, Zap, Globe, Star, CheckCircle, Users, FileText, Clock } from 'lucide-react';

const Homepage = memo(() => {
  return (
    <div className="bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 pt-40">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          {/* Status Badge */}
          <div className="inline-flex items-center space-x-2 bg-gray-900/40 border border-gray-800 rounded-full px-6 py-3 mb-12">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-300">Now Available • Enterprise-Grade Security</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-12 leading-tight">
            <span className="block text-white mb-4 font-light">Your Confidential Documents</span>
            <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent font-black">
              Safe Forever
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed font-light">
            Store your most important documents with bank-level security. No passwords, no worries. 
            Your confidential files stay private and accessible only to you, forever.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-10 py-4 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 text-lg">
              Start Storing Safely
            </button>
            
            <a href="/docs" className="border border-gray-700 text-white font-semibold px-10 py-4 rounded-lg hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300 text-lg inline-flex items-center justify-center space-x-2">
              <span>See How It Works</span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-yellow-400" />
              <span className="font-medium">Bank-level security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-yellow-400" />
              <span className="font-medium">Access anywhere</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-yellow-400" />
              <span className="font-medium">Always available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-24">
            <h2 className="text-4xl sm:text-5xl font-bold mb-8">
              Made for{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Everyone
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
              Simple yet powerful features designed for anyone who values their privacy and security.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: 'Instant Access',
                description: 'Get your documents instantly from anywhere in the world, whenever you need them.'
              },
              {
                icon: Shield,
                title: 'Bank-Level Security',
                description: 'Your documents are encrypted so securely that even we cannot see them. Only you have access.'
              },
              {
                icon: Globe,
                title: 'Access Anywhere',
                description: 'Your documents follow you everywhere - phone, computer, tablet. Always available when needed.'
              },
              {
                icon: Smartphone,
                title: 'Works Everywhere',
                description: 'Simple apps for your phone and computer that work together seamlessly.'
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 hover:border-gray-700 hover:bg-gray-900/40 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mb-8">
                  <feature.icon className="w-7 h-7 text-black" />
                </div>
                
                <h3 className="text-xl font-semibold mb-6 text-white">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6 lg:px-8 bg-gray-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16 text-center">
            {[
              { number: '50TB+', label: 'Documents Protected', icon: FileText },
              { number: '99.9%', label: 'Uptime', icon: Shield },
              { number: '24/7', label: 'Always Available', icon: Clock },
            ].map((stat, index) => (
              <div key={index} className="space-y-4">
                <stat.icon className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-900/40 border border-gray-700 rounded-xl p-16">
            <h2 className="text-4xl font-bold mb-8">
              Ready to protect your{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                confidential documents?
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Join thousands of people who trust Essentials with their most confidential documents.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-10 py-4 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 text-lg inline-flex items-center justify-center space-x-2">
                <span>Start Protecting Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button className="border border-gray-700 text-white font-semibold px-10 py-4 rounded-lg hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300 text-lg">
                See How It Works
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

Homepage.displayName = 'Homepage';

export default Homepage;