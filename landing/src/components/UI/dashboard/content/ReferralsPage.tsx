import React, { useEffect, useState } from 'react';
import { Card, Heading, Text, Button, LoadingSpinner } from '../../index';
import { FaCopy, FaCheck, FaUsers, FaMousePointer, FaEnvelope } from 'react-icons/fa';

interface ReferralData {
    referral_code: string;
    landing_count: number;
    waitlist_count: number;
    signup_list: string[];
    created_at: string | null;
}

const ReferralsPage: React.FC = () => {
    const [data, setData] = useState<ReferralData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchReferralData();
    }, []);

    const fetchReferralData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/user/referral', { credentials: 'include' });
            if (!res.ok) throw new Error('Failed to load referral data');
            const json = await res.json();
            setData(json);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const copyLink = () => {
        if (!data) return;
        const link = `${window.location.origin}/?ref=${data.referral_code}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" color="gold" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <Text color="muted">{error}</Text>
                <Button variant="secondary" onClick={fetchReferralData} className="mt-4">
                    Retry
                </Button>
            </div>
        );
    }

    if (!data) return null;

    const referralLink = `${window.location.origin}/?ref=${data.referral_code}`;

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <Heading level={2} className="text-yellow-400">Refer & Earn</Heading>
            <Text color="muted">
                Share your referral link to invite others to join the Essentialis waitlist. Track your impact below.
            </Text>

            {/* Referral Link Card */}
            <Card variant="premium" className="bg-gray-900/50 border-gray-800 p-6">
                <div className="space-y-4">
                    <Heading level={4}>Your Referral Link</Heading>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-gray-300 truncate">
                            {referralLink}
                        </div>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={copyLink}
                            className="flex items-center gap-2 whitespace-nowrap"
                        >
                            {copied ? (
                                <>
                                    <FaCheck /> Copied!
                                </>
                            ) : (
                                <>
                                    <FaCopy /> Copy
                                </>
                            )}
                        </Button>
                    </div>
                    <Text variant="small" color="muted">
                        Share this link with friends. When they visit and join the waitlist, it counts toward your referrals.
                    </Text>
                </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card variant="premium" className="bg-gray-900/50 border-gray-800 p-6 text-center">
                    <div className="w-12 h-12 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-yellow-400/20">
                        <FaMousePointer className="text-yellow-400 text-xl" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{data.landing_count}</div>
                    <Text color="muted" variant="small">Landing Page Visits</Text>
                </Card>
                <Card variant="premium" className="bg-gray-900/50 border-gray-800 p-6 text-center">
                    <div className="w-12 h-12 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-400/20">
                        <FaUsers className="text-green-400 text-xl" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{data.waitlist_count}</div>
                    <Text color="muted" variant="small">Waitlist Signups</Text>
                </Card>
            </div>

            {/* Signup List */}
            <Card variant="premium" className="bg-gray-900/50 border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                    <Heading level={4}>Referred Signups</Heading>
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                        {data.signup_list.length} total
                    </span>
                </div>
                {data.signup_list.length === 0 ? (
                    <Text color="muted" className="text-center py-6">
                        No signups yet. Share your link to get started!
                    </Text>
                ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {data.signup_list.map((email, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 bg-gray-800/40 px-4 py-2.5 rounded-lg border border-gray-700/50"
                            >
                                <FaEnvelope className="text-gray-500 flex-shrink-0" />
                                <span className="text-sm text-gray-300 truncate">{email}</span>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ReferralsPage;
