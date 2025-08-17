// src/pages/DashboardPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import LeftSidebar from '../components/UI/dashboard/LeftSidebar';
import ProfileSidebar from '../components/UI/dashboard/ProfileSidebar';
import { useActiveAccount } from 'thirdweb/react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import JazziconAvatar from '../components/UI/JazziconAvatas';

const API_BASE_URL = '/api';

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
    <div className="flex h-screen w-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 p-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white">
              {location.pathname === '/dashboard' && 'Dashboard'}
              {location.pathname === '/dashboard/my-docs' && 'My Documents'}
              {location.pathname === '/dashboard/settings' && 'Settings'}
              {location.pathname === '/dashboard/mint-doc' && 'New Document'}
              {location.pathname === '/dashboard/complete-profile' && 'Complete Profile'}
              {location.pathname.includes('/view') && 'Document Viewer'}
              {location.pathname.includes('/edit') && 'Edit Document'}
              {location.pathname.includes('/history') && 'Document History'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v2.25a2.25 2.25 0 0 1-2.25 2.25H7.5a2.25 2.25 0 0 1-2.25-2.25V9.75a6 6 0 0 1 6-6z" />
              </svg>
            </button>

            {/* Profile Avatar */}
            {isLoadingProfile ? (
                <div className="h-10 w-10 rounded-xl bg-gray-700 animate-pulse"></div>
           ) : userProfile ? (
               <button 
                 onClick={toggleProfileSidebar}
                 className="relative group"
               >
                 <JazziconAvatar 
                   wallet={userProfile.wallet_address} 
                   size={40} 
                   alt="Profile" 
                   className="w-10 h-10 rounded-xl border-2 border-gray-600 group-hover:border-yellow-400/50 transition-all duration-200"
                 />
                 <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
               </button>
           ) : (
                <div className="h-10 w-10 rounded-xl bg-gray-600 text-xs flex items-center justify-center">?</div>
           )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto">
          <div className="p-6">
            {isLoadingProfile ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <LoadingSpinner className='text-white mb-4'/> 
                  <span className="text-gray-300">Loading your profile...</span>
                </div>
              </div>
            ) : profileError ? (
               <div className="text-center text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-8">
                 <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                 </svg>
                 {profileError}
               </div>
            ) : (
              <Outlet context={{ profile: userProfile, refreshProfile }} />
            )}
          </div>
        </div>
      </main>

      {/* Profile Sidebar */}
      <ProfileSidebar
        isOpen={isProfileSidebarOpen}
        onClose={toggleProfileSidebar}
        profileData={userProfile}
      />

      {/* Overlay for mobile */}
      {isProfileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={toggleProfileSidebar}
        />
      )}
    </div>
  );
};

export default DashboardPage;

// Helper hook for nested routes to access context
import { useOutletContext } from 'react-router-dom';

export function useDashboardContext() {
  return useOutletContext<{ profile: UserProfileData | null; refreshProfile: () => void }>();
}