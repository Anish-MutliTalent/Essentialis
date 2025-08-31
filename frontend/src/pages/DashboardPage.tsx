// src/pages/DashboardPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import LeftSidebar from '../components/UI/dashboard/LeftSidebar';
import ProfileSidebar from '../components/UI/dashboard/ProfileSidebar';
import { useActiveAccount } from 'thirdweb/react';
import { LoadingSpinner, Text, Heading } from '../components/UI';
import JazziconAvatar from '../components/UI/JazziconAvatas';

const API_BASE_URL = '/api';

// --- User Profile Data Type ---
export interface UserProfileData {
  name: string | null;
  age: number | null;
  gender: string | null;
  email: string | null;
  wallet_address: string;
  profile_picture_url: string | null;
}

const DashboardPage = () => {
  const account = useActiveAccount();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    console.log("DashboardPage: Fetching user profile...");
    setIsLoadingProfile(true);
    setProfileError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/user/details`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        if (response.status === 401) {
            navigate('/login');
            return;
        }
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }
      const data: UserProfileData = await response.json();
      console.log("DashboardPage: Profile data received:", data);
      setUserProfile(data);

      // --- Profile Completion Check ---
      const isProfileComplete = !!data.name;

      if (!isProfileComplete && location.pathname !== '/dashboard/complete-profile') {
        console.log("DashboardPage: Profile incomplete, redirecting to complete-profile");
        navigate('/dashboard/complete-profile', { replace: true });
      } else if (isProfileComplete && location.pathname === '/dashboard/complete-profile') {
          console.log("DashboardPage: Profile complete, navigating away from complete-profile");
          navigate('/dashboard', { replace: true });
      }

    } catch (error: any) {
      console.error("DashboardPage: Error fetching profile", error);
      setProfileError(`Error loading profile: ${error.message}`);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (account?.address) {
        fetchUserProfile();
    } else {
        setIsLoadingProfile(false);
        setUserProfile(null);
    }
  }, [account, fetchUserProfile]);

  const toggleProfileSidebar = () => {
    setIsProfileSidebarOpen(!isProfileSidebarOpen);
  };

  const refreshProfile = () => {
      fetchUserProfile();
  };

  return (
    <div className="flex h-screen w-screen bg-black text-white overflow-hidden">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col overflow-hidden bg-gray-900/20">
        {/* Header with Profile Avatar */}
        <header className="bg-gray-900/50 backdrop-blur-professional border-b border-gray-800 shadow-professional p-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center space-x-4">
            <Heading level={4} className="gradient-gold-text">
              Dashboard
            </Heading>
            {userProfile?.name && (
              <Text variant="small" color="muted">
                Welcome back, {userProfile.name}
              </Text>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {isLoadingProfile ? (
              <div className="h-12 w-12 rounded-full bg-gray-800 animate-pulse border border-gray-700"></div>
            ) : userProfile ? (
              <div className="relative group">
                <JazziconAvatar 
                  wallet={userProfile.wallet_address} 
                  size={64} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full cursor-pointer border-2 border-gray-700 hover:border-yellow-400/50 transition-all-smooth shadow-professional hover:shadow-gold" 
                  onClick={toggleProfileSidebar}
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                
                {/* Tooltip */}
                <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-gray-900/90 backdrop-blur-professional border border-gray-700 rounded-lg text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Click to view profile
                </div>
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-800 border-2 border-gray-700 text-gray-400 flex items-center justify-center text-sm font-medium">
                ?
              </div>
            )}
          </div>
        </header>

        {/* Content Outlet */}
        <div className="flex-grow overflow-y-auto p-8">
          {isLoadingProfile ? (
            <div className="flex flex-col justify-center items-center h-full space-y-4">
              <div className="relative">
                <LoadingSpinner size="lg" color="gold" />
                <div className="absolute inset-0 w-16 h-16 bg-yellow-400/10 rounded-full animate-pulse-gold"></div>
              </div>
              <div className="text-center space-y-2">
                <Text variant="lead" color="muted">Loading your profile...</Text>
                <Text variant="small" color="muted">Please wait while we fetch your information</Text>
              </div>
            </div>
          ) : profileError ? (
            <div className="flex flex-col justify-center items-center h-full space-y-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-center space-y-2">
                <Heading level={3} className="text-red-400">Profile Error</Heading>
                <Text color="muted" className="max-w-md">
                  {profileError}
                </Text>
                <button 
                  onClick={fetchUserProfile}
                  className="mt-4 px-6 py-2 bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 rounded-lg hover:bg-yellow-400/30 transition-all-smooth"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <Outlet context={{ profile: userProfile, refreshProfile }} />
          )}
        </div>
      </main>

      {/* Right Profile Sidebar */}
      <ProfileSidebar
        isOpen={isProfileSidebarOpen}
        onClose={toggleProfileSidebar}
        profileData={userProfile}
      />
    </div>
  );
};

export default DashboardPage;

// Helper hook for nested routes to access context
import { useOutletContext } from 'react-router-dom';

export function useDashboardContext() {
  return useOutletContext<{ profile: UserProfileData | null; refreshProfile: () => void }>();
}