
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
                    <h1 className="text-4xl font-bold mb-8 text-white">HAPPY APRIL FOOLS DAY!</h1>

                </GlassCard>
            </div>
            <Footer />
        </div>
    );
});

export default CookiePolicy;
