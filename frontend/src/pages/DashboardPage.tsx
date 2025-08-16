// src/pages/DashboardPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom'; // Outlet renders nested routes
import LeftSidebar from '../components/UI/dashboard/LeftSidebar';
import ProfileSidebar from '../components/UI/dashboard/ProfileSidebar';
import { useActiveAccount } from 'thirdweb/react'; // To get address for profile fetching
import LoadingSpinner from '../components/UI/LoadingSpinner'; // Assuming you have a loading spinner component
import JazziconAvatar from '../components/UI/JazziconAvatas'; // Assuming you have a JazziconAvatar component
const API_BASE_URL = '/api'; // Using proxy

// --- User Profile Data Type (adjust based on your actual data) ---
export interface UserProfileData {
  name: string | null;
  age: number | null;
  gender: string | null;
  email: string | null; // From backend
  wallet_address: string; // From backend
  profile_picture_url: string | null;
  // Add any other fields you fetch
}

const DashboardPage = () => {
  const account = useActiveAccount();
  const navigate = useNavigate();
  const location = useLocation(); // To check current path

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
            // Session expired or invalid, redirect to login
            navigate('/login');
            return; // Stop execution
        }
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }
      const data: UserProfileData = await response.json();
      console.log("DashboardPage: Profile data received:", data);
      setUserProfile(data);

      // --- Profile Completion Check ---
      // Determine if redirect to complete-profile is needed
      // Adjust this condition based on required fields (e.g., name is essential)
      const isProfileComplete = !!data.name; // Example: profile is complete if name exists

      // Only redirect if we are *not* already on the complete-profile page
      if (!isProfileComplete && location.pathname !== '/dashboard/complete-profile') {
        console.log("DashboardPage: Profile incomplete, redirecting to complete-profile");
        navigate('/dashboard/complete-profile', { replace: true }); // Use replace to avoid history loop
      } else if (isProfileComplete && location.pathname === '/dashboard/complete-profile') {
          // If profile is complete but user somehow landed on complete-profile, go to dashboard home
          console.log("DashboardPage: Profile complete, navigating away from complete-profile");
          navigate('/dashboard', { replace: true });
      }
      // Otherwise, stay on the current dashboard page (or the default index)

    } catch (error: any) {
      console.error("DashboardPage: Error fetching profile", error);
      setProfileError(`Error loading profile: ${error.message}`);
      // Handle error appropriately, maybe show an error message to the user
    } finally {
      setIsLoadingProfile(false);
    }
  }, [navigate, location.pathname]); // Add location.pathname

  // Fetch profile when the component mounts or account changes
  useEffect(() => {
    if (account?.address) { // Only fetch if account is connected
        fetchUserProfile();
    } else {
        // Handle case where account disconnects while on dashboard? Maybe redirect via ProtectedRoute
        setIsLoadingProfile(false);
        setUserProfile(null);
    }
  }, [account, fetchUserProfile]); // Rerun if account changes

  const toggleProfileSidebar = () => {
    setIsProfileSidebarOpen(!isProfileSidebarOpen);
  };

  // Callback to refresh profile data after it's updated (e.g., by CompleteProfileForm)
  const refreshProfile = () => {
      fetchUserProfile();
  };

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white overflow-hidden">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col overflow-hidden">
        {/* Optional Header within Main Content (for PFP toggle) */}
        <header className="bg-black shadow-md p-3 flex justify-end items-center flex-shrink-0">
           {isLoadingProfile ? (
                <div className="h-10 w-10 rounded-full bg-gray-700 animate-pulse"></div>
           ) : userProfile ? (
               <JazziconAvatar wallet={userProfile.wallet_address} size={64} alt="Profile" className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-600 hover:border-indigo-500 transition-colors" onClick={toggleProfileSidebar}/>
           ) : (
                <div className="h-10 w-10 rounded-full bg-gray-600 text-xs flex items-center justify-center">?</div> // Placeholder if no profile
           )}
        </header>

        {/* Content Outlet - where nested routes render */}
        <div className="flex-grow overflow-y-auto p-6">
          {isLoadingProfile ? (
            <div className="flex justify-center items-center h-full">
              <LoadingSpinner className='text-white'/> <span className="ml-3">Loading Profile...</span>
            </div>
          ) : profileError ? (
             <div className="text-center text-red-400">{profileError}</div>
          ) : (
            // Pass refreshProfile down if CompleteProfileForm needs it
            // Providing profile data via context might be cleaner for deeply nested components
            <Outlet context={{ profile: userProfile, refreshProfile }} />
          )}
        </div>
      </main>

      {/* Right Profile Sidebar (Conditional Rendering with Transition) */}
      <ProfileSidebar
        isOpen={isProfileSidebarOpen}
        onClose={toggleProfileSidebar}
        profileData={userProfile} // Pass fetched profile data
      />

    </div>
  );
};

export default DashboardPage;

// Helper hook for nested routes to access context (optional but clean)
import { useOutletContext } from 'react-router-dom';

export function useDashboardContext() {
  return useOutletContext<{ profile: UserProfileData | null; refreshProfile: () => void }>();
}