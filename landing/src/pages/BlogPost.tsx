import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Calendar, User, Tag, ArrowLeft, Share2, BookOpen, Clock, Check } from 'lucide-react';
import fm from 'front-matter';
import ReactMarkdown from 'react-markdown';
import CursorSpotlight from '../components/CursorSpotlight';
import { GlassCard } from '../components/Interactive';
import { motion } from 'framer-motion';

// Modern Vite Import
const mdFiles = import.meta.glob('../blogs/*.md', { query: '?raw', import: 'default' });

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  useEffect(() => {
    async function loadBlog() {
      if (!slug) {
        setLoading(false);
        return;
      }

      // Find the file path that ends with /slug.md
      const path = Object.keys(mdFiles).find((k) => k.endsWith(`/${slug}.md`));

      if (path) {
        try {
          const raw = await (mdFiles[path] as () => Promise<string>)();
          const parsed = fm<any>(raw);
          const data = parsed.attributes || {};
          setPost({
            ...data,
            content: parsed.body || '',
            // Ensure date object is valid
            date: data.date ? new Date(data.date).toISOString() : new Date().toISOString()
          });
        } catch (error) {
          console.error("Failed to load blog post", error);
        }
      }
      setLoading(false);
    }
    loadBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!post) return (
    <div className="min-h-screen bg-black text-white pt-16">
      <Navigation />
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <h2 className="text-3xl font-bold text-yellow-400 mb-4">Post Not Found</h2>
        <p className="text-gray-400 mb-8">The article you are looking for does not exist or has been moved.</p>
        <button onClick={() => navigate('/blog')} className="text-white hover:text-yellow-400 underline">
          Return to Blog
        </button>
      </div>
    </div>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const estimatedReadTime = Math.ceil((post.content?.split(' ').length || 0) / 200);

  // Custom Markdown Components for premium styling
  const components = {
    h1: ({ children }: any) => <h2 className="text-3xl font-bold text-white mt-8 mb-6">{children}</h2>,
    h2: ({ children }: any) => <h3 className="text-2xl font-bold text-yellow-400 mt-8 mb-4">{children}</h3>,
    h3: ({ children }: any) => <h4 className="text-xl font-semibold text-white mt-6 mb-3">{children}</h4>,
    p: ({ children }: any) => <p className="text-gray-300 leading-relaxed mb-6 text-lg font-light">{children}</p>,
    ul: ({ children }: any) => <ul className="list-disc list-inside space-y-2 mb-6 text-gray-300 ml-4">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-300 ml-4">{children}</ol>,
    blockquote: ({ children }: any) => (
      <div className="border-l-4 border-yellow-500/50 bg-white/5 pl-6 py-4 my-8 italic text-gray-300 rounded-r-xl">
        {children}
      </div>
    ),
    code: ({ inline, className, children, ...props }: any) => {
      return !inline ? (
        <div className="bg-black/50 border border-white/10 rounded-xl p-4 my-6 overflow-x-auto shadow-inner">
          <code className={className} {...props}>{children}</code>
        </div>
      ) : (
        <code className="bg-white/10 text-yellow-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>
      )
    },
    img: ({ src, alt }: any) => (
      <img src={src} alt={alt} className="rounded-xl border border-white/10 shadow-2xl my-8 w-full" />
    ),
    a: ({ href, children }: any) => (
      <a href={href} className="text-yellow-400 hover:text-yellow-300 underline underline-offset-4 decoration-yellow-400/30 transition-all">{children}</a>
    )
  };

  return (
    <div className="relative z-[1] font-sans text-white min-h-screen selection:bg-yellow-500/30">
      <CursorSpotlight />
      <Navigation />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate("/blog")}
              className="group inline-flex items-center text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </button>
          </motion.div>

          <GlassCard className="p-0 overflow-hidden border-white/10">

            {/* Feature Image */}
            {post.featured_image && (
              <div className="relative aspect-video w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 opactiy-80" />
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5 }}
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags && post.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 text-xs font-bold bg-yellow-400 text-black rounded-full uppercase tracking-wider shadow-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight shadow-black drop-shadow-lg">
                    {post.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm font-medium">
                    <div className="flex items-center bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <User className="w-4 h-4 mr-2 text-yellow-400" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <Calendar className="w-4 h-4 mr-2 text-yellow-400" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <Clock className="w-4 h-4 mr-2 text-yellow-400" />
                      <span>{estimatedReadTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-8 md:p-12 relative">
              {/* Article Content */}
              <article className="prose prose-lg prose-invert max-w-none">
                {post.excerpt && (
                  <div className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed mb-10 border-b border-white/10 pb-10">
                    {post.excerpt}
                  </div>
                )}
                <ReactMarkdown components={components}>{post.content}</ReactMarkdown>
              </article>

              {/* Social Share & Footer */}
              <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <h4 className="text-yellow-400 font-bold mb-1">Written by {post.author}</h4>
                  <p className="text-sm text-gray-500">Essentialis Editorial Team</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors border border-white/10"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Copied Link!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" /> Share Article
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;