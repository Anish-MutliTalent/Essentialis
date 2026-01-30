import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Globe, ArrowRight, Shield, FileText, Users } from 'lucide-react';
import { GlassCard, Counter } from './Interactive';
import JazziconAvatar from './UI/JazziconAvatas';

const BentoGrid = memo(() => {
    const [stats, setStats] = useState({ total_community: 0, latest_members: [] as { wallet: string, email_excerpt: string }[] });

    useEffect(() => {
        fetch('/api/public/stats') // Use relative path or full URL if needed
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Stats fetch error", err));
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
            {/* Large Feature - Span 8 */}
            <GlassCard className="md:col-span-12 lg:col-span-8 min-h-[400px] flex flex-col justify-between p-10 bg-gradient-to-br from-white/5 to-white/0 overflow-hidden relative group">
                <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mb-6 text-yellow-400">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-white">Bank-Grade Security</h3>
                    <p className="text-gray-400 max-w-md text-lg">
                        AES-256 encryption happens right in your browser. Your files are encrypted before they ever touch the network.
                    </p>
                </div>
                {/* Decorative animated elements */}
                <motion.div
                    className="absolute -right-20 bottom-0 w-80 h-80 bg-gradient-to-t from-yellow-500/20 to-transparent rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
            </GlassCard>

            {/* Tall Feature - Span 4 */}
            <GlassCard className="md:col-span-6 lg:col-span-4 min-h-[400px] p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 h-full flex flex-col">
                    <div className="flex-1">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-white">
                            <Smartphone className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-white">Global Access</h3>
                        <p className="text-gray-400 text-sm">
                            Your keys, your data. Access from any device, anywhere in the world without reliance on centralized servers.
                        </p>
                    </div>
                    <div className="mt-8 border-t border-white/10 pt-6">
                        <div className="flex items-center gap-3 text-sm font-semibold text-yellow-400 group-hover:gap-4 transition-all cursor-pointer">
                            Learn more <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Community/Waitlist Feature - Span 4 (Replaces Lightning Fast) */}
            <GlassCard className="md:col-span-6 lg:col-span-4 min-h-[250px] p-8 flex flex-col justify-center relative overflow-hidden group hover:border-yellow-400/30 transition-all">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                {/* Live Indicator */}
                <div className="absolute top-6 right-6 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-mono text-green-400 uppercase tracking-widest">Live</span>
                </div>

                <div className="relative z-10">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400">
                        <Users className="w-6 h-6" />
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-1 flex items-baseline gap-1">
                        <Counter from={0} to={stats.total_community} duration={2.5} />
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">Early believers joined</p>

                    {/* Jazzicon Circles */}
                    <div className="flex items-center -space-x-3">
                        {stats.latest_members && stats.latest_members.length > 0 ? (
                            stats.latest_members.map((member, i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full border-2 border-black bg-gray-900 flex items-center justify-center shadow-gold transition-transform hover:scale-110 hover:z-10 relative cursor-help"
                                    title={member.email_excerpt}
                                >
                                    <JazziconAvatar
                                        wallet={member.wallet}
                                        size={40}
                                        className="w-full h-full rounded-full"
                                    />
                                </div>
                            ))
                        ) : (
                            // Fallback placeholders if no members yet
                            [
                                'bg-gradient-to-r from-pink-500 to-rose-500',
                                'bg-gradient-to-r from-blue-400 to-indigo-500',
                                'bg-gradient-to-r from-emerald-400 to-teal-500'
                            ].map((grad, i) => (
                                <div key={i} className={`w-10 h-10 rounded-full border-2 border-black ${grad} flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-black`} />
                            ))
                        )}

                        <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-600 bg-gray-800 flex items-center justify-center text-xs text-gray-400 z-0 pl-1">
                            +
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Medium Feature - Span 4 */}
            <GlassCard className="md:col-span-6 lg:col-span-4 min-h-[250px] p-8 flex flex-col justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 ring-1 ring-blue-500/30">
                        <Globe className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Decentralized</h3>
                    <p className="text-gray-400 text-sm">No single point of failure.</p>
                </div>
            </GlassCard>

            {/* Medium Feature - Span 4 */}
            <GlassCard className="md:col-span-6 lg:col-span-4 min-h-[250px] p-8 flex flex-col justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4 ring-1 ring-green-500/30">
                        <FileText className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Immutable History</h3>
                    <p className="text-gray-400 text-sm">Verifiable audit trails.</p>
                </div>
            </GlassCard>
        </div>
    );
});

export default BentoGrid;
