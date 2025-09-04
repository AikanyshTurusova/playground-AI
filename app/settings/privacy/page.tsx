'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  const [privacySettings, setPrivacySettings] = useState({
    profile: {
      public: false,
      showEmail: false,
      showLocation: true,
    },
    data: {
      analytics: true,
      marketing: false,
      personalization: true,
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: true,
    }
  });

  const handleToggle = (category: string, setting: string) => {
    setPrivacySettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: !prev[category as keyof typeof prev][setting as keyof typeof prev[category as keyof typeof prev]]
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/settings"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Settings
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Privacy & Security</h1>
          <p className="text-gray-600 mt-2">Control your privacy settings and data sharing preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Privacy */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Privacy</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Public Profile</p>
                  <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                </div>
                <button
                  onClick={() => handleToggle('profile', 'public')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacySettings.profile.public ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacySettings.profile.public ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Show Email Address</p>
                  <p className="text-sm text-gray-500">Display your email address on your profile</p>
                </div>
                <button
                  onClick={() => handleToggle('profile', 'showEmail')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacySettings.profile.showEmail ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacySettings.profile.showEmail ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Show Location</p>
                  <p className="text-sm text-gray-500">Display your location on your profile</p>
                </div>
                <button
                  onClick={() => handleToggle('profile', 'showLocation')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacySettings.profile.showLocation ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacySettings.profile.showLocation ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Data & Analytics */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data & Analytics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Usage Analytics</p>
                  <p className="text-sm text-gray-500">Help us improve by sharing anonymous usage data</p>
                </div>
                <button
                  onClick={() => handleToggle('data', 'analytics')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacySettings.data.analytics ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacySettings.data.analytics ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Marketing Data</p>
                  <p className="text-sm text-gray-500">Allow us to use your data for marketing purposes</p>
                </div>
                <button
                  onClick={() => handleToggle('data', 'marketing')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacySettings.data.marketing ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacySettings.data.marketing ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Personalization</p>
                  <p className="text-sm text-gray-500">Use your data to personalize your experience</p>
                </div>
                <button
                  onClick={() => handleToggle('data', 'personalization')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacySettings.data.personalization ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacySettings.data.personalization ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button
                  onClick={() => handleToggle('security', 'twoFactor')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacySettings.security.twoFactor ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacySettings.security.twoFactor ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Login Alerts</p>
                  <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
                </div>
                <button
                  onClick={() => handleToggle('security', 'loginAlerts')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacySettings.security.loginAlerts ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacySettings.security.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Session Timeout</p>
                  <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                </div>
                <button
                  onClick={() => handleToggle('security', 'sessionTimeout')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacySettings.security.sessionTimeout ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacySettings.security.sessionTimeout ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Data Export & Deletion */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Export Data</p>
                  <p className="text-sm text-gray-500">Download a copy of your data</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Export
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-900">Delete All Data</p>
                  <p className="text-sm text-red-600">Permanently delete all your data</p>
                </div>
                <button 
                  onClick={() => {
                    if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
                      console.log('Data deletion requested');
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Save Privacy Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

