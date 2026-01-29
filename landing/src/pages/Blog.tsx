import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import CursorSpotlight from '../components/CursorSpotlight';
import { BlurWords, GlassCard, MagneticButton } from '../components/Interactive';
import { Calendar, User, Tag, ArrowRight, Rss } from 'lucide-react';
import fm from 'front-matter';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Modern Vite Import for Markdown
const mdFiles = import.meta.glob('../blogs/*.md', { query: '?raw', import: 'default' });

type BlogData = {
  slug: string;
  date?: string;
  title?: string;
  excerpt: string;
  featured_image?: string;
  author?: string;
  tags?: string[];
};

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogData[]>([]);

  useEffect(() => {
    async function loadBlogs() {
      const loaded: (BlogData | null)[] = await Promise.all(
        Object.entries(mdFiles).map(async ([path, getter]) => {
          // Extract slug from filename
          const slug = path.split('/').pop()?.replace('.md', '') ?? '';

          try {
            // Execute the import function to get raw content
            const raw = await (getter as () => Promise<string>)();

            // Parse front-matter
            const parsed = fm<any>(raw);
            const data = parsed.attributes || {};
            const content = parsed.body || '';

            return {
              slug,
              date: data.date || new Date().toISOString(),
              title: data.title || 'Untitled Post',
              excerpt: data.excerpt || (content.slice(0, 160) + '...'),
              featured_image: data.featured_image || 'https://images.unsplash.com/photo-1639322537228-ad71c4295843?q=80&w=2832&auto=format&fit=crop', // Fallback premium abstract image
              author: data.author || 'Essentials Team',
              tags: Array.isArray(data.tags) ? data.tags : [],
            };
          } catch (e) {
            console.error(`Error loading blog ${slug}:`, e);
            return null;
          }
        })
      );

      // Filter out failures and sort by date
      const validBlogs = loaded.filter(Boolean) as BlogData[];
      validBlogs.sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime());

      setBlogs(validBlogs);
    }
    loadBlogs();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return !isNaN(date.getTime())
      ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : '';
  };

  return (
    <div className="relative z-[1] font-sans text-white min-h-screen selection:bg-yellow-500/30">
      <CursorSpotlight />
      <Navigation />

      <div className="pt-48 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        {/* Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-8"
          >
            <Rss className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-300 tracking-wide uppercase">Insights & Updates</span>
          </motion.div>

          <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">
            <BlurWords text="The Essentialis" className="inline-block mr-3 text-white" />
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Chronicles
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Stay updated with the latest insights on document security, privacy rights, and digital sovereignty.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post, index) => (
            <GlassCard
              key={post.slug}
              className="group flex flex-col h-full border-white/10 hover:border-yellow-400/30 transition-all duration-300 p-0 overflow-hidden"
              delay={index * 0.1}
            >
              {/* Image */}
              <div className="aspect-video relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                  {post.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-yellow-400 text-black rounded-full shadow-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow relative z-20 -mt-12">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 bg-black/50 backdrop-blur-md w-fit px-3 py-1.5 rounded-full border border-white/10">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3 h-3 text-yellow-500" />
                    <span>{post.author}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-600" />
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-yellow-500" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors line-clamp-2 leading-tight">
                  <Link to={`/blog/${post.slug}`} className="before:absolute before:inset-0">
                    {post.title}
                  </Link>
                </h2>

                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6 font-light">
                  {post.excerpt}
                </p>

                <div className="mt-auto flex items-center text-yellow-400 font-semibold text-sm group-hover:gap-2 transition-all">
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-4 rounded-full bg-white/5 mb-4 animate-pulse">
              <Rss className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-400">Loading articles...</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Blog;