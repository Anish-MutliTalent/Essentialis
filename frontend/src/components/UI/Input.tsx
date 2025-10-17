import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'professional';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  variant = 'professional',
  size = 'md',
  className = '',
  id,
  ...props
}) => {
  const baseClasses = 'w-full border rounded-lg transition-all-smooth focus:outline-none focus:ring-1 focus:ring-yellow-400 placeholder-gray-400';
  
  const variantClasses = {
    default: 'bg-white text-gray-900 border-gray-300 focus:border-yellow-400',
    professional: 'bg-gray-900/30 text-white border-gray-800 focus:border-yellow-400'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };
  
  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${errorClasses} ${className}`;
  
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={classes}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
