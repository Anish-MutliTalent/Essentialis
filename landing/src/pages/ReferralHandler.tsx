import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingSpinner, Text, Card } from '../components/UI';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const ReferralHandler: React.FC = () => {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'validating' | 'success' | 'error'>('validating');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!code) {
            setStatus('error');
            setError('No referral code provided.');
            return;
        }

        const validateCode = async () => {
            try {
                const response = await fetch('/api/access/validate-referral', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code }),
                });

                const data = await response.json();

                if (response.ok && data.valid) {
                    setStatus('success');
                    // Store a flag or token indicating this session is "referral-verified"
                    // For now, we trust the flow; in a strict app, backend would issue a secure token.
                    sessionStorage.setItem('access_granted', 'true');
                    sessionStorage.setItem('referral_code', code);

                    setTimeout(() => {
                        navigate('/login', { replace: true, state: { referralCode: code } });
                    }, 1500);
                } else {
                    throw new Error(data.error || 'Invalid code');
                }
            } catch (err: any) {
                setStatus('error');
                setError(err.message || 'Validation failed');
            }
        };

        validateCode();
    }, [code, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="text-center">
                {status === 'validating' && (
                    <div className="flex flex-col items-center space-y-4">
                        <LoadingSpinner size="lg" color="gold" />
                        <Text color="muted">Validating referral code...</Text>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center space-y-4 animate-fade-in-up">
                        <FaCheckCircle className="text-5xl text-green-400" />
                        <Text weight="bold" size="lg">Access Granted</Text>
                        <Text color="muted">Redirecting to login...</Text>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center space-y-4 animate-fade-in-up">
                        <FaExclamationCircle className="text-5xl text-red-400" />
                        <Text weight="bold" size="lg" className="text-red-400">Access Denied</Text>
                        <Text color="muted">{error}</Text>
                        <button
                            onClick={() => navigate('/access')}
                            className="mt-4 px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
                        >
                            Go to Access Gate
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReferralHandler;
