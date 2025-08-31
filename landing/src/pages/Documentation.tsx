import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { 
  BookOpen, 
  Shield, 
  Upload, 
  Download, 
  Settings, 
  Users, 
  Lock, 
  Key,
  FileText,
  Search,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpen,
      content: {
        title: 'Getting Started with Essentials',
        description: 'Learn how to set up your account and start storing your confidential documents securely.',
        items: [
          {
            title: 'Create Your Account',
            content: 'Sign up for Essentialis Cloud with your email address. We use industry-standard encryption to protect your login credentials.'
          },
          {
            title: 'Verify Your Identity',
            content: 'Complete the verification process to ensure the security of your account. This includes email verification and optional two-factor authentication.'
          },
          {
            title: 'Upload Your First Document',
            content: 'Start by uploading a test document to familiarize yourself with our secure upload process and encryption features.'
          }
        ]
      }
    },
    {
      id: 'security',
      title: 'Security Features',
      icon: Shield,
      content: {
        title: 'Advanced Security Features',
        description: 'Understand the security measures that protect your confidential documents.',
        items: [
          {
            title: 'End-to-End Encryption',
            content: 'All documents are encrypted using AES-256 encryption before leaving your device. Only you have the keys to decrypt your files.'
          },
          {
            title: 'Zero-Knowledge Architecture',
            content: 'We cannot access your documents or encryption keys. Even our support team cannot view your confidential files.'
          },
          {
            title: 'Secure Sharing',
            content: 'Share documents securely with time-limited access links and password protection.'
          }
        ]
      }
    },
    {
      id: 'uploading',
      title: 'Uploading Documents',
      icon: Upload,
      content: {
        title: 'How to Upload Documents',
        description: 'Step-by-step guide to securely uploading your confidential documents.',
        items: [
          {
            title: 'Supported File Types',
            content: 'Upload PDFs, images (JPG, PNG), documents (DOC, DOCX), spreadsheets (XLS, XLSX), and more. Maximum file size is 100MB per document.'
          },
          {
            title: 'Drag and Drop',
            content: 'Simply drag files from your computer into the upload area, or click to browse and select files manually.'
          },
          {
            title: 'Organize with Tags',
            content: 'Add tags and categories to your documents for easy organization and quick retrieval.'
          }
        ]
      }
    },
    {
      id: 'downloading',
      title: 'Accessing Documents',
      icon: Download,
      content: {
        title: 'Accessing Your Documents',
        description: 'Learn how to view, download, and manage your stored documents.',
        items: [
          {
            title: 'View Online',
            content: 'Preview most document types directly in your browser without downloading, maintaining security through encrypted viewing.'
          },
          {
            title: 'Download Securely',
            content: 'Download documents to your device with automatic decryption. Files are decrypted locally on your device.'
          },
          {
            title: 'Search and Filter',
            content: 'Use our powerful search functionality to quickly find documents by name, tags, or content.'
          }
        ]
      }
    },
    {
      id: 'account',
      title: 'Account Settings',
      icon: Settings,
      content: {
        title: 'Managing Your Account',
        description: 'Configure your account settings and security preferences.',
        items: [
          {
            title: 'Profile Settings',
            content: 'Update your personal information, change your password, and manage notification preferences.'
          },
          {
            title: 'Two-Factor Authentication',
            content: 'Enable 2FA for an additional layer of security. We support authenticator apps and SMS verification.'
          },
          {
            title: 'Storage Management',
            content: 'Monitor your storage usage and upgrade your plan as needed. View detailed storage analytics.'
          }
        ]
      }
    },
    {
      id: 'sharing',
      title: 'Sharing & Collaboration',
      icon: Users,
      content: {
        title: 'Secure Sharing',
        description: 'Share documents safely while maintaining control over access.',
        items: [
          {
            title: 'Generate Secure Links',
            content: 'Create time-limited, password-protected links to share specific documents with others.'
          },
          {
            title: 'Access Control',
            content: 'Set view-only or download permissions, and revoke access at any time.'
          },
          {
            title: 'Audit Trail',
            content: 'Track who accessed your shared documents and when, with detailed activity logs.'
          }
        ]
      }
    }
  ];

  const quickLinks = [
    { title: 'API Documentation', icon: FileText, href: '#' },
    { title: 'Security Whitepaper', icon: Lock, href: '#' },
    { title: 'Privacy Policy', icon: Key, href: '#' },
    { title: 'Terms of Service', icon: FileText, href: '#' }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Documentation
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Everything you need to know about using Essentials to keep your confidential documents safe and accessible.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full pl-10 pr-4 py-3 bg-gray-900/30 border border-gray-800 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors duration-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-yellow-400 mb-4">Contents</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-300 ${
                        activeSection === section.id
                          ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                          : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
                      }`}
                    >
                      <section.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  ))}
                </nav>

                {/* Quick Links */}
                <div className="mt-8 pt-6 border-t border-gray-800">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">Quick Links</h4>
                  <div className="space-y-2">
                    {quickLinks.map((link) => (
                      <a
                        key={link.title}
                        href={link.href}
                        className="flex items-center space-x-2 text-sm text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                      >
                        <link.icon className="w-4 h-4" />
                        <span>{link.title}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {sections.map((section) => (
                activeSection === section.id && (
                  <div key={section.id} className="bg-gray-900/30 border border-gray-800 rounded-xl p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <section.icon className="w-8 h-8 text-yellow-400" />
                      <div>
                        <h2 className="text-3xl font-bold text-white">{section.content.title}</h2>
                        <p className="text-gray-400 mt-2">{section.content.description}</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {section.content.items.map((item, index) => (
                        <div key={index} className="border-l-4 border-yellow-400/30 pl-6">
                          <h3 className="text-xl font-semibold text-yellow-400 mb-3 flex items-center">
                            <ChevronRight className="w-5 h-5 mr-2" />
                            {item.title}
                          </h3>
                          <p className="text-gray-300 leading-relaxed">{item.content}</p>
                        </div>
                      ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-800">
                      <div>
                        {sections.findIndex(s => s.id === activeSection) > 0 && (
                          <button
                            onClick={() => setActiveSection(sections[sections.findIndex(s => s.id === activeSection) - 1].id)}
                            className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors duration-300"
                          >
                            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                            Previous
                          </button>
                        )}
                      </div>
                      <div>
                        {sections.findIndex(s => s.id === activeSection) < sections.length - 1 && (
                          <button
                            onClick={() => setActiveSection(sections[sections.findIndex(s => s.id === activeSection) + 1].id)}
                            className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors duration-300"
                          >
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;