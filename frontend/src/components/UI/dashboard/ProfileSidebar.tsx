// src/components/dashboard/ProfileSidebar.tsx
import React from 'react';
import type { UserProfileData } from '../../../pages/DashboardPage';
import JazziconAvatar from "../JazziconAvatas";
import { useActiveWallet } from "thirdweb/react";

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: UserProfileData | null;
}

const API_BASE_URL = '/api';

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ isOpen, onClose, profileData }) => {
  const baseClasses = "fixed top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out z-30 overflow-y-auto border-l border-gray-700/50";
  const openClasses = "translate-x-0";
  const closedClasses = "translate-x-full";
  const activeWallet = useActiveWallet();

  return (
    <aside className={`${baseClasses} ${isOpen ? openClasses : closedClasses}`}>
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-700/50">
        <h3 className="text-xl font-semibold text-white">Profile</h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
          aria-label="Close profile sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {profileData ? (
        <div className="p-6 space-y-6">
          {/* Avatar Section */}
          <div className="text-center">
            <div className="relative inline-block">
              <JazziconAvatar
                wallet={profileData.wallet_address}
                size={80}
                alt="Profile"
                className="w-20 h-20 rounded-2xl border-4 border-yellow-400/30"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            <h4 className="text-lg font-semibold text-white mt-4">
              {profileData.name || 'Anonymous User'}
            </h4>
            <p className="text-sm text-gray-400">Connected Wallet</p>
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Personal Information</p>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Full Name</p>
                  <p className="text-white font-medium">{profileData.name || 'Not Set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white font-medium">{profileData.email || 'Not Set'}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-400">Age</p>
                    <p className="text-white font-medium">{profileData.age || 'Not Set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Gender</p>
                    <p className="text-white font-medium capitalize">{profileData.gender || 'Not Set'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Wallet Information</p>
              <div>
                <p className="text-sm text-gray-400">Address</p>
                <p className="text-white font-mono text-sm break-all">
                  {profileData.wallet_address.slice(0, 6)}...{profileData.wallet_address.slice(-4)}
                </p>
                <button 
                  onClick={() => navigator.clipboard.writeText(profileData.wallet_address)}
                  className="text-xs text-yellow-400 hover:text-yellow-300 mt-1"
                >
                  Copy Full Address
                </button>
              </div>
            </div>
          </div>

          {/* Security Status */}
          <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl p-4 border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-green-400 font-medium text-sm">Secure Connection</p>
                <p className="text-green-300/70 text-xs">Your wallet is safely connected</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full bg-gray-700/50 hover:bg-gray-600/50 text-white font-medium py-3 px-4 rounded-xl border border-gray-600 hover:border-gray-500 transition-all duration-200">
              Edit Profile
            </button>
            <button
              onClick={async () => {
                if (activeWallet) {
                  await activeWallet.disconnect();
                }
                try {
                  await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
                } catch(e){ console.error("Backend logout failed", e)}
                sessionStorage.clear();
                localStorage.clear();
              }}
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-medium py-3 px-4 rounded-xl border border-red-500/20 hover:border-red-500/30 transition-all duration-200"
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-700 rounded-2xl mx-auto mb-4 animate-pulse"></div>
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default ProfileSidebar;