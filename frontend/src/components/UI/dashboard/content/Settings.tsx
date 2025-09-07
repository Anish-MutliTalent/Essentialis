// Settings.tsx
import React, { useState } from 'react';
import { Button, Card, CardHeader, CardContent, Heading, Text, Input, Divider } from '../../index';

const Settings: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    theme: 'dark',
    language: 'en'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Save settings logic here
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <Heading level={2} className="gradient-gold-text mb-2">
          Settings
        </Heading>
        <Text color="muted">
          Customize your dashboard experience
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card variant="professional">
          <CardHeader>
            <Heading level={3}>General Settings</Heading>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Text weight="medium">Notifications</Text>
                <Text variant="small" color="muted">Receive updates about your documents</Text>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400 disabled:opacity-50"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Text weight="medium">Auto Save</Text>
                <Text variant="small" color="muted">Automatically save changes</Text>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400 disabled:opacity-50"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card variant="professional">
          <CardHeader>
            <Heading level={3}>Appearance</Heading>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-gray-900/30 border border-gray-800 rounded-lg text-white transition-all-smooth focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 disabled:opacity-50"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-gray-900/30 border border-gray-800 rounded-lg text-white transition-all-smooth focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 disabled:opacity-50"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card variant="professional">
        <CardHeader>
          <Heading level={3}>Security</Heading>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Text weight="medium" className="mb-2">Wallet Connection</Text>
              <Text variant="small" color="muted" className="mb-3">
                Manage your connected wallets and permissions
              </Text>
              <Button variant="secondary" size="sm">
                Manage Wallets
              </Button>
            </div>
            
            <div>
              <Text weight="medium" className="mb-2">API Keys</Text>
              <Text variant="small" color="muted" className="mb-3">
                View and manage your API access keys
              </Text>
              <Button variant="secondary" size="sm">
                Manage API Keys
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card variant="professional">
        <CardHeader>
          <Heading level={3}>Data & Privacy</Heading>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Text weight="medium" className="mb-2">Export Data</Text>
              <Text variant="small" color="muted" className="mb-3">
                Download a copy of your data
              </Text>
              <Button variant="secondary" size="sm">
                Export Data
              </Button>
            </div>
            
            <div>
              <Text weight="medium" className="mb-2">Delete Account</Text>
              <Text variant="small" color="muted" className="mb-3">
                Permanently delete your account and data
              </Text>
              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="primary"
          >
            Edit Settings
          </Button>
        ) : (
          <>
            <Button
              onClick={handleCancel}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="primary"
            >
              Save Changes
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
