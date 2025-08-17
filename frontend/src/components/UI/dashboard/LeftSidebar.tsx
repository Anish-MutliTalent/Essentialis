// src/components/dashboard/LeftSidebar.tsx
import { NavLink } from 'react-router-dom';

const LeftSidebar = () => {
  const navItems = [
    { path: '/dashboard', name: 'Home', exact: true, icon: '🏠' },
    { path: '/dashboard/my-docs', name: 'My Documents', icon: '📄' },
    { path: '/dashboard/settings', name: 'Settings', icon: '⚙️' },
  ];

  const linkClasses = "flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200 group";
  const activeLinkClasses = "bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 text-yellow-400 border border-yellow-400/30";

  return (
    <aside className="w-72 bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50 flex-shrink-0 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8-2a2 2 0 100 4 2 2 0 000-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">
              ESSENTIALIS <span className="text-yellow-400">CLOUD</span>
            </h1>
            <p className="text-xs text-gray-400">Document Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Navigation
          </h2>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }: { isActive: boolean }) =>
                `${linkClasses} ${isActive ? activeLinkClasses : ''}`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Quick Actions
          </h2>
          <NavLink
            to="/dashboard/mint-doc"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-medium hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 transform hover:scale-[1.02]"
          >
            <span className="text-lg">➕</span>
            <span>New Document</span>
          </NavLink>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Secure • Private • Decentralized
          </p>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;