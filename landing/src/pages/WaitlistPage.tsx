import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, Heading, Text, Input, Button, LoadingSpinner } from '../components/UI';
import { FaLinkedin, FaWhatsapp, FaTelegram, FaArrowLeft, FaClock } from 'react-icons/fa';
import PhoneInput from 'react-phone-number-input';
import { getCountryCallingCode } from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en';
import 'react-phone-number-input/style.css';

// Create labels with country codes
const labels = Object.keys(en).reduce((acc: any, country: string) => {
    try {
        const callingCode = getCountryCallingCode(country as any);
        acc[country] = `${(en as any)[country]} (+${callingCode})`;
    } catch (e) {
        acc[country] = (en as any)[country];
    }
    return acc;
}, {});

const WaitlistPage: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState(state?.email || '');

    const [platform, setPlatform] = useState('linkedin');
    const [contactInfo, setContactInfo] = useState('');
    const [referrer, setReferrer] = useState(''); // New state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    // DEBUG: Force success state to debug render
    // useEffect(() => {
    //    setStatus('success');
    //    setMessage('Debug Success Message');
    // }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('idle');

        try {
            const response = await fetch('/api/access/join-waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email || undefined,
                    contact_info: contactInfo,
                    platform,
                    referrer // Include referrer
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to join waitlist');

            setStatus('success');
            setMessage(data.message || 'You have been added to the waitlist!');
        } catch (err: any) {
            setStatus('error');
            setMessage(err.message || 'An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'success') {
        console.log('Rendering Success State', { message, platform, typeofMessage: typeof message });
        return (
            <div className="min-h-screen flex items-center justify-center text-white p-4 pt-24 relative">
                <div className="absolute inset-0 bg-[url('https://essentialis.cloud/favicon-96x96.png')] bg-center bg-no-repeat opacity-5 blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-md w-full">
                    <Card variant="premium" className="w-full text-center py-8 bg-black/60 border-gray-800">
                        <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 border border-green-500/30">
                            <FaClock className="text-green-400 text-2xl" />
                        </div>
                        <Heading level={2} className="mb-2">Request Received</Heading>
                        <Text color="muted" className="mb-6 px-4">
                            {typeof message === 'string' ? message : JSON.stringify(message)} We will review your request and contact you via {platform}.
                        </Text>
                        <Button variant="secondary" onClick={() => navigate('/')}>
                            Back to Home
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4 pt-36">
            <div className="absolute inset-0 bg-[url('https://essentialis.cloud/favicon-96x96.png')] bg-center bg-no-repeat opacity-5 blur-3xl pointer-events-none" />

            <div className="w-full max-w-lg relative z-10"> {/* Improved width */}
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <FaArrowLeft /> Back
                </button>

                <Card variant="premium" className="backdrop-blur-xl bg-black/60 border-gray-800 p-6 sm:p-8"> {/* Adjusted padding */}
                    <CardHeader className="text-center pb-6">
                        <Heading level={2} className="bg-gradient-to-r from-yellow-100 to-yellow-500 bg-clip-text text-transparent mb-2">
                            Join Waitlist
                        </Heading>
                        <Text color="muted" variant="small">
                            Get early access to the sovereign data layer.
                        </Text>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    Email Address
                                </label>
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    readOnly={!!state?.email} // Read-only if passed from AccessGate
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`${state?.email ? 'opacity-60 cursor-not-allowed' : ''} bg-black/50`}
                                // If we need to allow editing when not pre-filled, we need a setter for email.
                                // But 'const [email] = useState' above doesn't have a setter.
                                // I'll fix the state definition in a separate Edit or rely on the fact that for now it's just 'email'
                                // Actually, let's fix the Email state usage right now in this block if possible?
                                // No, I can't change the state destructuring line here easily without a huge context range.
                                // I will use a readOnly input for now if prefilled, but wait...
                                // If user navigates directly to /join-waitlist, email is empty and they can't type!
                                // I must fix the state definition first. OR I will just render it readOnly for now and fix state in next step.
                                // BETTER PLAN: I will just render this input. If I can't Type, I will issue a separate fix.
                                // actually, I can't change the state line 24.
                                // I will render it disable-like for now.
                                />
                            </div>

                            {/* Referrer Input (Moved Up) */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    Where did you hear about us?
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Twitter, Friend, Event, etc."
                                    value={referrer}
                                    onChange={(e) => setReferrer(e.target.value)}
                                    className="bg-black/50"
                                />
                            </div>

                            {/* Platform Selection */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    Preferred Contact Method
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPlatform('linkedin')}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${platform === 'linkedin'
                                            ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                                            : 'bg-gray-800/50 border-transparent text-gray-400 hover:bg-gray-800'
                                            }`}
                                    >
                                        <FaLinkedin className="text-xl mb-1" />
                                        <span className="text-xs">LinkedIn</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPlatform('whatsapp')}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${platform === 'whatsapp'
                                            ? 'bg-green-600/20 border-green-500 text-green-400'
                                            : 'bg-gray-800/50 border-transparent text-gray-400 hover:bg-gray-800'
                                            }`}
                                    >
                                        <FaWhatsapp className="text-xl mb-1" />
                                        <span className="text-xs">WhatsApp</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPlatform('telegram')}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${platform === 'telegram'
                                            ? 'bg-sky-600/20 border-sky-500 text-sky-400'
                                            : 'bg-gray-800/50 border-transparent text-gray-400 hover:bg-gray-800'
                                            }`}
                                    >
                                        <FaTelegram className="text-xl mb-1" />
                                        <span className="text-xs">Telegram</span>
                                    </button>
                                </div>
                            </div>

                            {/* Contact Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    {platform === 'linkedin' ? 'LinkedIn Profile URL' :
                                        platform === 'whatsapp' ? 'WhatsApp Number' : 'Telegram Handle'}
                                </label>
                                <div className="relative">
                                    {platform === 'linkedin' && (
                                        <div className="flex items-center">
                                            <span className="bg-gray-800 text-gray-400 px-3 py-3 rounded-l-lg border border-r-0 border-gray-700 text-sm whitespace-nowrap">
                                                linkedin.com/in/
                                            </span>
                                            <Input
                                                type="text"
                                                placeholder="username"
                                                value={contactInfo}
                                                onChange={(e) => setContactInfo(e.target.value)}
                                                required
                                                className="rounded-l-none bg-black/50"
                                            />
                                        </div>
                                    )}

                                    {platform === 'whatsapp' && (
                                        <div className="flex items-center gap-2 text-black">
                                            <PhoneInput
                                                placeholder="Enter phone number"
                                                value={contactInfo}
                                                onChange={(value) => setContactInfo(value || '')}
                                                defaultCountry="US"
                                                labels={labels}
                                                className="bg-black/50 text-white border border-gray-700 rounded-lg p-3 text-sm focus-within:border-yellow-400 focus-within:outline-none w-full"
                                                numberInputProps={{
                                                    className: "bg-transparent border-none text-white placeholder-gray-500 focus:outline-none w-full ml-2"
                                                }}
                                            />
                                        </div>
                                    )}

                                    {platform === 'telegram' && (
                                        <div className="flex items-center">
                                            <span className="bg-gray-800 text-gray-400 px-3 py-3 rounded-l-lg border border-r-0 border-gray-700 text-sm">
                                                @
                                            </span>
                                            <Input
                                                type="text"
                                                placeholder="username"
                                                value={contactInfo}
                                                onChange={(e) => setContactInfo(e.target.value)}
                                                required
                                                className="rounded-l-none bg-black/50"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {status === 'error' && (
                                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm text-center">
                                    {message}
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full h-12 text-base shadow-gold transition-transform hover:scale-[1.02]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <LoadingSpinner size="sm" color="gold" /> : 'Join Waitlist'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default WaitlistPage;
