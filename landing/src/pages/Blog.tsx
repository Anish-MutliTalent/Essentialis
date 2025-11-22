import * as React from 'react'; // force import for JSX/React hook
import Navigation from '../components/Navigation';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';
import fm from 'front-matter';

// Vite: Import all markdowns as raw strings
type BlogData = {
  slug: string;
  date?: string;
  title?: string;
  excerpt: string;
  featured_image?: string;
  author?: string;
  tags?: string[];
};
const mdFiles = import.meta.glob('../blogs/*.md', { as: 'raw' });

const Blog = () => {
  const [blogs, setBlogs] = React.useState<BlogData[]>([]);

  React.useEffect(() => {
    async function loadBlogs() {
      const loaded: BlogData[] = await Promise.all(
        Object.entries(mdFiles).map(async ([path, getter]) => {
          const slug = path.split('/').pop()?.replace('.md', '') ?? '';
          const raw = await getter();
          const parsed = fm<any>(raw) ?? { attributes: {}, body: '' };
          const data = parsed.attributes || {};
          const content = parsed.body || '';
          return {
            slug,
            date: data.date || '',
            title: data.title || '',
            excerpt: data.excerpt || (typeof content === 'string' ? content.slice(0, 160) + '…' : ''),
            featured_image: data.featured_image || '',
            author: data.author || '',
            tags: Array.isArray(data.tags) ? data.tags : [],
          };
        })
      );
      loaded.sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime());
      setBlogs(loaded);
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
    <div className="min-h-screen bg-black text-white pt-16">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Our Blog
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Stay updated with the latest insights on document security, privacy, and digital organization.
            </p>
          </div>
          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post) => (
              <article key={post.slug} className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden hover:border-yellow-400/50 transition-all duration-300 group">
                {/* Featured Image */}
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.featured_image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {/* Content */}
                <div className="p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Array.isArray(post.tags) && post.tags.map((tag: string) => (
                      <span key={tag} className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-400/10 text-yellow-400 rounded-full border border-yellow-400/20">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* Title */}
                  <h2 className="text-xl font-bold mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                    <a href={`/blog/${post.slug}`}>
                      {post.title}
                    </a>
                  </h2>
                  {/* Excerpt */}
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(post.date)}
                      </div>
                    </div>
                  </div>
                  <a 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-yellow-400 hover:text-yellow-300 font-medium transition-all duration-300"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </article>
            ))}
          </div>
          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-gold">
              Load More Posts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;