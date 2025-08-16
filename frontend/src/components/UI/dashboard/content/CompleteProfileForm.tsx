// src/components/dashboard/content/CompleteProfileForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardContext } from '../../../../pages/DashboardPage'; // Import context hook
import LoadingSpinner from '../../LoadingSpinner'; // Assuming spinner is separate

const API_BASE_URL = '/api';

const CompleteProfileForm = () => {
    const { profile, refreshProfile } = useDashboardContext(); // Get profile data and refresh function
    const navigate = useNavigate();

    const [userDetails, setUserDetails] = useState({ name: '', age: '', gender: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Pre-fill form with existing data when profile loads or changes
    useEffect(() => {
        if (profile) {
            setUserDetails({
                name: profile.name || '',
                age: profile.age ? String(profile.age) : '',
                gender: profile.gender || '',
            });
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUserDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('Saving...');

        // Add minimal validation if needed (e.g., name required)
        if (!userDetails.name) {
            setMessage("Error: Name is required to complete profile.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/user/details`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: userDetails.name,
                    age: userDetails.age === '' ? null : parseInt(userDetails.age, 10),
                    gender: userDetails.gender,
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to save details');

            setMessage('Profile updated successfully!');
            refreshProfile(); // Refresh profile data in DashboardPage state
            setTimeout(() => {
                // Redirect to dashboard home after successful save
                navigate('/dashboard', { replace: true });
            }, 1500);

        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-center">Complete Your Profile</h2>
            <p className="text-sm text-gray-400 mb-6 text-center">Please provide some basic details to continue.</p>
            {message && (
                <p className={`text-center text-sm mb-4 ${message.startsWith("Error") ? 'text-red-400' : 'text-green-400'}`}>
                    {message}
                </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Reusing form elements */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
                    <input className="input-field" type="text" id="name" name="name" value={userDetails.name} onChange={handleChange} placeholder="Full Name" required disabled={isLoading} />
                </div>
                <div>
                   <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">Age</label>
                   <input className="input-field" type="number" id="age" name="age" value={userDetails.age} onChange={handleChange} placeholder="Age" disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                    <select className="input-field" id="gender" name="gender" value={userDetails.gender} onChange={handleChange} disabled={isLoading}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                </div>
                <button type="submit" className="input-field" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner /> : null} Save & Continue
                </button>
            </form>
        </div>
    );
};

export default CompleteProfileForm;