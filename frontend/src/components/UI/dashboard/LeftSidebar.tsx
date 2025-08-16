// src/components/dashboard/LeftSidebar.tsx
import { NavLink } from 'react-router-dom'; // Use NavLink for active styling

const LeftSidebar = () => {
  const navItems = [
    { path: '/dashboard', name: 'Home', exact: true }, // `index` route
    { path: '/dashboard/my-docs', name: 'My Docs' },
    { path: '/dashboard/settings', name: 'Settings' },
    // Add more navigation links here
  ];

  // Define styles for active/inactive links using NavLink's className prop
  const linkClasses = "block px-4 py-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150";
  const activeLinkClasses = "bg-gray-700 text-white font-semibold"; // Style for the active link

  return (
    <aside className="w-64 bg-black p-4 flex-shrink-0 flex flex-col space-y-2 overflow-y-auto">
       {/* Optional Logo/Title */}
       <div className="text-center py-4">
            <span className="text-xl font-bold text-white">Essentialis Cloud</span>
       </div>
       <hr className="border-gray-700 my-2"/>
       {/* Navigation Links */}
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          // `end` prop ensures exact match for index route '/' or '/dashboard'
          end={item.exact}
          className={({ isActive }: { isActive: boolean }) =>
            `${linkClasses} ${isActive ? activeLinkClasses : ''}`
          }
        >
          {item.name}
        </NavLink>
      ))}
      {/* You can add other sidebar elements like logout button, etc. */}
    </aside>
  );
};

export default LeftSidebar;