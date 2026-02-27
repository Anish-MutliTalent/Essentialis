/**
 * DevApp.tsx — Essentialis Dev IDE
 *
 * Self-hosted Remix IDE served on port 8080 (separate static server).
 * Start it with: npx serve public/remix -l 8080
 * Everything runs client-side — solc compiles in WASM, deploys via MetaMask.
 */

import { useState } from 'react';

const REMIX_URL = 'http://localhost:8081';

export default function DevApp() {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div className="h-screen w-screen flex flex-col bg-black overflow-hidden">
            {/* ── Branding Header ── */}
            <header className="h-10 border-b border-gray-800/60 bg-black/90 backdrop-blur-sm flex items-center px-4 shrink-0 z-50">
                <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded gradient-gold flex items-center justify-center text-black font-bold text-xs">E</div>
                    <span className="font-semibold text-white text-sm tracking-tight">Essentialis</span>
                    <span className="text-yellow-400/90 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-yellow-400/30 bg-yellow-400/5 uppercase tracking-wider">Dev</span>
                </div>
                <div className="flex-1" />
                <span className="text-gray-600 text-[10px] font-mono">
                    Remix IDE • Self-Hosted
                </span>
            </header>

            {/* ── Remix IDE ── */}
            <div className="flex-1 relative">
                {!loaded && !error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex space-x-1.5">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                            </div>
                            <span className="text-gray-500 text-xs">Loading Remix IDE...</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                        <div className="flex flex-col items-center gap-4 max-w-md text-center">
                            <span className="text-2xl">⚠️</span>
                            <p className="text-gray-300 text-sm">Remix IDE server is not running.</p>
                            <code className="text-yellow-400 text-xs bg-gray-900 px-4 py-2 rounded-lg border border-gray-800">
                                npx serve public/remix -l 8080
                            </code>
                            <p className="text-gray-500 text-xs">Run this from the <span className="text-gray-400">landing/</span> directory, then refresh.</p>
                        </div>
                    </div>
                )}

                <iframe
                    src={REMIX_URL}
                    className="w-full h-full border-0"
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                    title="Essentialis Dev — Remix IDE"
                    allow="clipboard-write"
                />
            </div>
        </div>
    );
}
