// src/components/dashboard/ProfileSidebar.tsx
import React from 'react';
import type { UserProfileData } from '../../../pages/DashboardPage'; // Import the type
import JazziconAvatar from "../JazziconAvatas";
import { useActiveWallet } from "thirdweb/react";

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: UserProfileData | null;
}

const API_BASE_URL = '/api'; // Your Flask backend URL

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ isOpen, onClose, profileData }) => {
  // Base classes for the sidebar
  const baseClasses = "fixed top-0 right-0 h-full w-80 bg-gray-800 shadow-lg p-6 transform transition-transform duration-300 ease-in-out z-30 overflow-y-auto";
  // Classes to apply when open or closed
  const openClasses = "translate-x-0";
  const closedClasses = "translate-x-full"; // Moves it off-screen to the right
  const activeWallet = useActiveWallet();

  return (
    <aside className={`${baseClasses} ${isOpen ? openClasses : closedClasses}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Profile Details</h3>
        <button
          onClick={onClose}
          className="text-red-500 hover:text-black focus:outline-none"
          aria-label="Close profile sidebar"
        >
          {/* Simple X icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {profileData ? (
        <div className="space-y-4 text-gray-300">
           <div className="flex justify-center mb-4">
                <JazziconAvatar
                  wallet={profileData.wallet_address}
                  size={64}
                  alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover"
                />
           </div>
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg">{profileData.name || 'Not Set'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg">{profileData.email || 'Not Set'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Wallet Address</p>
            <p className="text-lg break-all">{profileData.wallet_address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Age</p>
            <p className="text-lg">{profileData.age || 'Not Set'}</p>
          </div>
           <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="text-lg capitalize">{profileData.gender || 'Not Set'}</p>
          </div>
          {/* Add a Disconnect/Logout Button */}
              <button
                  onClick={async () => {
                      if (activeWallet) {
                          await activeWallet.disconnect();
                      }
                      try {
                         await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
                      } catch(e){ console.error("Backend logout failed", e)}
                      // Clear session storage flag
                      sessionStorage.clear();
                      localStorage.clear();
                  }}
                  className="w-full button hover:bg-gray mt-4 text-red-500"
                >
                Disconnect Wallet
                </button>
        </div>
      ) : (
        <p className="text-gray-400">Loading profile...</p>
      )}
    </aside>
  );
};

export default ProfileSidebar;