import React from 'react';
import { 
  Button, 
  Input, 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  Container,
  Section,
  Grid,
  Flex,
  Heading,
  Text,
  DisplayText,
  LeadText,
  CaptionText,
  GradientText,
  BalanceText
} from './index';

const DesignSystemDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white py-8">
      <Container>
        {/* Hero Section */}
        <Section padding="xl" className="text-center">
          <DisplayText gradient className="mb-6">
            Essentialis Design System
          </DisplayText>
          <LeadText color="muted" className="max-w-3xl mx-auto">
            A professional design system built with Tailwind CSS, featuring consistent components, 
            beautiful animations, and a cohesive visual language.
          </LeadText>
        </Section>

        {/* Typography Section */}
        <Section padding="lg">
          <Heading level={2} className="mb-8 text-center">Typography</Heading>
          <Grid cols={2} className="gap-8">
            <Card variant="professional">
              <CardHeader>
                <Heading level={3}>Display Text</Heading>
              </CardHeader>
              <CardContent>
                <DisplayText gradient>Display Heading</DisplayText>
                <Heading level={2} variant="display">Display Subheading</Heading>
                <Heading level={3} variant="display">Display Title</Heading>
              </CardContent>
            </Card>

            <Card variant="professional">
              <CardHeader>
                <Heading level={3}>Text Variants</Heading>
              </CardHeader>
              <CardContent className="space-y-4">
                <LeadText>This is lead text for important content.</LeadText>
                <Text>This is regular body text with good readability.</Text>
                <Text variant="small">This is smaller text for secondary information.</Text>
                <CaptionText>This is caption text for metadata.</CaptionText>
              </CardContent>
            </Card>
          </Grid>
        </Section>

        {/* Buttons Section */}
        <Section padding="lg">
          <Heading level={2} className="mb-8 text-center">Buttons</Heading>
          <Card variant="professional">
            <CardContent>
              <Flex direction="col" className="space-y-6">
                <div>
                  <Heading level={4} className="mb-4">Button Variants</Heading>
                  <Flex className="gap-4 flex-wrap">
                    <Button variant="primary">Primary Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                  </Flex>
                </div>

                <div>
                  <Heading level={4} className="mb-4">Button Sizes</Heading>
                  <Flex className="gap-4 items-center flex-wrap">
                    <Button variant="primary" size="sm">Small</Button>
                    <Button variant="primary" size="md">Medium</Button>
                    <Button variant="primary" size="lg">Large</Button>
                  </Flex>
                </div>

                <div>
                  <Heading level={4} className="mb-4">Button States</Heading>
                  <Flex className="gap-4 flex-wrap">
                    <Button variant="primary" loading>Loading</Button>
                    <Button variant="primary" disabled>Disabled</Button>
                  </Flex>
                </div>
              </Flex>
            </CardContent>
          </Card>
        </Section>

        {/* Forms Section */}
        <Section padding="lg">
          <Heading level={2} className="mb-8 text-center">Form Elements</Heading>
          <Grid cols={2} className="gap-8">
            <Card variant="professional">
              <CardHeader>
                <Heading level={3}>Input Fields</Heading>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  label="Email Address" 
                  placeholder="Enter your email"
                  helperText="We'll never share your email with anyone else."
                />
                <Input 
                  label="Password" 
                  type="password" 
                  placeholder="Enter your password"
                  error="Password must be at least 8 characters"
                />
                <Input 
                  label="Username" 
                  placeholder="Choose a username"
                  size="lg"
                />
              </CardContent>
            </Card>

            <Card variant="professional">
              <CardHeader>
                <Heading level={3}>Input Variants</Heading>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  label="Default Input" 
                  variant="default"
                  placeholder="Light theme input"
                />
                <Input 
                  label="Professional Input" 
                  variant="professional"
                  placeholder="Dark theme input"
                />
              </CardContent>
            </Card>
          </Grid>
        </Section>

        {/* Cards Section */}
        <Section padding="lg">
          <Heading level={2} className="mb-8 text-center">Cards</Heading>
          <Grid cols={3} className="gap-6">
            <Card variant="default" className="text-gray-900">
              <CardHeader>
                <Heading level={4}>Default Card</Heading>
              </CardHeader>
              <CardContent>
                <Text color="default" className="text-gray-600">
                  This is a light theme card with subtle borders and shadows.
                </Text>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm">Action</Button>
              </CardFooter>
            </Card>

            <Card variant="professional">
              <CardHeader>
                <Heading level={4}>Professional Card</Heading>
              </CardHeader>
              <CardContent>
                <Text color="muted">
                  This is a professional dark theme card with hover effects.
                </Text>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm">Action</Button>
              </CardFooter>
            </Card>

            <Card variant="premium">
              <CardHeader>
                <Heading level={4}>Premium Card</Heading>
              </CardHeader>
              <CardContent>
                <Text color="muted">
                  This is a premium card with enhanced hover effects and gold accents.
                </Text>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm">Action</Button>
              </CardFooter>
            </Card>
          </Grid>
        </Section>

        {/* Layout Section */}
        <Section padding="lg">
          <Heading level={2} className="mb-8 text-center">Layout Components</Heading>
          <Card variant="professional">
            <CardContent>
              <Flex direction="col" className="space-y-6">
                <div>
                  <Heading level={4} className="mb-4">Grid Layout</Heading>
                  <Grid cols={4} className="gap-4">
                    {[1, 2, 3, 4].map((num) => (
                      <div key={num} className="bg-gray-800 p-4 rounded-lg text-center">
                        Grid Item {num}
                      </div>
                    ))}
                  </Grid>
                </div>

                <div>
                  <Heading level={4} className="mb-4">Flex Layout</Heading>
                  <Flex justify="between" align="center" className="bg-gray-800 p-4 rounded-lg">
                    <span>Left Content</span>
                    <span>Center Content</span>
                    <span>Right Content</span>
                  </Flex>
                </div>
              </Flex>
            </CardContent>
          </Card>
        </Section>

        {/* Utilities Section */}
        <Section padding="lg">
          <Heading level={2} className="mb-8 text-center">Utility Classes</Heading>
          <Grid cols={2} className="gap-8">
            <Card variant="professional">
              <CardHeader>
                <Heading level={3}>Gradients & Shadows</Heading>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="gradient-gold p-4 rounded-lg text-black font-semibold text-center">
                  Gold Gradient Background
                </div>
                <div className="shadow-gold p-4 rounded-lg bg-gray-800 text-center">
                  Gold Shadow Effect
                </div>
                <div className="shadow-professional-lg p-4 rounded-lg bg-gray-800 text-center">
                  Professional Shadow
                </div>
              </CardContent>
            </Card>

            <Card variant="professional">
              <CardHeader>
                <Heading level={3}>Animations & Effects</Heading>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="animate-pulse-gold p-4 rounded-lg bg-yellow-400/20 text-center">
                  Pulse Animation
                </div>
                <div className="animate-float p-4 rounded-lg bg-gray-800 text-center">
                  Float Animation
                </div>
                <div className="backdrop-blur-professional p-4 rounded-lg bg-gray-800/50 text-center">
                  Backdrop Blur
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Section>

        {/* Footer */}
        <Section padding="lg" className="text-center">
          <Text color="muted">
            Built with ❤️ using the Essentialis Design System
          </Text>
          <div className="mt-4">
            <GradientText className="text-lg font-semibold">
              Ready to build something amazing?
            </GradientText>
          </div>
        </Section>
      </Container>
    </div>
  );
};

export default DesignSystemDemo;
