import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import ReactMarkdown from 'react-markdown';
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

const docs = import.meta.glob('../docs/*.md', { as: 'raw' });

const sectionList = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpen,
    mdFile: 'getting-started.md',
  },
  {
    id: 'security',
    title: 'Security Features',
    icon: Shield,
    mdFile: 'security.md',
  },
  {
    id: 'uploading',
    title: 'Uploading Documents',
    icon: Upload,
    mdFile: 'uploading.md',
  },
  {
    id: 'downloading',
    title: 'Accessing Documents',
    icon: Download,
    mdFile: 'downloading.md',
  },
  {
    id: 'account',
    title: 'Account Settings',
    icon: Settings,
    mdFile: 'account.md',
  },
  {
    id: 'sharing',
    title: 'Sharing & Collaboration',
    icon: Users,
    mdFile: 'sharing.md',
  },
  {
    id: 'architecture',
    title: 'System Architecture',
    icon: FileText,
    mdFile: 'architecture.md',
  },
  {
    id: 'development',
    title: 'Development Guide',
    icon: FileText,
    mdFile: 'development.md',
  },
  {
    id: 'code-walkthrough',
    title: 'Code Walkthrough',
    icon: FileText,
    mdFile: 'code-walkthrough.md',
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    icon: FileText,
    mdFile: 'api-reference.md',
  },
  {
    id: 'deployment',
    title: 'Deployment Guide',
    icon: FileText,
    mdFile: 'deployment.md',
  },
];

const quickLinks = [
  { title: 'API Documentation', icon: FileText, href: '#' },
  { title: 'Security Whitepaper', icon: Lock, href: '#' },
  { title: 'Privacy Policy', icon: Key, href: '#' },
  { title: 'Terms of Service', icon: FileText, href: '#' }
];

function splitMarkdownByHR(markdown: string) {
  return markdown.split(/(^|\n)---+(\r?\n|$)/g).filter((block) => {
    return block.trim() !== '' && block.trim() !== '---';
  });
}

const Documentation = () => {
  const [activeSection, setActiveSection] = useState(sectionList[0].id);
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    const section = sectionList.find(s => s.id === activeSection);
    if (!section) return;
  
    const matching = Object.keys(docs).find(k => k.endsWith(section.mdFile));
  
    if (matching) {
      docs[matching]().then(raw => setMarkdown(raw));
    } else {
      setMarkdown("## File Not Found");
    }
  }, [activeSection]);
  

  const section = sectionList.find(s => s.id === activeSection);

  // Custom Markdown renderers for style retention (for titles, etc)
  const components = {
    h1: ({children}: {children?: React.ReactNode}) => (
      <h2 className="text-3xl font-bold text-white mb-2">{children}</h2>
    ),
    h2: ({children}: {children?: React.ReactNode}) => (
      <h3 className="text-xl font-semibold text-yellow-400 mb-3 flex items-center"><ChevronRight className="w-5 h-5 mr-2" />{children}</h3>
    ),
    h3: ({children}: {children?: React.ReactNode}) => (
      <h4 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center"><ChevronRight className="w-5 h-5 mr-2" />{children}</h4>
    ),
    p: ({children}: {children?: React.ReactNode}) => (
      <p className="text-gray-300 leading-relaxed mb-2">{children}</p>
    ),
  };

  if (!section) return null;

  // Split into blocks at --- and wrap each in border-left group div
  const blocks = splitMarkdownByHR(markdown);

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
                disabled
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-yellow-400 mb-4">Contents</h3>
                <nav className="space-y-2">
                  {sectionList.map((section) => (
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
              <div key={section.id} className="bg-gray-900/30 border border-gray-800 rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <section.icon className="w-8 h-8 text-yellow-400" />
                  <div>
                    <h2 className="text-3xl font-bold text-white">{section.title}</h2>
                  </div>
                </div>
                <div className="space-y-8">
                  {blocks.map((block, idx) => (
                    <div key={idx} className="border-l-4 border-yellow-400/30 pl-6">
                      <ReactMarkdown components={components}>{block.trim()}</ReactMarkdown>
                    </div>
                  ))}
                </div>
                {/* Navigation */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-800">
                  <div>
                    {sectionList.findIndex(s => s.id === activeSection) > 0 && (
                      <button
                        onClick={() => setActiveSection(sectionList[sectionList.findIndex(s => s.id === activeSection) - 1].id)}
                        className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors duration-300"
                      >
                        <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                        Previous
                      </button>
                    )}
                  </div>
                  <div>
                    {sectionList.findIndex(s => s.id === activeSection) < sectionList.length - 1 && (
                      <button
                        onClick={() => setActiveSection(sectionList[sectionList.findIndex(s => s.id === activeSection) + 1].id)}
                        className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors duration-300"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
