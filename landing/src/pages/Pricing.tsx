import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Check, X, Star, Shield, Zap, Crown, Gift, ArrowRight, Lock } from 'lucide-react';
import Footer from '../components/Footer';
import CursorSpotlight from '../components/CursorSpotlight';
import { BlurWords, MagneticButton, GlassCard } from '../components/Interactive';
import { Link } from 'react-router-dom';

// Custom Card with exposed Badge support (no overflow-hidden on container)
const PricingCard = ({ children, className = '', popular = false, delay = 0 }: any) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateY = useTransform(mouseX, [-100, 100], [-6, 6]);
  const rotateX = useTransform(mouseY, [-100, 100], [6, -6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
    mouseY.set(e.clientY - (rect.top + rect.height / 2));
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      style={{ rotateX, rotateY }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay }}
      className={`relative h-full flex flex-col perspective-1000 ${className}`}
    >
      {/* Badge container - outside the clipped area but inside the tilting container */}
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_20px_rgba(234,179,8,0.6)]">
            <Star className="w-3 h-3 fill-black" />
            Popular
          </div>
        </div>
      )}

      {/* Main Card Content - Clipped */}
      <div className={`flex flex-col h-full bg-white/5 backdrop-blur-2xl border ${popular ? 'border-yellow-400/30' : 'border-white/10'} rounded-2xl p-8 relative overflow-hidden`}>
        {/* Internal background effects */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        {popular && (
          <div className="absolute inset-0 bg-yellow-400/5 rounded-2xl pointer-events-none" />
        )}
        {children}
      </div>
    </motion.div>
  );
};

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Free',
      icon: Gift,
      description: 'Perfect for storing personal documents like passwords, identity, keys, certificates',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        '3000 Credits, 1GB limit',
        'Advanced encryption',
        'Mobile app access',
        'Basic document preview',
        'Basic authentication'
      ],
      limitations: [
        'Limited File types',
        'No email support',
        'No secure authentication (MFA)',
        'No folder support',
        'No sharing (only you)',
        'No guaranteed data integrity'
      ],
      popular: true,
      cta: 'Join Waitlist'
    },
    {
      name: 'Personal',
      icon: Shield,
      description: 'Perfect for all sorts of personal documents, including passwords, confidential documents and records, etc.',
      monthlyPrice: 1.99,
      annualPrice: 19.99,
      features: [
        'Everything in free, and...',
        '50,000 Credits, 20GB limit',
        'Email Support',
        'All file types supported',
        'Sharing controls',
        '2FA',
        'Audit logs',
        'Document versioning retrieval',
        'Custom Folder support',
        'Priority document preview and in-app editing for supported file types (coming up)',
        'Guaranteed data integrity'
      ],
      limitations: [
        'No audit integrity (Data will always be intact but history and metadata may not)',
        'No API access',
        'No access control (Sharing to anyone gives them same access as yourself)'
      ],
      popular: false,
      cta: 'Join Waitlist'
    },
    {
      name: 'Professional',
      icon: Zap,
      description: 'Ideal for professionals and small businesses with sensitive documents',
      monthlyPrice: 10.99,
      annualPrice: 109.99,
      features: [
        'Everything in personal and...',
        '200,000 Credits, 250GB limit',
        'Advanced Access control',
        'Team collaboration',
        'Advanced Data redundancy and storage space management (coming up)',
        'Support for SQL-like datatables, and API access to tables (coming up)'
      ],
      limitations: [],
      popular: false,
      cta: 'Join Waitlist'
    },
    {
      name: 'Enterprise',
      icon: Crown,
      description: 'For organizations that need maximum security and advanced features',
      monthlyPrice: 'Contact',
      annualPrice: 'Contact',
      features: [
        'Everything in professional, and...',
        'Starting 300k credits, 1TB, upto unlimited',
        'Military-grade encryption',
        '24/7 phone, email, and text support',
        'Dedicated account management',
        'Secure advanced access control',
        'Custom branding',
        'Custom integrations',
        'Full Secure API access (coming up)',
        'Advanced admin control (coming up)',
        'Advanced analytics (coming up)',
        'SQL-like Query Execution support for datatables (coming up)'
      ],
      limitations: [],
      popular: false,
      cta: 'Contact Sales'
    }
  ];

  const faqs = [
    {
      question: 'Is my data really secure?',
      answer: 'Yes, we use end-to-end encryption with AES-256 encryption. Your documents are encrypted before they leave your device, and we cannot access your files even if we wanted to.'
    },
    {
      question: 'Can I upgrade or downgrade my plan anytime?',
      answer: 'Absolutely! You can change your plan at any time. When upgrading, you\'ll get immediate access to new features. When downgrading, changes take effect at your next billing cycle.'
    },
    {
      question: 'What happens if I exceed my storage limit?',
      answer: 'We\'ll notify you when you\'re approaching your limit. You can either upgrade your plan or delete some files. We won\'t delete your files, but you won\'t be able to upload new ones until you\'re under the limit.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, contact our support team for a full refund.'
    },
    {
      question: 'Can I share documents with people who don\'t have an account?',
      answer: 'Yes, you can create secure sharing links that work for anyone. You can set passwords, expiration dates, and view-only permissions for maximum security.'
    }
  ];

  return (
    <div className="relative z-[1] font-sans text-white min-h-screen selection:bg-yellow-500/30">
      <CursorSpotlight />

      {/* Hero Header */}
      <section className="relative pt-48 pb-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center space-x-2 bg-yellow-400/10 backdrop-blur-md px-4 py-2 rounded-full border border-yellow-400/20 mb-8 relative z-10"
        >
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_#facc15]" />
          <span className="text-sm font-bold text-yellow-400 tracking-wide uppercase">Open Beta Now Live</span>
        </motion.div>

        <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight relative z-10">
          <BlurWords text="Future Pricing" className="inline-block mr-3 text-white" />
          <span className="block text-2xl md:text-3xl font-light text-gray-400 mt-2">
            (All features are currently free during Beta)
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light relative z-10"
        >
          Essentialis is currently in <b>Public Beta</b>. We are testing our features with early adopters. Join the waitlist to secure your spot and lock in early-bird benefits.
        </motion.p>
      </section>

      {/* Pricing Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <PricingCard
                key={plan.name}
                popular={plan.popular}
                // Add grayscale effect to paid plans to show they are not active yet
                className={`transition-all duration-300 ${plan.monthlyPrice !== 0 && plan.name !== 'Contact' ? 'opacity-70 hover:opacity-100 grayscale-[0.5] hover:grayscale-0' : ''}`}
                delay={index * 0.1}
              >
                <div className="text-center mb-8 relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center border border-white/10 transition-colors">
                    <Icon className={`w-8 h-8 ${plan.popular ? 'text-yellow-400' : 'text-gray-300'} transition-colors`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed min-h-[40px]">{plan.description}</p>
                </div>

                <div className="text-center mb-8 relative z-10">
                  {plan.name === 'Enterprise' ? (
                    <div>
                      <div className="text-2xl font-bold text-yellow-400 mb-1">Custom</div>
                      <div className="text-xs text-gray-400">Contact for Details</div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-center gap-2 flex-col">
                        {plan.monthlyPrice !== 0 ? (
                          <>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/10">Coming Soon</span>
                            <div className="flex items-end justify-center gap-1 opacity-50 line-through decoration-white/30">
                              <span className="text-2xl font-bold text-white tracking-tight">
                                ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                              </span>
                              <span className="text-gray-400 mb-1 text-sm font-medium">
                                {isAnnual ? '/yr' : '/mo'}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-end justify-center gap-1">
                            <span className="text-4xl font-bold text-white tracking-tight">Free</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex-grow space-y-4 mb-8 relative z-10">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                  <h4 className="font-semibold text-white/60 mb-3 text-xs uppercase tracking-wider">What to expect</h4>

                  {plan.features.slice(0, 5).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm font-light leading-snug">{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 5 && (
                    <div className="pl-7 text-xs text-gray-500 italic">...and more</div>
                  )}
                </div>

                <div className="relative z-10 mt-auto">
                  <Link to="/join-waitlist">
                    <button className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 relative overflow-hidden group/btn ${plan.popular
                        ? 'bg-yellow-400 text-black hover:bg-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.3)]'
                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                      }`}>
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {plan.name === 'Enterprise' ? 'Contact Sales' : 'Join Waitlist'}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </span>
                    </button>
                  </Link>
                  {plan.monthlyPrice !== 0 && (
                    <div className="text-center mt-3 flex items-center justify-center gap-1.5 opacity-60">
                      <Lock className="w-3 h-3 text-gray-400" />
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">Locked until V1</span>
                    </div>
                  )}
                </div>

              </PricingCard>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <BlurWords text="Frequently Asked Questions" className="text-3xl sm:text-4xl font-bold mb-4 text-white" />
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <GlassCard key={index} className="p-6 border-white/10 hover:border-white/20 transition-colors" delay={index * 0.1}>
                <h3 className="text-lg font-bold text-yellow-400 mb-2">{faq.question}</h3>
                <p className="text-gray-300 leading-relaxed font-light">{faq.answer}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
