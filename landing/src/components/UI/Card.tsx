import React from 'react';

interface CardProps {
  variant?: 'default' | 'professional' | 'premium';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  variant = 'professional',
  children,
  className = '',
  onClick,
  hover = true
}) => {
  const baseClasses = 'rounded-xl transition-all-smooth';
  
  const variantClasses = {
    default: 'bg-white text-gray-900 border border-gray-200 shadow-sm',
    professional: 'bg-gray-900/30 border border-gray-800',
    premium: 'bg-gray-900/40 border border-gray-700'
  };
  
  const hoverClasses = hover ? 'hover:border-gray-700 hover:bg-gray-900/40' : '';
  const premiumHoverClasses = variant === 'premium' && hover ? 'hover:border-yellow-400/50 hover:shadow-gold' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${premiumHoverClasses} ${clickableClasses} ${className}`;
  
  return (
    <div
      className={classes}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </div>
  );
};

// Card sub-components for better composition
const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`p-4 sm:p-6 pb-0 ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`p-4 sm:p-6 pt-0 ${className}`}>
    {children}
  </div>
);

export { Card, CardHeader, CardContent, CardFooter };
export default Card;
