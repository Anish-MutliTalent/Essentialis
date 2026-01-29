import { Twitter, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';

const Footer = memo(() => {
    return (
        <footer className="bg-black border-t border-white/10 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                    <div className="col-span-2 lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <img src="/favicon.svg" alt="Logo" className="w-8 h-8" />
                            <span className="text-xl font-bold text-white">Essentialis</span>
                        </div>
                        <p className="text-gray-400 max-w-sm mb-6 font-light">
                            The new standard for private, decentralized document storage.
                            Built for people who value their data.
                        </p>
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
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-black transition-all duration-300"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/#features" className="hover:text-yellow-400 transition-colors">Features</Link></li>
                            <li><Link to="/#security" className="hover:text-yellow-400 transition-colors">Security</Link></li>
                            <li><Link to="/pricing" className="hover:text-yellow-400 transition-colors">Pricing</Link></li>
                            <li><Link to="/about#roadmap" className="hover:text-yellow-400 transition-colors">Roadmap</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/about" className="hover:text-yellow-400 transition-colors">About Us</Link></li>
                            <li><Link to="/about#builders" className="hover:text-yellow-400 transition-colors">Builders</Link></li>
                            <li><Link to="/blog" className="hover:text-yellow-400 transition-colors">Blog</Link></li>
                            <li><Link to="/contact" className="hover:text-yellow-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/privacy-policy" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-service" className="hover:text-yellow-400 transition-colors">Terms of Service</Link></li>
                            <li><Link to="/cookie-policy" className="hover:text-yellow-400 transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Essentialis Inc. All rights reserved.
                    </div>
                    <div className="flex gap-8 text-sm text-gray-500">
                        <span>Designed with precision.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
});

export default Footer;
