import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, Heading, Text, Input, Button, LoadingSpinner } from '../components/UI';
import { FaArrowRight, FaLock } from 'react-icons/fa';

const AccessGatePage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const [showReferralInput, setShowReferralInput] = useState(false);
    const [manualCode, setManualCode] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsChecking(true);
        setError(null);

        try {
            const response = await fetch('/api/access/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) throw new Error('Failed to verify access');

            const data = await response.json();
            if (data.allowed) {
                // User allowed -> Proceed to Login
                sessionStorage.setItem('access_granted', 'true');
                sessionStorage.setItem('just_passed_gate', 'true');
                navigate('/login', { state: { email } });
            } else {
                // User denied -> Redirect to Waitlist
                navigate('/join-waitlist', { state: { email } });
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred.');
        } finally {
            setIsChecking(false);
        }
    };

    const handleManualReferral = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualCode.trim()) {
            navigate(`/ref/${manualCode.trim()}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4 pt-24">
            <div className="absolute inset-0 bg-gradient-radial from-yellow-500/5 to-transparent blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <Card variant="premium" className="backdrop-blur-xl bg-black/60 border-gray-800">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mb-4 border border-yellow-400/30">
                            <FaLock className="text-yellow-400 text-xl" />
                        </div>
                        <Heading level={2} className="bg-gradient-to-r from-yellow-100 to-yellow-500 bg-clip-text text-transparent">
                            Access Gate
                        </Heading>
                        <Text color="muted" variant="small" className="mt-2">
                            This platform is currently invite-only. Please verify your email to proceed.
                        </Text>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder="Enter your registered email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    variant="professional"
                                    className="bg-black/50"
                                />
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full h-12 text-base shadow-gold"
                                disabled={isChecking}
                            >
                                {isChecking ? <LoadingSpinner size="sm" color="gold" /> : (
                                    <span className="flex items-center gap-2">
                                        Verify Access <FaArrowRight />
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-800 text-center space-y-4">
                            {!showReferralInput ? (
                                <Text variant="small" color="muted">
                                    Have a referral code?{' '}
                                    <button
                                        onClick={() => setShowReferralInput(true)}
                                        className="text-yellow-400 hover:text-yellow-300 underline underline-offset-2 bg-transparent border-none cursor-pointer"
                                    >
                                        Use it here
                                    </button>
                                </Text>
                            ) : (
                                <form onSubmit={handleManualReferral} className="animate-fade-in-up space-y-3">
                                    <Text variant="small" color="muted">Enter your invite code:</Text>
                                    <div className="flex gap-2">
                                        <Input
                                            type="text"
                                            placeholder="Code"
                                            value={manualCode}
                                            onChange={(e) => setManualCode(e.target.value)}
                                            className="bg-black/50 text-center uppercase tracking-widest"
                                        />
                                        <Button
                                            type="submit"
                                            disabled={!manualCode.trim()}
                                            variant="secondary"
                                        >
                                            Go
                                        </Button>
                                    </div>
                                    <button
                                        onClick={() => setShowReferralInput(false)}
                                        className="text-xs text-gray-500 hover:text-gray-300"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AccessGatePage;
