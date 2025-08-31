import React from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Calendar, User, Tag, ArrowLeft, Share2, BookOpen } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams();

  // Mock blog post data - in a real app, this would be fetched based on the slug
  const blogPost = {
    id: 1,
    title: "The Future of Secure Document Storage",
    slug: "future-secure-document-storage",
    excerpt: "Exploring how blockchain technology and advanced encryption are revolutionizing the way we store and protect our most important documents.",
    content: `
      <h2>Introduction</h2>
      <p>In today's digital age, the security of our personal and professional documents has never been more critical. As we increasingly rely on digital storage solutions, the need for robust, secure, and accessible document storage systems continues to grow.</p>
      
      <h2>The Current Landscape</h2>
      <p>Traditional document storage methods are rapidly becoming obsolete. Cloud storage, while convenient, often lacks the security measures necessary to protect truly sensitive information. This is where next-generation secure storage solutions come into play.</p>
      
      <h2>Blockchain Technology</h2>
      <p>Blockchain technology offers unprecedented security through its decentralized nature and cryptographic protection. By distributing data across multiple nodes and using advanced encryption, blockchain-based storage systems provide a level of security that traditional centralized systems simply cannot match.</p>
      
      <h2>Advanced Encryption</h2>
      <p>Modern encryption algorithms, including AES-256 and RSA encryption, ensure that your documents remain protected even if unauthorized access occurs. These encryption methods are virtually unbreakable with current technology.</p>
      
      <h2>The Future</h2>
      <p>As we look toward the future, we can expect to see even more advanced security measures, including quantum-resistant encryption and AI-powered threat detection. The future of document storage is not just about keeping files safe—it's about creating an ecosystem where privacy and accessibility coexist seamlessly.</p>
      
      <h2>Conclusion</h2>
      <p>The evolution of secure document storage represents a fundamental shift in how we think about digital privacy and security. By embracing these new technologies, we can ensure that our most important documents remain protected for years to come.</p>
    `,
    author: "Essentialis Cloud Team",
    published: true,
    featured_image: "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Security", "Technology", "Future"],
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const estimatedReadTime = Math.ceil(blogPost.content.split(' ').length / 200);

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <a 
              href="/blog"
              className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </a>
          </div>

          {/* Article Header */}
          <header className="mb-12">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {blogPost.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center px-3 py-1 text-sm font-medium bg-yellow-400/10 text-yellow-400 rounded-full border border-yellow-400/20">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                {blogPost.title}
              </span>
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <span>{blogPost.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{formatDate(blogPost.created_at)}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                <span>{estimatedReadTime} min read</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-video rounded-xl overflow-hidden mb-8">
              <img 
                src={blogPost.featured_image} 
                alt={blogPost.title}
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
            <div className="text-gray-300 leading-relaxed space-y-6">
              {/* Excerpt */}
              <p className="text-xl text-gray-400 italic border-l-4 border-yellow-400 pl-6 mb-8">
                {blogPost.excerpt}
              </p>

              {/* Content - In a real app, this would be rendered from markdown or rich text */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-yellow-400 mb-4">Introduction</h2>
                  <p>In today's digital age, the security of our personal and professional documents has never been more critical. As we increasingly rely on digital storage solutions, the need for robust, secure, and accessible document storage systems continues to grow.</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-yellow-400 mb-4">The Current Landscape</h2>
                  <p>Traditional document storage methods are rapidly becoming obsolete. Cloud storage, while convenient, often lacks the security measures necessary to protect truly sensitive information. This is where next-generation secure storage solutions come into play.</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-yellow-400 mb-4">Blockchain Technology</h2>
                  <p>Blockchain technology offers unprecedented security through its decentralized nature and cryptographic protection. By distributing data across multiple nodes and using advanced encryption, blockchain-based storage systems provide a level of security that traditional centralized systems simply cannot match.</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-yellow-400 mb-4">Advanced Encryption</h2>
                  <p>Modern encryption algorithms, including AES-256 and RSA encryption, ensure that your documents remain protected even if unauthorized access occurs. These encryption methods are virtually unbreakable with current technology.</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-yellow-400 mb-4">The Future</h2>
                  <p>As we look toward the future, we can expect to see even more advanced security measures, including quantum-resistant encryption and AI-powered threat detection. The future of document storage is not just about keeping files safe—it's about creating an ecosystem where privacy and accessibility coexist seamlessly.</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-yellow-400 mb-4">Conclusion</h2>
                  <p>The evolution of secure document storage represents a fundamental shift in how we think about digital privacy and security. By embracing these new technologies, we can ensure that our most important documents remain protected for years to come.</p>
                </div>
              </div>
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