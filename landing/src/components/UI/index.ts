// Core UI Components
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Card, CardHeader, CardContent, CardFooter } from './Card';
export { default as Layout, Container, Section, Grid, Flex } from './Layout';
export { 
  default as Typography,
  Heading, 
  Text, 
  DisplayText, 
  LeadText, 
  CaptionText, 
  GradientText, 
  BalanceText 
} from './Typography';

// Utility Components
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as Divider } from './Divider';

// Import components for UI object
import Button from './Button';
import Input from './Input';
import Card, { CardHeader, CardContent, CardFooter } from './Card';
import Layout, { Container, Section, Grid, Flex } from './Layout';
import Typography, { Heading, Text, DisplayText, LeadText, CaptionText, GradientText, BalanceText } from './Typography';
import LoadingSpinner from './LoadingSpinner';
import Divider from './Divider';

// Re-export all components as a single object for convenience
export const UI = {
  Button,
  Input,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Layout,
  Container,
  Section,
  Grid,
  Flex,
  Typography,
  Heading,
  Text,
  DisplayText,
  LeadText,
  CaptionText,
  GradientText,
  BalanceText,
  LoadingSpinner,
  Divider
};
