import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl';
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'dark' | 'grid';
}

// Main Layout wrapper
const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => (
  <div className={`min-h-screen bg-black text-white ${className}`}>
    {children}
  </div>
);

// Container with max-width constraints
const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = '', 
  maxWidth = '7xl' 
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl'
  };
  
  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  );
};

// Section with consistent padding and backgrounds
const Section: React.FC<SectionProps> = ({ 
  children, 
  className = '', 
  padding = 'lg',
  background = 'transparent'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24'
  };
  
  const backgroundClasses = {
    transparent: '',
    dark: 'bg-gray-900/50',
    grid: 'bg-grid-pattern'
  };
  
  return (
    <section className={`${paddingClasses[padding]} ${backgroundClasses[background]} ${className}`}>
      {children}
    </section>
  );
};

// Grid layout components
const Grid: React.FC<{ children: React.ReactNode; className?: string; cols?: 1 | 2 | 3 | 4 | 6 | 12 }> = ({ 
  children, 
  className = '', 
  cols = 3 
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    12: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'
  };
  
  return (
    <div className={`grid gap-6 ${gridCols[cols]} ${className}`}>
      {children}
    </div>
  );
};

// Flex layout components
const Flex: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  direction?: 'row' | 'col';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  wrap?: boolean;
}> = ({ 
  children, 
  className = '', 
  direction = 'row',
  justify = 'start',
  align = 'start',
  wrap = false
}) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col'
  };
  
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  };
  
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  };
  
  const wrapClasses = wrap ? 'flex-wrap' : 'flex-nowrap';
  
  return (
    <div className={`flex ${directionClasses[direction]} ${justifyClasses[justify]} ${alignClasses[align]} ${wrapClasses} ${className}`}>
      {children}
    </div>
  );
};

export { Layout, Container, Section, Grid, Flex };
export default Layout;
