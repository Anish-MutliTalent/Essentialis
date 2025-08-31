import React from 'react';
import Navigation from '../components/Navigation';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';

const Blog = () => {
  // Mock blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Secure Document Storage",
      slug: "future-secure-document-storage",
      excerpt: "Exploring how blockchain technology and advanced encryption are revolutionizing the way we store and protect our most important documents.",
      content: "Full article content here...",
      author: "Essentialis Cloud Team",
      published: true,
      featured_image: "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800",
      tags: ["Security", "Technology", "Future"],
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z"
    },
    {
      id: 2,
      title: "5 Tips for Organizing Your Digital Documents",
      slug: "organizing-digital-documents",
      excerpt: "Learn practical strategies for keeping your digital documents organized, accessible, and secure in today's digital world.",
      content: "Full article content here...",
      author: "Essentialis Cloud Team",
      published: true,
      featured_image: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800",
      tags: ["Organization", "Productivity", "Tips"],
      created_at: "2024-01-10T14:30:00Z",
      updated_at: "2024-01-10T14:30:00Z"
    },
    {
      id: 3,
      title: "Understanding Data Privacy in 2024",
      slug: "data-privacy-2024",
      excerpt: "A comprehensive guide to understanding your data privacy rights and how to protect your personal information online.",
      content: "Full article content here...",
      author: "Essentialis Cloud Team",
      published: true,
      featured_image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800",
      tags: ["Privacy", "Security", "Legal"],
      created_at: "2024-01-05T09:15:00Z",
      updated_at: "2024-01-05T09:15:00Z"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden hover:border-yellow-400/50 transition-all duration-300 group">
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
                    {post.tags.map((tag) => (
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
                        {formatDate(post.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* Read More */}
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