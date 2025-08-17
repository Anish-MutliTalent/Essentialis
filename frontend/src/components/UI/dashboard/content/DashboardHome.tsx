// src/components/dashboard/content/DashboardHome.tsx
import { useDashboardContext } from '../../../../pages/DashboardPage';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  const { profile } = useDashboardContext();

  const features = [
    {
      icon: '⚡',
      title: 'Instant Access',
      description: 'Get your documents instantly from anywhere in the world, whenever you need them.',
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      icon: '🛡️',
      title: 'Bank-Level Security',
      description: 'Your documents are encrypted so securely that even we cannot see them. Only you have access.',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: '🌐',
      title: 'Access Anywhere',
      description: 'Your documents follow you everywhere - phone, computer, tablet. Always available when needed.',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: '📱',
      title: 'Works Everywhere',
      description: 'Simple apps for your phone and computer that work together seamlessly.',
      color: 'from-purple-400 to-purple-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Made for <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Everyone</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Simple yet powerful features designed for anyone who values their privacy and security.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group"
          >
            <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <span className="text-2xl text-black">{feature.icon}</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
            <p className="text-gray-300 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Welcome back, {profile?.name || 'User'}!
          </h2>
          <p className="text-gray-300">
            Ready to manage your secure documents?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard/mint-doc"
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            <span className="text-xl">➕</span>
            Upload New Document
          </Link>
          <Link
            to="/dashboard/my-docs"
            className="inline-flex items-center justify-center gap-3 bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold py-4 px-8 rounded-xl border border-gray-600 hover:border-gray-500 transition-all duration-200"
          >
            <span className="text-xl">📄</span>
            View My Documents
          </Link>
        </div>
      </div>

      {/* Stats or Recent Activity could go here */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/30 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">0</div>
          <div className="text-gray-300 text-sm">Documents Stored</div>
        </div>
        <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/30 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
          <div className="text-gray-300 text-sm">Security Level</div>
        </div>
        <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/30 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">∞</div>
          <div className="text-gray-300 text-sm">Storage Available</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;