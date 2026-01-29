import { memo } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Award, Calendar, Lightbulb, PenTool, TestTube, Rocket, Trophy, TrendingUp, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import CursorSpotlight from '../components/CursorSpotlight';
import { GlassCard, BlurWords } from '../components/Interactive';
import CinemaVideo from '../components/CinemaVideo';

// ========== Timeline Data ==========
const TIMELINE = [
  {
    year: '2024',
    title: 'The Spark',
    desc: 'We realized everyday people needed a straightforward way to keep personal documents secure. The idea for Essentialis was born.',
    icon: Lightbulb
  },
  {
    year: '2024',
    title: 'Core Foundation',
    desc: 'Our team came together with a singular mission: build something safe, practical, and accessible for everyone.',
    icon: Users
  },
  {
    year: '2025',
    title: 'Designing Simplicity',
    desc: 'We obsessed over the UX. Security shouldn’t require a manual. If you can send a message, you should be able to encrypt a file.',
    icon: PenTool
  },
  {
    year: '2025',
    title: 'Rigorous Testing',
    desc: 'We put our prototype in the hands of real families. Their feedback shaped our "invisible security" approach.',
    icon: TestTube
  },
  {
    year: '2025',
    title: 'Beta Launch',
    desc: 'Essentialis opens to the public. We are now securing documents for early adopters and growing rapidly.',
    icon: Rocket
  },
  {
    year: '2026',
    title: 'Public Recognition',
    desc: 'Started growing in LinkedIn and recognized as a rising star in decentralized privacy solutions.',
    icon: Trophy
  },
  {
    year: '2026',
    title: 'Future Plan: Raise Capital',
    desc: 'Scaling our infrastructure and team to serve millions of users worldwide. The next chapter of growth.',
    icon: TrendingUp
  }
];

// ========== Values Data ==========
const VALUES = [
  {
    icon: Award,
    title: 'Simplicity First',
    desc: 'Great security should be simple to use. Our goal is to make it almost invisible, so you stay safe without thinking about it.'
  },
  {
    icon: Users,
    title: 'People-Centric',
    desc: 'We build this for real people—parents, students, professionals—so anyone can keep their important files private.'
  },
  {
    icon: Target,
    title: 'True Ownership',
    desc: 'Your documents are always yours. We never lock you out, scan your data, or sell your information. Period.'
  }
];

// ========== Team Data ==========
const TEAM = [
  {
    name: 'Lakshmi Pavan Kumaar',
    role: 'Founder & CEO',
    bio: '16 y/o visionary experienced in React, JavaScript, and smart contract development.',
    gradient: 'from-amber-400 to-orange-500',
    linkedin: 'https://www.linkedin.com/in/pavankumaar009/',
    followers: '900+',
    // Attempting a high-res placeholder that looks professional if actual PFP fetch is impossible
    pfp: 'https://media.licdn.com/dms/image/v2/D5603AQFuw0MHXRFGKA/profile-displayphoto-shrink_400_400/B56ZPsvvIpGQAg-/0/1734843757912?e=1770854400&v=beta&t=kG_USCPtL2e10txa7M18olZRjqXHIYyShC0UsgzJ8rU'
  },
  {
    name: 'Anish Bhattacharya',
    role: 'Founder & COO',
    bio: '15 y/o expert in UI/UX, Solidity, Web3, and full-stack architecture.',
    gradient: 'from-blue-400 to-indigo-500',
    linkedin: 'https://www.linkedin.com/in/anishbhattacharya1120/',
    followers: '800+',
    pfp: 'https://media.licdn.com/dms/image/v2/D4E03AQFV8iDS3yGHYg/profile-displayphoto-scale_400_400/B4EZorj1SvHUAg-/0/1761667406215?e=1770854400&v=beta&t=CpOmNuC4iLg_yAJGRgauhaLrwnQCaZAcopySB8vPqpA'
  }
];

