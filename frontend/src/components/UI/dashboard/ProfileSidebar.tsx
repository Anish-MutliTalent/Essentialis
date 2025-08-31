// src/components/dashboard/ProfileSidebar.tsx
import React from 'react';
import type { UserProfileData } from '../../../pages/DashboardPage';
import JazziconAvatar from "../JazziconAvatas";
import { useActiveWallet } from "thirdweb/react";
import { Button, Heading, Text, Card, CardContent } from '../index';

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: UserProfileData | null;
}

const API_BASE_URL = '/api';

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ isOpen, onClose, profileData }) => {
  const activeWallet = useActiveWallet();

  return (
    <aside className={`fixed top-0 right-0 h-full w-80 bg-gray-900/80 backdrop-blur-professional shadow-2xl transform transition-transform duration-300 ease-in-out z-30 overflow-y-auto border-l border-gray-800 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <Heading level={3} className="gradient-gold-text">Profile Details</Heading>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-400 transition-colors-smooth focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg p-1"
            aria-label="Close profile sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {profileData ? (
          <div className="space-y-6">
             <div className="flex justify-center mb-6">
                  <div className="relative">
                    <JazziconAvatar
                      wallet={profileData.wallet_address}
                      size={64}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-yellow-400/50 object-cover shadow-gold"
                    />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900"></div>
                  </div>
             </div>

             <Card variant="professional" className="space-y-4">
               <CardContent className="space-y-4">
                 <div>
                   <Text variant="small" color="muted">Name</Text>
                   <Text className="text-lg font-medium">{profileData.name || 'Not Set'}</Text>
                 </div>
                 
                 <div>
                   <Text variant="small" color="muted">Email</Text>
                   <Text className="text-lg font-medium">{profileData.email || 'Not Set'}</Text>
                 </div>
                 
                 <div>
                   <Text variant="small" color="muted">Wallet Address</Text>
                   <Text className="text-sm break-all font-mono bg-gray-800/50 p-2 rounded border border-gray-700">
                     {profileData.wallet_address}
                   </Text>
                 </div>
                 
                 <div>
                   <Text variant="small" color="muted">Age</Text>
                   <Text className="text-lg font-medium">{profileData.age || 'Not Set'}</Text>
                 </div>
                 
                 <div>
                   <Text variant="small" color="muted">Gender</Text>
                   <Text className="text-lg font-medium capitalize">{profileData.gender || 'Not Set'}</Text>
                 </div>
               </CardContent>
             </Card>

             {/* Disconnect/Logout Button */}
             <Button
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
                 variant="secondary"
                 className="w-full border-red-500/50 text-red-400 hover:border-red-400 hover:bg-red-500/10"
               >
               Disconnect Wallet
               </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="animate-pulse-gold">
              <div className="w-16 h-16 bg-yellow-400/20 rounded-full mx-auto mb-4"></div>
            </div>
            <Text color="muted">Loading profile...</Text>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ProfileSidebar;