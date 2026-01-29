
import { memo } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import CursorSpotlight from '../components/CursorSpotlight';
import { GlassCard } from '../components/Interactive';

const PrivacyPolicy = memo(() => {
    return (
        <div className="relative z-[1] font-sans text-white min-h-screen selection:bg-yellow-500/30">
            <CursorSpotlight />
            <Navigation />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <GlassCard className="p-8 md:p-12 border-white/10">
                    <h1 className="text-4xl font-bold mb-8 text-white">Privacy Policy</h1>
                    <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="space-y-8 text-gray-300 font-light leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                            <p>
                                Essentialis ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our decentralized document storage service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Zero-Knowledge Architecture</h2>
                            <p>
                                Our core philosophy is privacy by design. We utilize a zero-knowledge architecture, which means:
                            </p>
                            <ul className="list-disc pl-5 mt-4 space-y-2">
                                <li>Files are encrypted on your device before they ever reach our network.</li>
                                <li>We do not possess the private keys required to decrypt your files.</li>
                                <li>We cannot view, access, or share the contents of your stored documents.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Information We Collect</h2>
                            <p className="mb-4">
                                Due to our decentralized nature, we collect minimal information:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Wallet Address:</strong> Used for authentication and account management.</li>
                                <li><strong>Usage Metadata:</strong> Basic encrypted metadata (e.g., storage quotas, file counts) necessary for service operation.</li>
                                <li><strong>Communication Data:</strong> If you contact us directly via email or support channels.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. How We Use Information</h2>
                            <p>
                                We use the limited information we collect solely to:
                            </p>
                            <ul className="list-disc pl-5 mt-4 space-y-2">
                                <li>Provide and maintain the Service.</li>
                                <li>Monitor usage patterns to improve performance and scalability.</li>
                                <li>Detect and prevent technical issues or abuse.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Data Retention</h2>
                            <p>
                                As a decentralized service using IPFS and blockchain technology, data stored on the network relies on the persistence of the underlying protocols. Your encrypted data cannot be "deleted" in the traditional sense from the immutable ledger, but it remains permanently inaccessible without your private key.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
                            <p>
                                If you have questions about this Privacy Policy, please contact us at <a href="mailto:founders@essentialis.cloud" className="text-yellow-400 hover:underline">founders@essentialis.cloud</a>.
                            </p>
                        </section>
                    </div>
                </GlassCard>
            </div>
            <Footer />
        </div>
    );
});

export default PrivacyPolicy;
