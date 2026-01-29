import { useState, useEffect, useMemo, useRef } from 'react';
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
  ExternalLink,
  Menu,
  X,
  Loader2
} from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import CursorSpotlight from '../components/CursorSpotlight';
import { BlurWords, GlassCard } from '../components/Interactive';
import { motion, AnimatePresence } from 'framer-motion';

// Vite Glob Import - Modern Syntax
const docs = import.meta.glob('../docs/*.md', { query: '?raw', import: 'default' });

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
    id: 'threat-model',
    title: 'Threat Model',
    icon: Shield,
    mdFile: 'threat-model.md',
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState<Array<{ id: string, title: string, content: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isIndexReady, setIsIndexReady] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Build Search Index on Mount
  useEffect(() => {
    const buildIndex = async () => {
      const index = [];
      for (const section of sectionList) {
        const matching = Object.keys(docs).find(k => k.endsWith(section.mdFile));
        if (matching) {
          try {
            const content = await (docs[matching] as () => Promise<string>)();
            index.push({
              id: section.id,
              title: section.title,
              content: content.toLowerCase()
            });
          } catch (e) {
            console.error("Failed to index doc:", section.mdFile);
          }
        }
      }
      setSearchIndex(index);
      setIsIndexReady(true);
    };
    buildIndex();
  }, []);

  // Filter Results
  const searchResults = useMemo(() => {
    if (!searchQuery || !isIndexReady) return [];
    const query = searchQuery.toLowerCase();

    return searchIndex.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.content.includes(query)
    ).map(item => {
      // Calculate relevance or snippet
      const contentMatchIndex = item.content.indexOf(query);
      let snippet = '';
      if (contentMatchIndex > -1) {
        const start = Math.max(0, contentMatchIndex - 30);
        const end = Math.min(item.content.length, contentMatchIndex + 50);
        snippet = '...' + item.content.substring(start, end) + '...';
      }
      return { ...item, snippet };
    }).slice(0, 6); // Limit results
  }, [searchQuery, searchIndex, isIndexReady]);

  // Handle outside click to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  // Load Active Markdown
  useEffect(() => {
    const section = sectionList.find(s => s.id === activeSection);
    if (!section) return;

    const matching = Object.keys(docs).find(k => k.endsWith(section.mdFile));

    if (matching) {
      (docs[matching] as () => Promise<string>)()
        .then(raw => setMarkdown(raw))
        .catch(err => {
          console.error(err);
          setMarkdown("## Error Loading Document\nPlease try again later.");
        });
    } else {
      setMarkdown("## File Not Found");
    }
  }, [activeSection]);


  const section = sectionList.find(s => s.id === activeSection);

  // Custom Markdown renderers for premium styling
  const components = {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 border-b border-white/10 pb-4">{children}</h2>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-xl md:text-2xl font-bold text-yellow-400 mt-8 mb-4 flex items-center">
        {children}
      </h3>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="text-lg font-semibold text-white mt-6 mb-3 flex items-center">
        <ChevronRight className="w-4 h-4 mr-2 text-yellow-500" />
        {children}
      </h4>
    ),
    p: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-gray-300 leading-relaxed mb-4 font-light text-base md:text-lg">{children}</p>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300 ml-4">{children}</ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-300 ml-4">{children}</ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-gray-300">{children}</li>
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '')
      return !inline ? (
        <div className="bg-black/50 border border-white/10 rounded-xl p-4 my-4 overflow-x-auto">
          <code className={className} {...props}>{children}</code>
        </div>
      ) : (
        <code className="bg-white/10 text-yellow-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      )
    },
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <div className="border-l-4 border-yellow-500/50 bg-yellow-500/5 pl-4 py-2 my-4 italic text-gray-400 rounded-r-lg">
        {children}
      </div>
    ),
    a: ({ href, children }: { href?: string, children?: React.ReactNode }) => (
      <a href={href} className="text-yellow-400 hover:text-yellow-300 underline underline-offset-2 decoration-yellow-400/30 hover:decoration-yellow-400 transition-colors">
        {children}
      </a>
    )
  };

  if (!section) return null;

  // Split into blocks at --- and wrap each in border-left group div
  const blocks = splitMarkdownByHR(markdown);

  return (
    <div className="relative z-[1] font-sans text-white min-h-screen selection:bg-yellow-500/30">
      <CursorSpotlight />
      <Navigation />

      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-6">
              <BookOpen className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-gray-300 tracking-wide uppercase">Documentation</span>
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <BlurWords text="Essentialis" className="inline-block mr-3 text-white" />
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Knowledge Base
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 font-light">
            Everything you need to know about using Essentialis to keep your confidential documents safe and accessible.
          </p>

          {/* Search Bar - Working Implementation */}
          <div className="max-w-lg mx-auto relative group z-50" ref={searchContainerRef}>
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 ${searchQuery ? 'opacity-100' : ''}`}></div>
            <div className="relative">
              {isSearching || !isIndexReady ? (
                <Loader2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 w-5 h-5 animate-spin" />
              ) : (
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-yellow-400 transition-colors" />
              )}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search docs..."
                className="w-full pl-12 pr-10 py-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 transition-all text-white placeholder-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-4 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-[400px] overflow-y-auto z-50 ring-1 ring-white/5"
                >
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => {
                            setActiveSection(result.id);
                            setSearchQuery('');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-yellow-400 group-hover:text-yellow-300">{result.title}</span>
                            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-yellow-400 transition-colors" />
                          </div>
                          {result.snippet && (
                            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                              {result.snippet}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <p>No results found for "{searchQuery}"</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <GlassCard className="p-4 border-white/10">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Library</h3>
                <nav className="space-y-1">
                  {sectionList.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => setActiveSection(sec.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${activeSection === sec.id
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <sec.icon className={`w-4 h-4 ${activeSection === sec.id ? 'text-yellow-400' : 'text-gray-500 group-hover:text-white'}`} />
                      <span className="text-sm font-medium">{sec.title}</span>
                      {activeSection === sec.id && <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-yellow-400 ml-auto" />}
                    </button>
                  ))}
                </nav>
              </GlassCard>

              <div className="pt-4 px-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Resources</h4>
                <div className="space-y-2">
                  {quickLinks.map((link) => (
                    <a
                      key={link.title}
                      href={link.href}
                      className="flex items-center justify-between text-sm text-gray-400 hover:text-yellow-400 transition-colors duration-300 group py-1"
                    >
                      <div className="flex items-center gap-2">
                        <link.icon className="w-4 h-4 group-hover:text-yellow-400 transition-colors" />
                        <span>{link.title}</span>
                      </div>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden mb-4">
            <GlassCard className="p-4 flex items-center justify-between" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <span className="font-semibold text-white flex items-center gap-2">
                <Menu className="w-5 h-5 text-yellow-400" />
                {sectionList.find(s => s.id === activeSection)?.title || "Menu"}
              </span>
              <ChevronRight className={`w-5 h-5 transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`} />
            </GlassCard>
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <GlassCard className="mt-2 p-2 border-white/10">
                    {sectionList.map((sec) => (
                      <button
                        key={sec.id}
                        onClick={() => { setActiveSection(sec.id); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left border-b border-white/5 last:border-0 ${activeSection === sec.id
                          ? 'text-yellow-400 bg-yellow-400/5'
                          : 'text-gray-300'
                          }`}
                      >
                        <sec.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{sec.title}</span>
                      </button>
                    ))}
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <GlassCard className="p-8 md:p-12 min-h-[800px] border-white/10 relative overflow-visible">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent opacity-50" />

              <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-white/10">
                <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                  <section.icon className="w-8 h-8 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{section.title}</h2>
                  <p className="text-sm text-gray-500 font-mono mt-1">docs/{section.mdFile}</p>
                </div>
              </div>

              <div className="prose prose-invert prose-yellow max-w-none">
                {blocks.map((block, idx) => (
                  <motion.div
                    key={`${section.id}-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="mb-8"
                  >
                    <ReactMarkdown components={components}>{block.trim()}</ReactMarkdown>
                  </motion.div>
                ))}
              </div>

              {/* Content Navigation */}
              <div className="flex justify-between items-center mt-16 pt-8 border-t border-white/10">
                <div>
                  {sectionList.findIndex(s => s.id === activeSection) > 0 && (
                    <button
                      onClick={() => {
                        setActiveSection(sectionList[sectionList.findIndex(s => s.id === activeSection) - 1].id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="group flex flex-col items-start gap-1"
                    >
                      <span className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1 group-hover:text-yellow-400 transition-colors">
                        <ChevronRight className="w-3 h-3 rotate-180" /> Previous
                      </span>
                      <span className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
                        {sectionList[sectionList.findIndex(s => s.id === activeSection) - 1].title}
                      </span>
                    </button>
                  )}
                </div>
                <div>
                  {sectionList.findIndex(s => s.id === activeSection) < sectionList.length - 1 && (
                    <button
                      onClick={() => {
                        setActiveSection(sectionList[sectionList.findIndex(s => s.id === activeSection) + 1].id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="group flex flex-col items-end gap-1"
                    >
                      <span className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1 group-hover:text-yellow-400 transition-colors">
                        Next <ChevronRight className="w-3 h-3" />
                      </span>
                      <span className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
                        {sectionList[sectionList.findIndex(s => s.id === activeSection) + 1].title}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Documentation;
