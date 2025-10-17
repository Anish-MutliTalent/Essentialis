// src/components/dashboard/LeftSidebar.tsx
import { NavLink } from 'react-router-dom';
import { Heading, Text } from '../index';
import { useEffect, useState } from 'react';

const LeftSidebar = () => {
  const navItems = [
    { path: '/dashboard', name: 'Home', exact: true },
    { path: '/dashboard/my-docs', name: 'My Docs' },
    { path: '/dashboard/settings', name: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-gray-900/50 border-r border-gray-800 p-6 flex-shrink-0 flex flex-col space-y-4 overflow-y-auto backdrop-blur-subtle">
       {/* Logo/Title */}
       <div className="text-center">
        <a href="https://essentialis.cloud" >
            <span className="text-2xl font-bold gradient-gold-text">
              <img 
                src="/essentialis.svg" 
                alt="Logo" 
                style={{ height: '12rem', width: '12rem', transition: 'all 1s ease-in-out' }}
                className="rounded-full group-hover:scale-105"
              />
            </span>
          </a>
       </div>
       
       <hr className="border-gray-700 my-4"/>
       
       {/* Navigation Links */}
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.exact}
          className={({ isActive }: { isActive: boolean }) =>
            `block px-4 py-3 rounded-lg transition-all-smooth ${
              isActive 
                ? 'bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 shadow-gold' 
                : 'text-gray-300 hover:bg-yellow-400/5 hover:text-yellow-400 hover:border hover:border-yellow-400/20'
            }`
          }
        >
          {item.name}
        </NavLink>
      ))}
      
      {/* Additional sidebar elements can be added here */}
      <div className="mt-auto pt-6 border-t border-gray-700">
        <Text variant="small" color="muted" className="text-center">
          Essentialis v1.0
        </Text>
      </div>
    </aside>
  );
};

export default LeftSidebar;