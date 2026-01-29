
import { memo } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import CursorSpotlight from '../components/CursorSpotlight';
import { GlassCard } from '../components/Interactive';

const TermsOfService = memo(() => {
    return (
        <div className="relative z-[1] font-sans text-white min-h-screen selection:bg-yellow-500/30">
            <CursorSpotlight />
            <Navigation />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <GlassCard className="p-8 md:p-12 border-white/10">
                    <h1 className="text-4xl font-bold mb-8 text-white">Terms of Service</h1>
                    <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="space-y-8 text-gray-300 font-light leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using the Essentialis platform and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
                            <p>
                                Essentialis provides a decentralized interface for encrypting and storing documents. Users interact directly with smart contracts and decentralized storage networks. We do not control the underlying blockchain networks.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
                            <ul className="list-disc pl-5 mt-4 space-y-2">
                                <li><strong>Key Management:</strong> You are solely responsible for maintaining the security of your private keys and wallet credentials. If you lose your keys, you will permanently lose access to your encrypted files. We cannot recover them for you.</li>
                                <li><strong>Lawful Use:</strong> You agree not to use the Service for any illegal purposes or to store illegal content.</li>
                                <li><strong>Risk Assumption:</strong> You acknowledge the risks associated with blockchain technology, including regulatory uncertainty and technical failures.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Disclaimers</h2>
                            <p>
                                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. ESSENTIALIS DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
                            <p>
                                In no event shall Essentialis, its founders, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service, including but not limited to loss of data or keys.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Changes to Terms</h2>
                            <p>
                                We reserve the right to modify these terms at any time. We will notify users of significant changes by updating the date at the top of this policy.
                            </p>
                        </section>
                    </div>
                </GlassCard>
            </div>
            <Footer />
        </div>
    );
});

export default TermsOfService;
