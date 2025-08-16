import React from 'react';

const Divider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="divider-container">
      <div className="divider-line"></div>
      <span className="divider-text">{children}</span>
      <div className="divider-line"></div>
    </div>
  );
};

export default Divider;