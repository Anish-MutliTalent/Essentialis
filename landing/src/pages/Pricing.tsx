  import React, { useState } from 'react';
  import Navigation from '../components/Navigation';
  import { Check, X, Star, Shield, Zap, Crown, Gift } from 'lucide-react';
  
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
          '1MB secure storage (Payments based on usage after exceeding limits)',
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
        popular: false,
        cta: 'Get Started Free'
      },
      {
        name: 'Personal',
        icon: Shield,
        description: 'Perfect for all sorts of personal documents, including passwords, confidential documents and records, etc.',
        monthlyPrice: 90,
        annualPrice: 999,
        features: [
          'Everything in free, and...',
          '300MB Secure Storage (Payments based on usage after exceeding limits)',
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
        popular: true,
        cta: 'Start Personal'
      },
      {
        name: 'Professional',
        icon: Zap,
        description: 'Ideal for professionals and small businesses with sensitive documents',
        monthlyPrice: 299,
        annualPrice: 3399,
        features: [
          'Everything in personal and...',
          '1GB secure storage',
          'Advanced Access control',
          'Team collaboration',
          'Advanced Data redundancy and storage space management (coming up)',
          'Support for SQL-like datatables, and API access to tables (coming up)'
        ],
        limitations: [],
        popular: false,
        cta: 'Start Professional'
      },
      {
        name: 'Enterprise',
        icon: Crown,
        description: 'For organizations that need maximum security and advanced features',
        monthlyPrice: 'Contact for price',
        annualPrice: 'Starting at ₹599/month',
        features: [
          'Everything in professional, and...',
          'Up to unlimited storage',
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
      <div className="min-h-screen bg-black text-white pt-20">
        <Navigation />
        
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Simple, Transparent Pricing
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Choose the perfect plan to keep your confidential documents secure with Essentialis Cloud. All plans include our core security features.
              </p>
  
              {/* Billing Toggle */}
              <div className="flex items-center justify-center space-x-4 mb-12">
                <span className={`text-sm font-medium ${!isAnnual ? 'text-yellow-400' : 'text-gray-400'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                    isAnnual ? 'bg-yellow-400' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      isAnnual ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${isAnnual ? 'text-yellow-400' : 'text-gray-400'}`}>
                  Annual
                </span>
                {isAnnual && (
                  <span className="bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium border border-yellow-400/20">
                    Save up to 17%
                  </span>
                )}
              </div>
            </div>
  
            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative bg-gray-900/30 border rounded-xl p-8 transition-all duration-300 hover:border-yellow-400/50 ${
                    plan.popular ? 'border-yellow-400/50' : 'border-gray-800'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-semibold flex items-center whitespace-nowrap">
                        <Star className="w-4 h-4 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}
  
                  <div className="text-center mb-6">
                    <plan.icon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-gray-400 mb-4 text-sm leading-relaxed">{plan.description}</p>
                    
                    <div className="mb-4">
                      {plan.name === 'Enterprise' ? (
                        <div>
                          <div className="text-lg font-bold text-yellow-400 mb-1">Contact for price</div>
                          <div className="text-sm text-gray-400">Starting at ₹599/month</div>
                        </div>
                      ) : (
                        <>
                          <span className="text-2xl font-bold">
                            ₹{isAnnual ? plan.annualPrice : plan.monthlyPrice}
                          </span>
                          <span className="text-gray-400">
                            {plan.monthlyPrice === 0 ? '' : isAnnual ? '/year' : '/month'}
                          </span>
                        </>
                      )}
                    </div>
  
                    <button className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 text-sm ${
                      plan.popular
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700'
                        : 'bg-gray-900/50 text-white hover:bg-gray-800/50 border border-gray-700 hover:border-yellow-400'
                    }`}>
                      {plan.cta}
                    </button>
                  </div>
  
                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-yellow-400 mb-3 text-sm">What's included:</h4>
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations.length > 0 && (
                      <>
                        <h4 className="font-semibold text-gray-400 mb-3 mt-4 text-sm">Limitations:</h4>
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <span className="text-gray-400 text-sm">{limitation}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
  
            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Frequently Asked Questions
                </span>
              </h2>
              
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">{faq.question}</h3>
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
  
            {/* CTA Section */}
            <div className="text-center mt-20">
              <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/20 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                <p className="text-gray-300 mb-6">
                  Our team is here to help you choose the right plan for your needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300">
                    Contact Sales
                  </button>
                  <button className="border border-yellow-400 text-yellow-400 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400/10 transition-all duration-300">
                    Schedule Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Pricing;
