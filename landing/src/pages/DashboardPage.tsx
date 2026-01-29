// src/pages/DashboardPage.tsx
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import LeftSidebar from '../components/UI/dashboard/LeftSidebar';
import ProfileSidebar from '../components/UI/dashboard/ProfileSidebar';
import { useActiveAccount } from 'thirdweb/react';
import { LoadingSpinner, Text, Heading } from '../components/UI';
import JazziconAvatar from '../components/UI/JazziconAvatas';
import { AlertCircle, Menu } from 'lucide-react';

const API_BASE_URL = '/api';

// --- User Profile Data Type ---
export interface UserProfileData {
  name: string | null;
  age: number | null;
  gender: string | null;
  email: string | null;
  wallet_address: string;
  profile_picture_url: string | null;
  is_admin?: boolean;
}

// --- Context Setup ---
interface DashboardContextValue {
  profile: UserProfileData | null;
  refreshProfile: () => void;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export function useDashboardContext() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboardContext must be used inside DashboardPage");
  return ctx;
}

// --- Main Component ---
const DashboardPage = () => {
  const account = useActiveAccount();
  const navigate = useNavigate();

  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    // Reset states before fetching
    setError(null);
    setIsLoadingInitial(true);

    if (!account?.address) {
      setProfile(null);
      setIsLoadingInitial(false);
      return;
    }

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
      console.log("DashboardPage: Fetched Profile:", data);
      setProfile(data);

      // --- Profile Completion Check ---
      const isProfileComplete = !!data.name;
      const currentPath = window.location.pathname;

      if (!isProfileComplete && currentPath !== '/dashboard/complete-profile') {
        navigate('/dashboard/complete-profile', { replace: true });
      } else if (isProfileComplete && currentPath === '/dashboard/complete-profile') {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(`Error loading profile: ${err.message}`);
    } finally {
      setIsLoadingInitial(false);
    }
  }, [account, navigate]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const toggleProfileSidebar = () => setIsProfileSidebarOpen(!isProfileSidebarOpen);
  const toggleLeftSidebar = () => setIsLeftSidebarOpen(!isLeftSidebarOpen);

  const contextValue: DashboardContextValue = {
    profile,
    refreshProfile: fetchUserProfile,
  };

  // --- Only block rendering on very first load ---
  if (isLoadingInitial) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center space-y-6 text-center">
          <LoadingSpinner size="lg" color="gold" />
          <Text variant="lead" color="muted">Loading your profile...</Text>
          <Text variant="small" color="muted">Please wait while we fetch your information</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <Heading level={3} className="text-red-400">Profile Error</Heading>
          <Text color="muted">{error}</Text>
          <button
            onClick={fetchUserProfile}
            className="mt-2 px-6 py-2 bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 rounded-lg hover:bg-yellow-400/30 transition-all-smooth"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="flex h-screen w-screen bg-black text-white overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar
          isOpen={isLeftSidebarOpen}
          onClose={() => setIsLeftSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col overflow-hidden bg-gray-900/20">
          {/* Header with Profile Avatar */}
          <header className="bg-gray-900/50 backdrop-blur-professional border-b border-gray-800 shadow-professional p-3 sm:p-4 flex justify-between items-center flex-shrink-0">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleLeftSidebar}
              className="lg:hidden p-2 text-gray-400 hover:text-yellow-400 transition-colors-smooth"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Heading level={4} className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent text-lg sm:text-xl">
                Dashboard
              </Heading>
              {profile?.name && (
                <Text variant="small" color="muted" className="hidden sm:block">
                  Welcome back, {profile.name}
                </Text>
              )}
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              {profile ? (
                <div className="relative group">
                  <JazziconAvatar
                    wallet={profile.wallet_address}
                    size={64}
                    alt="Profile"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full cursor-pointer border-2 border-gray-700 hover:border-yellow-400/50 transition-all-smooth shadow-professional hover:shadow-gold"
                    onClick={toggleProfileSidebar}
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>

                  {/* Tooltip */}
                  <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-gray-900/90 backdrop-blur-professional border border-gray-700 rounded-lg text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Click to view profile
                  </div>
                </div>
              ) : (
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-800 border-2 border-gray-700 text-gray-400 flex items-center justify-center text-sm font-medium">
                  ?
                </div>
              )}
            </div>
          </header>

          {/* Content Outlet */}
          <div className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>

        {/* Right Profile Sidebar */}
        <ProfileSidebar
          isOpen={isProfileSidebarOpen}
          onClose={toggleProfileSidebar}
          profileData={profile}
        />
      </div>
    </DashboardContext.Provider>
  );
};

export default DashboardPage;