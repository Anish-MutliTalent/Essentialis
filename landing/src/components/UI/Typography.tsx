import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

interface HeadingProps extends TypographyProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: 'default' | 'display';
  gradient?: boolean;
}

interface TextProps extends TypographyProps {
  variant?: 'body' | 'lead' | 'small' | 'caption';
  color?: 'default' | 'muted' | 'gold' | 'white';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
}

// Heading component with multiple levels and variants
const Heading: React.FC<HeadingProps> = ({ 
  children, 
  level = 1, 
  variant = 'default',
  gradient = false,
  className = '' 
}) => {
  const baseClasses = 'font-bold tracking-tight';
  
  const levelClasses = {
    1: variant === 'display' ? 'text-display-2xl' : 'text-4xl md:text-5xl lg:text-6xl',
    2: variant === 'display' ? 'text-display-xl' : 'text-3xl md:text-4xl lg:text-5xl',
    3: variant === 'display' ? 'text-display-lg' : 'text-2xl md:text-3xl lg:text-4xl',
    4: variant === 'display' ? 'text-display-md' : 'text-xl md:text-2xl lg:text-3xl',
    5: variant === 'display' ? 'text-display-sm' : 'text-lg md:text-xl lg:text-2xl',
    6: 'text-base md:text-lg lg:text-xl'
  };
  
  const gradientClasses = gradient ? 'gradient-gold-text' : '';
  const classes = `${baseClasses} ${levelClasses[level]} ${gradientClasses} ${className}`;
  
  const Component = `h${level}` as keyof React.JSX.IntrinsicElements;
  
  return (
    <Component className={classes}>
      {children}
    </Component>
  );
};

// Text component with different variants and colors
const Text: React.FC<TextProps> = ({ 
  children, 
  variant = 'body',
  color = 'default',
  weight = 'normal',
  align = 'left',
  className = '' 
}) => {
  const baseClasses = 'leading-relaxed';
  
  const variantClasses = {
    body: 'text-base',
    lead: 'text-lg md:text-xl',
    small: 'text-sm',
    caption: 'text-xs'
  };
  
  const colorClasses = {
    default: 'text-white',
    muted: 'text-gray-400',
    gold: 'text-yellow-400',
    white: 'text-white'
  };
  
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${colorClasses[color]} ${weightClasses[weight]} ${alignClasses[align]} ${className}`;
  
  return (
    <p className={classes}>
      {children}
    </p>
  );
};

// Specialized text components
const DisplayText: React.FC<{ children: React.ReactNode; className?: string; gradient?: boolean }> = ({ 
  children, 
  className = '',
  gradient = true
}) => (
  <Heading level={1} variant="display" gradient={gradient} className={className}>
    {children}
  </Heading>
);

const LeadText: React.FC<{ children: React.ReactNode; className?: string; color?: 'default' | 'muted' | 'gold' }> = ({ 
  children, 
  className = '',
  color = 'muted'
}) => (
  <Text variant="lead" color={color} className={className}>
    {children}
  </Text>
);

const CaptionText: React.FC<{ children: React.ReactNode; className?: string; color?: 'default' | 'muted' }> = ({ 
  children, 
  className = '',
  color = 'muted'
}) => (
  <Text variant="caption" color={color} className={className}>
    {children}
  </Text>
);

// Utility components
const GradientText: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <span className={`gradient-gold-text ${className}`}>
    {children}
  </span>
);

const BalanceText: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <span className={`text-balance ${className}`}>
    {children}
  </span>
);

// Main Typography component that provides access to all text components
const Typography: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={className}>
    {children}
  </div>
);

export { 
  Heading, 
  Text, 
  DisplayText, 
  LeadText, 
  CaptionText, 
  GradientText, 
  BalanceText 
};
export default Typography;
