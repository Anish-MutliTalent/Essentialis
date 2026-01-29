import { useState, useRef } from 'react';
import { Mail, Linkedin, MessageCircle, Twitter, Users, Plus, ArrowUpRight, Send, Check } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import CursorSpotlight from '../components/CursorSpotlight';
import { BlurWords, GlassCard, MagneticButton } from '../components/Interactive';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const contactMethods = [
    {
      name: 'Email Support',
      icon: Mail,
      href: 'mailto:founders@essentialis.cloud',
      description: 'The best way to get support or share serious inquiries.',
      color: 'from-yellow-400 to-orange-500',
      action: 'Send Email'
    },
    {
      name: 'WhatsApp Community',
      icon: MessageCircle,
      href: 'https://chat.whatsapp.com/GjXY15y2kO5Kq7XqgG9jQ1', // Placeholder or specific if provided
      description: 'Join our WhatsApp community for instant updates and discussions.',
      color: 'from-green-400 to-green-600',
      action: 'Join Group'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://www.linkedin.com/company/essentialis/',
      description: 'Follow our company page for professional updates.',
      color: 'from-blue-700 to-blue-900',
      action: 'Follow Page'
    },
    {
      name: 'Updates',
      icon: Twitter,
      href: 'https://x.com/EssentialisHQ',
      description: 'Follow us on X for the latest announcements.',
      color: 'from-blue-400 to-blue-600',
      action: 'Follow @EssentialisHQ'
    }
  ];

  const builders = [
    {
      name: 'Lakshmi Pavan Kumaar',
      role: 'Founder & CEO',
      linkedin: 'https://www.linkedin.com/in/pavankumaar009/',
      details: 'Connect for partnerships & vision.',
      pfp: 'https://media.licdn.com/dms/image/v2/D5603AQFuw0MHXRFGKA/profile-displayphoto-shrink_400_400/B56ZPsvvIpGQAg-/0/1734843757912?e=1770854400&v=beta&t=kG_USCPtL2e10txa7M18olZRjqXHIYyShC0UsgzJ8rU'
    },
    {
      name: 'Anish Bhattacharya',
      role: 'Founder & COO',
      linkedin: 'https://www.linkedin.com/in/anishbhattacharya1120/',
      details: 'Connect for operations & product.',
      pfp: 'https://media.licdn.com/dms/image/v2/D4E03AQFV8iDS3yGHYg/profile-displayphoto-scale_400_400/B4EZorj1SvHUAg-/0/1761667406215?e=1770854400&v=beta&t=CpOmNuC4iLg_yAJGRgauhaLrwnQCaZAcopySB8vPqpA'
    }
  ];

  return (
    <div className="relative z-[1] font-sans text-white min-h-screen selection:bg-yellow-500/30">
      <CursorSpotlight />
      <Navigation />

      <div className="pt-48 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">

        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">
              <BlurWords text="Let's Build" className="inline-block mr-3 text-white" />
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                Together
              </span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Whether you have a question, a bug report, or just want to say hi, we're always open to connecting with our users.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          {/* Left Column: Contact Methods */}
          <div className="space-y-6">
            {contactMethods.map((method, idx) => (
              <GlassCard key={method.name} className="p-6 group hover:border-yellow-400/30 transition-all duration-300 relative overflow-hidden flex items-center gap-6" delay={idx * 0.1}>
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${method.color} bg-opacity-20 shadow-lg group-hover:scale-110 transition-transform`}>
                  <method.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">{method.name}</h3>
                  <p className="text-sm text-gray-400 font-light">{method.description}</p>
                </div>
                <a
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-colors border border-white/10 group-hover:border-yellow-400/30"
                  aria-label={method.action}
                >
                  <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-yellow-400" />
                </a>
              </GlassCard>
            ))}
          </div>

          {/* Right Column: Connect with Builders */}
          <div className="lg:pl-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Connect with the Builders</h2>
              <p className="text-gray-400 text-sm font-light">
                We are building in public. Feel free to connect with us directly on LinkedIn.
                DMs are open for feedback and collaboration.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {builders.map((builder, idx) => (
                <GlassCard key={builder.name} className="p-5 flex items-center gap-5 hover:border-blue-500/30 group" delay={0.3 + (idx * 0.1)}>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-blue-500/50 transition-colors">
                      <img src={builder.pfp} alt={builder.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-[#0077b5] p-1 rounded-full border border-black text-white">
                      <Linkedin className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{builder.name}</h3>
                    <p className="text-xs text-yellow-500 font-medium uppercase tracking-wider mb-1">{builder.role}</p>
                    <p className="text-xs text-gray-400">{builder.details}</p>
                  </div>

                  <a
                    href={builder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-[#0077b5]/10 text-[#0077b5] text-xs font-bold uppercase tracking-wider hover:bg-[#0077b5] hover:text-white transition-all border border-[#0077b5]/20"
                  >
                    Connect
                  </a>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* Response Time Note */}
        <div className="max-w-2xl mx-auto text-center opacity-60 hover:opacity-100 transition-opacity">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-300">Typical response time: &lt; 24 hours</span>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};
export default Contact;
