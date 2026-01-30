import { useEffect, useState } from 'react';
import { Users, ArrowUpRight, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Counter } from './Interactive';
import { FaWhatsapp } from 'react-icons/fa';

const CommunityStats = () => {
    const [stats, setStats] = useState({ total_community: 0 });

    useEffect(() => {
        fetch('/api/public/stats') // Adjust URL if production env
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Stats fetch error", err));
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-8 relative z-20 flex items-center gap-6"
        >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-yellow-400/30 transition-all w-[440px]">
                {/* Techy Corner Accents */}
                <div className="absolute top-0 right-0 p-4 opacity-70">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Stat Block */}
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/5 border border-yellow-400/20 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                            <Users className="w-7 h-7 text-yellow-400" />
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 font-mono tracking-widest uppercase mb-1 flex items-center gap-2">
                                Total Members
                                <span className="text-[10px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20">Live</span>
                            </div>
                            <div className="text-4xl font-bold text-white tracking-tight flex items-baseline gap-1">
                                <Counter from={0} to={stats.total_community} duration={2.5} />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - Single Row */}
                    <div className="flex items-center gap-2">
                        <Link
                            to="/join-waitlist"
                            className="flex-1 bg-yellow-400 text-black rounded-xl font-bold text-xs sm:text-sm hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40 active:scale-[0.98] py-3 px-2 whitespace-nowrap"
                        >
                            Join Waitlist <ArrowUpRight className="w-4 h-4" />
                        </Link>

                        <a
                            href="https://chat.whatsapp.com/GjCN1H5X4k22ZqXp1u4y5x"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-[#25D366]/20 hover:text-[#25D366] text-gray-400 border border-white/10 transition-colors py-3 px-3 font-semibold text-xs sm:text-sm"
                            aria-label="Join WhatsApp Community"
                        >
                            <FaWhatsapp className="w-5 h-5" />
                            <span className="hidden sm:inline">Community</span>
                        </a>

                        <a
                            href="https://www.linkedin.com/company/essentialis-cloud/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 flex-none flex items-center justify-center rounded-xl bg-white/5 hover:bg-[#0077b5]/20 hover:text-[#0077b5] text-gray-400 border border-white/10 transition-colors py-3"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Side HUD for Stats */}
            <div className="hidden sm:block w-32 font-mono text-[10px] space-y-4">
                <div className="relative pl-3 border-l border-white/10">
                    <div className="absolute -left-[3px] top-0 w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_#4ade80]" />
                    <div className="text-gray-500 uppercase tracking-wider mb-1">Network</div>
                    <div className="text-green-400 font-bold">ACTIVE</div>
                </div>

                <div className="relative pl-3 border-l border-white/10">
                    <div className="absolute -left-[3px] top-0 w-1.5 h-1.5 bg-white/20 rounded-full" />
                    <div className="text-gray-500 uppercase tracking-wider mb-1">Yield</div>
                    <div className="text-white">+12/hr</div>
                </div>

                <div className="relative pl-3 border-l border-white/10">
                    <div className="absolute -left-[3px] top-0 w-1.5 h-1.5 bg-white/20 rounded-full" />
                    <div className="text-gray-500 uppercase tracking-wider mb-1">Chain</div>
                    <div className="text-yellow-500/80">L2</div>
                </div>
            </div>
        </motion.div>
    );
};

export default CommunityStats;
