import { Twitter, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';

const Footer = memo(() => {
    return (
        <footer className="relative pt-40 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-white/5">
            {/* Massive Glowing Logo Background Map effect */}
            <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[400px] bg-gradient-to-t from-yellow-500/10 to-transparent blur-[120px] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto z-10 flex flex-col items-center">
                
                {/* Minimal Links Top Row */}
                <div className="w-full flex flex-col md:flex-row justify-between items-end mb-24 border-b border-white/10 pb-12 gap-12">
                    <div className="max-w-md">
                        <h3 className="text-3xl md:text-4xl font-light text-white mb-6 tracking-tight">Built for those who value their <br/><span className="font-semibold text-yellow-400">sovereignty.</span></h3>
                        <p className="text-gray-400 font-light text-sm leading-relaxed max-w-xs">
                            The new standard for private, decentralized active document storage.
                        </p>
                    </div>

                    <div className="flex gap-16 md:gap-24">
                        <div>
                            <h4 className="font-semibold text-white tracking-widest uppercase text-xs mb-6 opacity-60">Platform</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><Link to="/#features" className="hover:text-yellow-400 transition-colors">Features</Link></li>
                                <li><Link to="/#security" className="hover:text-yellow-400 transition-colors">Security</Link></li>
                                <li><Link to="/pricing" className="hover:text-yellow-400 transition-colors">Pricing</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white tracking-widest uppercase text-xs mb-6 opacity-60">Company</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><Link to="/about" className="hover:text-yellow-400 transition-colors">About Us</Link></li>
                                <li><Link to="/blog" className="hover:text-yellow-400 transition-colors">Blog</Link></li>
                                <li><Link to="/contact" className="hover:text-yellow-400 transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Massive Typography Logo */}
                <div className="w-full flex justify-center items-center">
                    <img src="/essentialis.png" alt="Logo" className="w-50" />
                </div>

                {/* Bottom Bar */}
                <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-4">
                        {[
                            { icon: Twitter, href: 'https://x.com/EssentialisHQ' },
                            { icon: MessageCircle, href: 'https://chat.whatsapp.com/GjXY15y2kO5Kq7XqgG9jQ1' },
                            { icon: Linkedin, href: 'https://www.linkedin.com/company/essentialis/' },
                            { icon: Mail, href: 'mailto:founders@essentialis.cloud' }
                        ].map((social, i) => (
                            <a
                                key={i}
                                href={social.href}
                                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all duration-300"
                            >
                                <social.icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                    
                    <div className="flex gap-6 text-xs text-gray-500 font-medium tracking-wide">
                        <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms</Link>
                        <span>&copy; {new Date().getFullYear()} Essentialis Inc.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
});

export default Footer;
