
import { memo } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import CursorSpotlight from '../components/CursorSpotlight';
import { GlassCard } from '../components/Interactive';

const CookiePolicy = memo(() => {
    return (
        <div className="relative z-[1] font-sans text-white min-h-screen selection:bg-yellow-500/30">
            <CursorSpotlight />
            <Navigation />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <GlassCard className="p-8 md:p-12 border-white/10">
                    <h1 className="text-4xl font-bold mb-8 text-white">Cookie Policy</h1>
                    <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="space-y-8 text-gray-300 font-light leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies?</h2>
                            <p>
                                Cookies are small text files stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Cookies</h2>
                            <p className="mb-4">
                                Essentialis uses cookies sparingly and prioritizes your privacy. We use cookies for:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Essential Functions:</strong> To maintain your session when you log in via your wallet.</li>
                                <li><strong>Preferences:</strong> To remember your local settings (like language or display preferences).</li>
                                <li><strong>Analytics:</strong> Minimal, privacy-preserving analytics to understand aggregate site usage. We do not track individual behavior across the web.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Managing Cookies</h2>
                            <p>
                                Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may affect the functionality of the Essentialis application, specifically authentication features.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Updates</h2>
                            <p>
                                We may update this Cookie Policy from time to time. We encourage you to review this page periodically for the latest information on our privacy practices.
                            </p>
                        </section>
                    </div>
                </GlassCard>
            </div>
            <Footer />
        </div>
    );
});

export default CookiePolicy;
