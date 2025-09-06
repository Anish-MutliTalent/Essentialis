import React from 'react';
import { Users, Target, Award, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            About{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Essentialis Cloud
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We believe everyone deserves secure, permanent access to their most confidential documents. 
            Essentialis Cloud is a simple, secure storage solution that gives ordinary people the power 
            to protect their important files – without needing to understand complex technology.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-20">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 sm:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-yellow-500">Our Mission</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Everyone deserves secure, permanent access to their most confidential documents. 
                  Too many people lose critical files like certificates, legal documents, and personal records 
                  due to failed services, forgotten passwords, or technical problems.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Essentialis Cloud solves this by giving ordinary people true ownership of their confidential documents 
                  through advanced security and reliable storage – all wrapped in an interface 
                  as simple as your favorite messaging app.
                </p>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-8 border border-yellow-500/30">
                  <div className="flex flex-col gap-4">
                    <a href="/pricing" className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 text-center">
                      View Pricing
                    </a>
                    <a href="/docs" className="border border-yellow-400 text-yellow-400 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400/10 transition-all duration-300 text-center">
                      Learn More
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-yellow-500/30"></div>
            
            {[
              {
                title: 'The Idea',
                date: '2024',
                description: 'Realized that ordinary people needed a simple way to store confidential documents securely. Too many were losing important files due to service problems.',
              },
              {
                title: 'Core Team Formed',
                date: '2024',
                description: 'Founder Lakshmi Pavan Kumaar and co-founder Anish Bhattacharya teamed up to build a solution that combines advanced security with everyday simplicity.',
              },
              {
                title: 'Prototype Development',
                date: '2025',
                description: 'Decided to focus on simplicity. Advanced security technology with everyday app simplicity for common people.',
              },
              {
                title: 'User Testing',
                date: '2025 (By September)',
                description: 'Planning of Extensive testing with everyday users. To show how simple it is to store and access important documents securely.',
              },
            ].map((milestone, index) => (
              <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 hover:border-yellow-500/50 transition-colors">
                    <div className="text-yellow-500 font-semibold mb-2">{milestone.date}</div>
                    <h3 className="text-xl font-bold mb-3">{milestone.title}</h3>
                    <p className="text-gray-400">{milestone.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full border-4 border-black"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Meet the Team</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: 'Lakshmi Pavan Kumaar',
                title: 'Founder & CEO',
                description: '15 year old experienced in React, JavaScript, frontend development, and smart contract development.',
              },
              {
                name: 'Anish Bhattacharya',
                title: 'Founder & CTO',
                description: 'Expert in UI/UX development, Solidity, Web3, frontend and backend development.',
              },
            ].map((member, index) => (
              <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-2">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <div className="text-yellow-500 font-semibold mb-3">{member.title}</div>
                <p className="text-gray-400">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: 'Simplicity First',
                description: 'Advanced security should be invisible to users. The best protection feels effortless.',
              },
              {
                icon: Users,
                title: 'People-Centric',
                description: 'Built for everyday people who need to protect their most important documents.',
              },
              {
                icon: Target,
                title: 'True Ownership',
                description: 'Your confidential data belongs to you alone. No company should have the power to access or lock you out.',
              },
            ].map((value, index) => (
              <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-yellow-500/50 transition-all duration-300">
                <value.icon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
