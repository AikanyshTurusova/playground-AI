'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState({
    email: {
      marketing: true,
      updates: true,
      security: true,
      weekly: false,
    },
    push: {
      messages: true,
      reminders: false,
      updates: true,
    },
    inApp: {
      newFeatures: true,
      tips: true,
      achievements: true,
    }
  });

  const handleToggle = (category: string, setting: string) => {
    setNotifications(prev => ({
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
          <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
          <p className="text-gray-600 mt-2">Manage how and when you receive notifications</p>
        </div>

        <div className="space-y-6">
          {/* Email Notifications */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Marketing Emails</p>
                  <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
                </div>
                <button
                  onClick={() => handleToggle('email', 'marketing')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.email.marketing ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.email.marketing ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Product Updates</p>
                  <p className="text-sm text-gray-500">Get notified about important product updates</p>
                </div>
                <button
                  onClick={() => handleToggle('email', 'updates')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.email.updates ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.email.updates ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Security Alerts</p>
                  <p className="text-sm text-gray-500">Important security notifications</p>
                </div>
                <button
                  onClick={() => handleToggle('email', 'security')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.email.security ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.email.security ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Weekly Summary</p>
                  <p className="text-sm text-gray-500">Receive a weekly summary of your activity</p>
                </div>
                <button
                  onClick={() => handleToggle('email', 'weekly')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.email.weekly ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.email.weekly ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Push Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Messages</p>
                  <p className="text-sm text-gray-500">Get notified about new messages</p>
                </div>
                <button
                  onClick={() => handleToggle('push', 'messages')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.push.messages ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.push.messages ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Reminders</p>
                  <p className="text-sm text-gray-500">Get reminded about important tasks</p>
                </div>
                <button
                  onClick={() => handleToggle('push', 'reminders')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.push.reminders ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.push.reminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Updates</p>
                  <p className="text-sm text-gray-500">Receive push notifications for updates</p>
                </div>
                <button
                  onClick={() => handleToggle('push', 'updates')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.push.updates ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.push.updates ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* In-App Notifications */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">In-App Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">New Features</p>
                  <p className="text-sm text-gray-500">Get notified about new features and improvements</p>
                </div>
                <button
                  onClick={() => handleToggle('inApp', 'newFeatures')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.inApp.newFeatures ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.inApp.newFeatures ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Tips & Tricks</p>
                  <p className="text-sm text-gray-500">Receive helpful tips to improve your experience</p>
                </div>
                <button
                  onClick={() => handleToggle('inApp', 'tips')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.inApp.tips ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.inApp.tips ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Achievements</p>
                  <p className="text-sm text-gray-500">Get notified when you unlock achievements</p>
                </div>
                <button
                  onClick={() => handleToggle('inApp', 'achievements')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.inApp.achievements ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.inApp.achievements ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

