// CompleteProfileForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardContext } from '../../../../pages/DashboardPage';
import { Button, Input, Card, CardHeader, CardContent, Heading, Text } from '../../index';

interface UserDetails {
  name: string;
  age: number | '';
  gender: string;
}

const CompleteProfileForm: React.FC = () => {
  const { profile, refreshProfile } = useDashboardContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: profile?.name || '',
    age: profile?.age || '',
    gender: profile?.gender || ''
  });

  useEffect(() => {
    if (profile) {
      setUserDetails({
        name: profile.name || '',
        age: profile.age || '',
        gender: profile.gender || ''
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: name === 'age' ? (value === '' ? '' : parseInt(value)) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userDetails),
      });

      if (response.ok) {
        setMessage({ text: 'Profile completed successfully!', type: 'success' });
        await refreshProfile();
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage({ text: `Error: ${errorData.message || 'Failed to complete profile'}`, type: 'error' });
      }
    } catch (error: any) {
      setMessage({ text: `Error: ${error.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card variant="premium">
        <CardHeader className="text-center">
          <Heading level={2} className="gradient-gold-text">
            Complete Your Profile
          </Heading>
          <Text color="muted" className="mt-2">
            Please provide your details to continue
          </Text>
        </CardHeader>

        <CardContent>
          {message && (
            <div className={`text-center text-sm p-3 rounded-lg mb-4 ${
              message.type === 'error' 
                ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
                : 'bg-green-500/20 border border-green-500/30 text-green-400'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={userDetails.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                disabled={isLoading}
                variant="professional"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="age" className="block text-sm font-medium text-gray-300">
                Age
              </label>
              <Input
                type="number"
                id="age"
                name="age"
                value={userDetails.age}
                onChange={handleChange}
                placeholder="Enter your age"
                disabled={isLoading}
                variant="professional"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={userDetails.gender}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-900/30 border border-gray-800 rounded-lg text-white placeholder-gray-400 transition-all-smooth focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 disabled:opacity-50"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              variant="primary"
              size="lg"
              className="w-full"
              loading={isLoading}
            >
              {isLoading ? 'Completing Profile...' : 'Complete Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteProfileForm;