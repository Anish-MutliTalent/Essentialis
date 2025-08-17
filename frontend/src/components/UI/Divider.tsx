import React from 'react';

const Divider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
      <span className="text-sm text-gray-400 font-medium px-3">{children}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
    </div>
  );
};

export default Divider;