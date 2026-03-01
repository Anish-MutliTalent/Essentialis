// src/components/dashboard/LeftSidebar.tsx
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Home, FileText, Settings, X, PlusCircle, Shield, Share2 } from 'lucide-react';
import { Button } from '../index';
import { useDashboardContext } from '../../../pages/DashboardPage';

interface LeftSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const LeftSidebar = ({ isOpen = true, onClose }: LeftSidebarProps) => {
  const location = useLocation();
  const { profile } = useDashboardContext();
  console.log("LeftSidebar: Profile from context:", profile);
  const hideMobileCTA = /\/mint-doc|\/settings|\/edit/.test(location.pathname);
  const navItems = [
    { path: '/dashboard', name: 'Home', exact: true, icon: Home },
    { path: '/dashboard/my-docs', name: 'My Docs', icon: FileText },
    { path: '/dashboard/refer', name: 'Refer', icon: Share2 },
    { path: '/dashboard/settings', name: 'Settings', icon: Settings },
  ];

  if (profile?.is_admin) {
    navItems.push({ path: '/dashboard/admin', name: 'Admin', exact: true, icon: Shield });
  }

  // Assuming backend returns is_admin in profile (we updated DashboardPage context type earlier? No, we didn't update the type definition in DashboardPage.tsx yet, only the backend. But profile comes from /api/user/details which returns is_admin? Wait, /api/auth/status does. Let's check where profile comes from. It comes from DashboardPage context.)


  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static top-0 left-0 h-full z-50 lg:z-auto
        w-80 lg:w-64 
        bg-gray-900/95 lg:bg-gray-900/50 
        border-r border-gray-800 
        p-4 lg:p-6 
        flex-shrink-0 flex flex-col space-y-4 overflow-y-auto backdrop-blur-subtle
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-yellow-400 transition-colors-smooth"
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Logo/Title */}
        <div className="text-center">
          <a href="https://essentialis.cloud" className="block">
            <span className="text-2xl font-bold gradient-gold-text">
              <img
                src="/essentialis.svg"
                alt="Logo"
                className="w-16 h-16 lg:w-48 lg:h-48 mx-auto rounded-full group-hover:scale-105 transition-all-smooth"
              />
            </span>
          </a>
        </div>

        <hr className="border-gray-700 my-4" />

        {/* Desktop CTA - Mint New Document (visible on lg and up) */}
        <div className="hidden lg:block">
          <Link to="/dashboard/mint-doc">
            <Button
              variant="secondary"
              size="md"
              className="w-full mb-4 flex items-center justify-center gap-2 text-yellow-400 bg-yellow-400/5 hover:bg-yellow-400/10 border border-yellow-400/20"
            >
              <PlusCircle className="w-5 h-5" />
              <span>New Document</span>
            </Button>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={onClose}
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-all-smooth text-left ${isActive
                    ? 'bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 shadow-gold'
                    : 'text-gray-300 hover:bg-yellow-400/5 hover:text-yellow-400 hover:border hover:border-yellow-400/20'
                  }`
                }
              >
                <IconComponent className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Additional sidebar elements can be added here */}
        <div className="mt-auto pt-6 border-t border-gray-700">
          <p className="text-center text-sm text-gray-400">
            Essentialis v1.0
          </p>
        </div>
      </aside>

      {/* Mobile & tablet floating CTA (fixed bottom-right) */}
      {!hideMobileCTA && (
        <div className="lg:hidden">
          <Link to="/dashboard/mint-doc" aria-label="Mint new document">
            <Button
              variant="primary"
              size="md"
              className="fixed bottom-6 right-6 z-50 
                        h-14 w-14 p-0 rounded-full flex items-center justify-center 
                        shadow-lg sm:h-16 sm:w-16 md:h-18 md:w-18"
              title="Mint New Document"
            >
              {/* Icon scales with screen size */}
              <PlusCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default LeftSidebar;