# Essentialis Design System

A professional design system built with Tailwind CSS, featuring consistent components, beautiful animations, and a cohesive visual language.

## 🎨 Design Tokens

### Colors
- **Primary**: Gold gradient (`#d4af37` to `#b8941f`)
- **Neutral**: Professional gray scale (50-950)
- **Background**: Black (`#000000`)
- **Text**: White (`#ffffff`)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Display Text**: Large, bold headings with custom sizing
- **Body Text**: Optimized for readability with proper line heights

### Spacing
- **Base Unit**: 4px (0.25rem)
- **Custom Spacing**: 18, 88, 128, 144 (rem values)

### Animations
- **Timing**: Smooth cubic-bezier curves
- **Variants**: fadeIn, fadeInUp, slideInLeft, slideInRight, scaleIn, shimmer, pulse-gold, float

## 🧩 Core Components

### Button
Professional button component with multiple variants and states.

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" loading>
  Click Me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `disabled`: boolean

### Input
Form input component with validation states and helper text.

```tsx
import { Input } from '@/components/ui';

<Input 
  label="Email" 
  placeholder="Enter email"
  error="Invalid email"
  helperText="We'll never share your email"
/>
```

**Props:**
- `variant`: 'default' | 'professional'
- `size`: 'sm' | 'md' | 'lg'
- `label`: string
- `error`: string
- `helperText`: string

### Card
Container component with multiple visual variants.

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui';

<Card variant="premium">
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Props:**
- `variant`: 'default' | 'professional' | 'premium'
- `hover`: boolean
- `onClick`: function

### Layout
Layout components for consistent page structure.

```tsx
import { Layout, Container, Section, Grid, Flex } from '@/components/ui';

<Layout>
  <Container maxWidth="7xl">
    <Section padding="lg" background="dark">
      <Grid cols={3}>
        <div>Content 1</div>
        <div>Content 2</div>
        <div>Content 3</div>
      </Grid>
    </Section>
  </Container>
</Layout>
```

**Components:**
- `Layout`: Main wrapper
- `Container`: Width-constrained container
- `Section`: Section with padding and background options
- `Grid`: Responsive grid layout
- `Flex`: Flexible layout container

### Typography
Text components with consistent styling and variants.

```tsx
import { 
  Heading, 
  Text, 
  DisplayText, 
  LeadText,
  GradientText 
} from '@/components/ui';

<DisplayText gradient>Hero Title</DisplayText>
<LeadText color="muted">Subtitle text</LeadText>
<Text variant="body">Body content</Text>
<GradientText>Gradient text</GradientText>
```

**Components:**
- `Heading`: Semantic headings (h1-h6)
- `Text`: Body text with variants
- `DisplayText`: Large display headings
- `LeadText`: Lead paragraph text
- `GradientText`: Gold gradient text

## 🎯 Utility Classes

### Gradients
```css
.gradient-gold          /* Gold gradient background */
.gradient-gold-text     /* Gold gradient text */
.gradient-gold-subtle   /* Subtle gold gradient */
```

### Shadows
```css
.shadow-professional    /* Professional shadow */
.shadow-professional-md /* Medium professional shadow */
.shadow-gold           /* Gold-tinted shadow */
.shadow-gold-lg        /* Large gold shadow */
```

### Animations
```css
.animate-fadeIn         /* Fade in animation */
.animate-fadeInUp       /* Fade in from bottom */
.animate-slideInLeft    /* Slide in from left */
.animate-pulse-gold     /* Gold pulse animation */
.animate-float          /* Floating animation */
```

### Backdrop Effects
```css
.backdrop-blur-professional  /* Professional backdrop blur */
.backdrop-blur-subtle       /* Subtle backdrop blur */
```

### Transitions
```css
.transition-all-smooth       /* Smooth all transitions */
.transition-colors-smooth    /* Smooth color transitions */
.transition-transform-smooth /* Smooth transform transitions */
```

## 🚀 Getting Started

### 1. Import Components
```tsx
// Import individual components
import { Button, Input, Card } from '@/components/ui';

// Or import all components
import { UI } from '@/components/ui';
const { Button, Input, Card } = UI;
```

### 2. Use Design System Classes
```tsx
// Apply utility classes directly
<div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 transition-all-smooth">
  Content
</div>

// Use component classes
<button className="btn-primary">Button</button>
<input className="input-professional" />
<div className="card-professional">Card</div>
```

### 3. Customize with Tailwind
```tsx
// Extend with additional Tailwind classes
<Button className="w-full md:w-auto">
  Responsive Button
</Button>

<Card className="max-w-md mx-auto">
  Centered Card
</Card>
```

## 📱 Responsive Design

The design system is built with mobile-first responsive design:

- **Mobile**: Single column layouts, smaller text sizes
- **Tablet**: Two-column grids, medium text sizes  
- **Desktop**: Multi-column grids, full text sizes
- **Large**: Extended layouts with maximum content width

## 🎨 Customization

### Extending the Theme
Add custom values to `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'custom-blue': '#3B82F6',
      },
      animation: {
        'custom-bounce': 'custom-bounce 1s infinite',
      }
    }
  }
}
```

### Component Variants
Create new component variants by extending the existing ones:

```tsx
const CustomButton = ({ variant = 'custom', ...props }) => {
  const variants = {
    ...defaultVariants,
    custom: 'bg-custom-blue text-white hover:bg-custom-blue-dark'
  };
  
  return <Button variant={variant} {...props} />;
};
```

## 🔧 Development

### Adding New Components
1. Create component file in `src/components/ui/`
2. Export from `index.ts`
3. Add to the `UI` object
4. Update this README

### Testing Components
Use the `DesignSystemDemo` component to visualize and test all components:

```tsx
import DesignSystemDemo from '@/components/ui/DesignSystemDemo';

// Add to your app for testing
<DesignSystemDemo />
```

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Inter Font](https://fonts.google.com/specimen/Inter)
- [Design System Best Practices](https://www.designsystems.com/)

## 🤝 Contributing

When contributing to the design system:

1. Maintain consistency with existing patterns
2. Use the established design tokens
3. Ensure responsive behavior
4. Add proper TypeScript types
5. Update documentation
6. Test across different screen sizes

---

Built with ❤️ by the Essentialis team
