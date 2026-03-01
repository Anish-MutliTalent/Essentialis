import React, { useEffect, useState } from 'react';
import { Card, Heading, Text, Button, Input, LoadingSpinner } from '../components/UI';
import { FaUserPlus, FaTicketAlt, FaCheck, FaExclamationTriangle, FaSync, FaShareAlt } from 'react-icons/fa';

interface ReferralCode {
    id: number;
    code: string;
    uses: string;
    active: boolean;
    expires: string;
}

interface WaitlistEntry {
    id: number;
    email?: string;
    contact_info: string;
    platform: string;
    created_at: string;
}

interface UserReferralEntry {
    id: number;
    user_email?: string;
    user_wallet?: string;
    referral_code: string;
    landing_count: number;
    waitlist_count: number;
    signup_list: string[];
    created_at: string | null;
}

const AdminPanelPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'waitlist' | 'referrals' | 'user-referrals'>('waitlist');
    const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
    const [referrals, setReferrals] = useState<ReferralCode[]>([]);
    const [userReferrals, setUserReferrals] = useState<UserReferralEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newCodeDays, setNewCodeDays] = useState(7);
    const [newCodeUses, setNewCodeUses] = useState(1);
    const [customCode, setCustomCode] = useState('');

    const fetchWaitlist = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/waitlist');
            if (res.ok) setWaitlist(await res.json());
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchReferrals = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/referrals');
            if (res.ok) setReferrals(await res.json());
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const approveUser = async (id: number) => {
        try {
            const res = await fetch('/api/admin/approve-waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                setWaitlist(prev => prev.filter(e => e.id !== id));
                alert('User approved!');
            } else {
                const d = await res.json();
                alert(d.error || 'Failed');
            }
        } catch (e) {
            alert('Error approving');
        }
    };

    const generateCode = async () => {
        try {
            const res = await fetch('/api/admin/generate-referral', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: customCode || undefined,
                    max_uses: newCodeUses,
                    days_valid: newCodeDays
                }),
            });
            if (res.ok) {
                setCustomCode('');
                fetchReferrals();
                alert('Code generated!');
            } else {
                const d = await res.json();
                alert(d.error || 'Failed');
            }
        } catch (e) {
            alert('Error generating');
        }
    };

    useEffect(() => {
        if (activeTab === 'waitlist') fetchWaitlist();
        else if (activeTab === 'referrals') fetchReferrals();
        else if (activeTab === 'user-referrals') fetchUserReferrals();
    }, [activeTab]);

    const fetchUserReferrals = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/user-referrals');
            if (res.ok) setUserReferrals(await res.json());
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Heading level={2} className="text-yellow-400">Admin Portal</Heading>
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant={activeTab === 'waitlist' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('waitlist')}
                        size="sm"
                    >
                        <FaUserPlus className="mr-2" /> Waitlist
                    </Button>
                    <Button
                        variant={activeTab === 'referrals' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('referrals')}
                        size="sm"
                    >
                        <FaTicketAlt className="mr-2" /> Referrals
                    </Button>
                    <Button
                        variant={activeTab === 'user-referrals' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('user-referrals')}
                        size="sm"
                    >
                        <FaShareAlt className="mr-2" /> User Referrals
                    </Button>
                </div>
            </div>

            <Card variant="premium" className="bg-gray-900/50 border-gray-800 min-h-[500px]">
                {activeTab === 'waitlist' && (
                    <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <Heading level={3}>Pending Requests</Heading>
                            <Button size="sm" variant="outline" onClick={fetchWaitlist}>
                                <FaSync className={isLoading ? "animate-spin" : ""} />
                            </Button>
                        </div>

                        {waitlist.length === 0 ? (
                            <Text color="muted" className="text-center py-10">No pending requests.</Text>
                        ) : (
                            <div className="space-y-3">
                                {waitlist.map((entry) => (
                                    <div key={entry.id} className="flex flex-col md:flex-row justify-between items-center bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                        <div className="mb-3 md:mb-0">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs px-2 py-0.5 rounded capitalize ${entry.platform === 'linkedin' ? 'bg-blue-900 text-blue-200' :
                                                    entry.platform === 'whatsapp' ? 'bg-green-900 text-green-200' :
                                                        'bg-sky-900 text-sky-200'
                                                    }`}>
                                                    {entry.platform}
                                                </span>
                                                <span className="text-gray-400 text-xs">{new Date(entry.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="font-medium text-white">{entry.contact_info}</div>
                                            {entry.email && <div className="text-sm text-gray-400">{entry.email}</div>}
                                        </div>
                                        <div className="flex gap-2">
                                            <a
                                                href={
                                                    entry.platform === 'linkedin' ? entry.contact_info :
                                                        entry.platform === 'whatsapp' ? `https://wa.me/${entry.contact_info.replace(/[^0-9]/g, '')}` : '#'
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded text-white"
                                            >
                                                Visit/Contact
                                            </a>
                                            {entry.email ? (
                                                <Button size="sm" variant="success" onClick={() => approveUser(entry.id)}>
                                                    <FaCheck className="mr-1" /> Approve
                                                </Button>
                                            ) : (
                                                <div className="flex items-center text-yellow-500 text-xs px-2 bg-yellow-900/20 rounded border border-yellow-900/50">
                                                    <FaExclamationTriangle className="mr-1" /> No Email
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'referrals' && (
                    <div className="p-4 space-y-6">
                        {/* Generator */}
                        <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700 space-y-4">
                            <Heading level={4}>Generate New Code</Heading>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400">Custom Code (Optional)</label>
                                    <Input
                                        placeholder="Auto-generate"
                                        value={customCode}
                                        onChange={e => setCustomCode(e.target.value)}
                                        variant="professional"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400">Max Uses (-1 for ∞)</label>
                                    <Input
                                        type="number"
                                        value={newCodeUses}
                                        onChange={e => setNewCodeUses(parseInt(e.target.value))}
                                        variant="professional"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400">Days Valid</label>
                                    <Input
                                        type="number"
                                        value={newCodeDays}
                                        onChange={e => setNewCodeDays(parseInt(e.target.value))}
                                        variant="professional"
                                    />
                                </div>
                            </div>
                            <Button onClick={generateCode} variant="primary" className="w-full md:w-auto">
                                Generate Code
                            </Button>
                        </div>

                        {/* List */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center mb-2">
                                <Heading level={4}>Active Codes</Heading>
                                <Button size="sm" variant="outline" onClick={fetchReferrals}>
                                    <FaSync className={isLoading ? "animate-spin" : ""} />
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-gray-800 text-gray-200 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-2">Code</th>
                                            <th className="px-4 py-2">Uses</th>
                                            <th className="px-4 py-2">Status</th>
                                            <th className="px-4 py-2">Expires</th>
                                            <th className="px-4 py-2">Link</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {referrals.map((code) => (
                                            <tr key={code.id} className="hover:bg-gray-800/30">
                                                <td className="px-4 py-3 font-mono text-yellow-400">{code.code}</td>
                                                <td className="px-4 py-3">{code.uses}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded text-xs ${code.active ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                                                        {code.active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">{new Date(code.expires).toLocaleDateString()}</td>
                                                <td className="px-4 py-3">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="bg-transparent border border-gray-700 hover:bg-gray-700 text-xs py-1 h-auto"
                                                        onClick={() => {
                                                            const link = `${window.location.origin}/ref/${code.code}`;
                                                            navigator.clipboard.writeText(link);
                                                            alert('Copied: ' + link);
                                                        }}
                                                    >
                                                        Copy Link
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'user-referrals' && (
                    <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <Heading level={3}>User Referral Stats</Heading>
                            <Button size="sm" variant="outline" onClick={fetchUserReferrals}>
                                <FaSync className={isLoading ? "animate-spin" : ""} />
                            </Button>
                        </div>

                        {userReferrals.length === 0 ? (
                            <Text color="muted" className="text-center py-10">No user referrals yet.</Text>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-gray-800 text-gray-200 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-2">User</th>
                                            <th className="px-4 py-2">Code</th>
                                            <th className="px-4 py-2">Landings</th>
                                            <th className="px-4 py-2">Signups</th>
                                            <th className="px-4 py-2">Referred Emails</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {userReferrals.map((entry) => (
                                            <tr key={entry.id} className="hover:bg-gray-800/30">
                                                <td className="px-4 py-3">
                                                    <div className="text-white text-sm">{entry.user_email || 'N/A'}</div>
                                                    {entry.user_wallet && (
                                                        <div className="text-xs text-gray-500 font-mono truncate max-w-[150px]">
                                                            {entry.user_wallet}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 font-mono text-yellow-400">{entry.referral_code}</td>
                                                <td className="px-4 py-3 text-center">{entry.landing_count}</td>
                                                <td className="px-4 py-3 text-center">{entry.waitlist_count}</td>
                                                <td className="px-4 py-3">
                                                    {entry.signup_list.length === 0 ? (
                                                        <span className="text-gray-500">—</span>
                                                    ) : (
                                                        <div className="space-y-1 max-h-20 overflow-y-auto">
                                                            {entry.signup_list.map((email, i) => (
                                                                <div key={i} className="text-xs text-gray-300">{email}</div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AdminPanelPage;
