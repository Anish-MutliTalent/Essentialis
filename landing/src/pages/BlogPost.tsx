import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Calendar, User, Tag, ArrowLeft, Share2, BookOpen } from 'lucide-react';
import fm from 'front-matter';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from "react-router-dom";


const mdFiles = import.meta.glob('../blogs/*.md', { as: 'raw' });

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadBlog() {
      if (!slug) {
        setPost(null);
        return;
      }
      const path = Object.keys(mdFiles).find((k) => k.endsWith(`/${slug}.md`));
      if (path) {
        const raw = await mdFiles[path]();
        const parsed = fm<any>(raw) ?? { attributes: {}, body: '' };
        const data = parsed.attributes || {};
        setPost({ ...data, content: parsed.body || '' });
      } else {
        setPost(null);
      }
    }
    loadBlog();
  }, [slug]);

  if (!post) return (
    <div className="min-h-screen bg-black text-white pt-16">
      <Navigation />
      <div className="flex items-center justify-center h-[60vh]">
        <span className="text-xl text-gray-400">Blog post not found.</span>
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

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
          <button
            onClick={() => navigate("/blog")}
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </button>
          </div>
          {/* Article Header */}
          <header className="mb-12">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags && post.tags.map((tag: string) => (
                <span key={tag} className="inline-flex items-center px-3 py-1 text-sm font-medium bg-yellow-400/10 text-yellow-400 rounded-full border border-yellow-400/20">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                {post.title}
              </span>
            </h1>
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                <span>{estimatedReadTime} min read</span>
              </div>
            </div>
            {/* Featured Image */}
            <div className="aspect-video rounded-xl overflow-hidden mb-8">
              <img 
                src={post.featured_image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Share Button */}
            <div className="flex justify-end mb-8">
              <button className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300">
                <Share2 className="w-4 h-4 mr-2" />
                Share Article
              </button>
            </div>
          </header>
          {/* Article Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-400 italic border-l-4 border-yellow-400 pl-6 mb-8">
                {post.excerpt}
              </p>
            )}
            <div className="text-gray-300 leading-relaxed space-y-6">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </article>
          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">About the Author</h3>
                <p className="text-gray-400">
                  The Essentialis Cloud Team consists of security experts, developers, and privacy advocates dedicated to creating the most secure document storage solutions.
                </p>
              </div>
              <div className="flex gap-4">
                <a 
                  href="/blog"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300"
                >
                  More Articles
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;