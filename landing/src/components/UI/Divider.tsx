import React from 'react';
import { Text } from './index';

interface DividerProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'subtle';
  className?: string;
}

const Divider: React.FC<DividerProps> = ({ 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const lineClasses = {
    default: 'bg-gray-700',
    gold: 'bg-yellow-400/50',
    subtle: 'bg-gray-800'
  };

  const textClasses = {
    default: 'text-gray-400',
    gold: 'text-yellow-400',
    subtle: 'text-gray-500'
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className={`flex-1 h-px ${lineClasses[variant]}`}></div>
      <Text variant="small" className={textClasses[variant]}>
        {children}
      </Text>
      <div className={`flex-1 h-px ${lineClasses[variant]}`}></div>
    </div>
  );
};

export default Divider;