const About = memo(() => {
  return (
    <div className="relative z-[1] font-sans text-white min-h-screen selection:bg-yellow-500/30">
      <CursorSpotlight />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-8"
          >
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_#facc15]" />
            <span className="text-sm font-medium text-gray-300 tracking-wide uppercase">Our Story</span>
          </motion.div>

          <h1 className="text-5xl sm:text-7xl font-bold mb-8 tracking-tight">
            <BlurWords text="Redefining Digital" className="inline-block mr-3 text-white" />
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Sovereignty
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Essentialis Cloud helps you hold onto your most important documents—forever. We make it simple to keep things safe and private, so you don’t have to worry.
          </motion.p>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="p-8 md:p-12 border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl sm:text-4xl font-bold mb-6 text-white"
                >
                  Our Mission
                </motion.h2>
                <div className="space-y-6 text-gray-300 text-lg leading-relaxed font-light">
                  <p>
                    Everyone should be able to keep their personal documents safe and always within reach. Too often, people lose certificates, legal papers, or family records because of a lost password or a failed service.
                  </p>
                  <p>
                    Essentialis gives you control over your documents with simple, strong security—no tech skills required. If you know how to message, you know how to use this.
                  </p>
                </div>
              </div>

              <div className="relative">
                <GlassCard className="bg-black/40 border-yellow-500/20 p-8 flex flex-col items-center text-center">
                  <h3 className="text-xl font-bold text-white mb-4">Start Protecting Your Legacy</h3>
                  <p className="text-gray-400 mb-8 text-sm">Join the movement towards truer data ownership.</p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Link to="/pricing" className="flex-1 bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold overflow-hidden relative group transition-all hover:bg-yellow-300">
                      <span className="relative z-10">View Pricing</span>
                    </Link>
                    <Link to="/docs" className="flex-1 border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/5 transition-all">
                      Learn More
                    </Link>
                  </div>
                </GlassCard>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Video Section: Cinema Mode */}
      <section className="relative">
        <CinemaVideo
          src="/demovideo/WhyDidWeChooseThis.mp4"
          title="Why We Chose This Path"
          subtext="Our Philosophy"
        />
      </section>

      {/* Timeline Section */}
      <section id="roadmap" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Journey</h2>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500/0 via-yellow-500/50 to-yellow-500/0"></div>

            <div className="space-y-12">
              {TIMELINE.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center md:justify-between ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-black border-[3px] border-yellow-500 z-10 shadow-[0_0_10px_#eab308]" />

                  {/* Content */}
                  <div className="pl-12 md:pl-0 md:w-[45%]">
                    <GlassCard className={`p-6 border-white/10 hover:border-yellow-500/30 transition-colors ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className={`flex items-center gap-3 mb-2 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                        <div className="text-yellow-400 font-mono text-sm font-bold tracking-wider">{item.year}</div>
                        <item.icon className="w-4 h-4 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed font-light">{item.desc}</p>
                    </GlassCard>
                  </div>

                  {/* Spacer for the other side */}
                  <div className="hidden md:block md:w-[45%]" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {VALUES.map((value, i) => (
              <GlassCard key={i} className="p-8 hover:-translate-y-2 transition-transform duration-500 border-white/10 group">
                <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-colors">
                  <value.icon className="w-7 h-7 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  {value.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="builders" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">Meet the Builders</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {TEAM.map((member, i) => (
              <GlassCard key={i} className="p-8 relative overflow-hidden group border-white/10 flex flex-col items-center">
                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${member.gradient}`} />

                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="relative group/avatar block">
                  <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-br from-white/20 to-transparent mb-6 transition-transform duration-300 group-hover/avatar:scale-105">
                    <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center overflow-hidden">
                      {member.pfp ? (
                        <img src={member.pfp} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        /* Initials as fallback/style since we can't reliably get PFP */
                        <span className="text-2xl font-bold text-white/40 group-hover/avatar:text-white transition-colors">
                          {member.name.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>
                </a>

                <h3 className="text-xl font-bold text-white mb-1">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">
                    {member.name}
                  </a>
                </h3>
                <p className={`text-sm font-bold bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent mb-3 uppercase tracking-wider text-[10px]`}>
                  {member.role}
                </p>

                {/* LinkedIn Badge Simulation */}
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0077b5]/10 border border-[#0077b5]/30 text-[#0077b5] text-xs font-medium mb-5 hover:bg-[#0077b5]/20 hover:text-white transition-all group/linkedin">
                  <Linkedin className="w-3 h-3 group-hover/linkedin:scale-110 transition-transform" />
                  <span>{member.followers} Followers</span>
                </a>

                <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                  {member.bio}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default About;
