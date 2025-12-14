import { Mail, Linkedin, MessageCircle, Twitter } from 'lucide-react';
import Navigation from '../components/Navigation';

const Contact = () => {
  const contactMethods = [
    {
      name: 'Email',
      icon: Mail,
      href: 'mailto:founders@essentialis.cloud',
      description: 'Send us an email for support, inquiries, or feedback',
      color: 'from-red-400 to-red-600'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com/company/essentialis-cloud',
      description: 'Connect with us on LinkedIn for updates and networking',
      color: 'from-blue-500 to-blue-700'
    },
    {
      name: 'Reddit',
      icon: MessageCircle,
      href: 'https://reddit.com/r/EssentialisCloud',
      description: 'Join our Reddit community for discussions and support',
      color: 'from-orange-500 to-orange-700'
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      href: 'https://x.com/EssentialisHQ',
      description: 'Follow us on X for the latest news and announcements',
      color: 'from-gray-400 to-gray-600'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-20 relative overflow-hidden">
      {/* subtle background gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-0 h-[40rem] w-[40rem] rounded-full blur-3xl opacity-20" style={{background: 'radial-gradient(closest-side, rgba(212,175,55,0.2), transparent)'}} />
        <div className="absolute bottom-0 -right-40 h-[48rem] w-[48rem] rounded-full blur-3xl opacity-10" style={{background: 'radial-gradient(closest-side, rgba(255,255,255,0.15), transparent)'}} />
      </div>

      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Get in Touch
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We'd love to hear from you. Reach out through any of the channels below.
            </p>
          </div>

          {/* Contact Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {contactMethods.map((method) => (
              <a
                key={method.name}
                href={method.href}
                target={method.href.startsWith('http') ? '_blank' : undefined}
                rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all hover:border-yellow-400/40 hover:shadow-gold hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-start space-x-6">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-r ${method.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 text-yellow-400 group-hover:text-yellow-300 transition-colors">
                      {method.name}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {method.description}
                    </p>
                    <div className="mt-4 text-yellow-400 text-sm font-medium group-hover:text-yellow-300 transition-colors">
                      Visit {method.name} →
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Additional Info Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">
                Response Times
              </h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                We typically respond to emails within 24-48 hours during business days. 
                For urgent matters, please reach out through our social media channels 
                for faster response times.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="text-lg font-semibold text-yellow-400 mb-2">Business Hours</h3>
                  <p className="text-gray-300">Monday - Friday: 4:00 PM - 9:00 PM IST</p>
                  <p className="text-gray-300">Saturday - Sunday: 9:00 AM - 7:00 PM IST</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-400 mb-2">Support</h3>
                  <p className="text-gray-300">We're here to help with any questions or concerns you may have.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

