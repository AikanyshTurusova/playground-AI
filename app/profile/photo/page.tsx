'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useRef } from 'react';
import Link from 'next/link';

export default function PhotoUploadPage() {
  const { user, isLoaded } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file.');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB.');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      // Create a FileReader to convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64String = e.target?.result as string;
        
        try {
          // Update user profile image using Clerk
          await user.setProfileImage({ file });
          setUploadSuccess('Profile photo updated successfully!');
          
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          
          // Force a page refresh to show the new image
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } catch (error) {
          console.error('Error uploading image:', error);
          setUploadError('Failed to upload image. Please try again.');
        }
      };
      
      reader.onerror = () => {
        setUploadError('Error reading file. Please try again.');
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/profile"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Change Profile Photo</h1>
          <p className="text-gray-600 mt-2">Upload a new profile picture for your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Current Photo */}
          <div className="text-center mb-8">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Current Profile"
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-4xl font-bold">
                  {(user.firstName || user.emailAddresses[0]?.emailAddress || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <p className="text-gray-600">Current profile photo</p>
          </div>

          {/* Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">Upload a new photo</p>
                <p className="text-gray-500">Drag and drop an image here, or click to select</p>
              </div>
              <div className="text-sm text-gray-400">
                <p>Supported formats: JPG, PNG, GIF</p>
                <p>Maximum file size: 5MB</p>
              </div>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Upload Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </div>
              ) : (
                'Choose File'
              )}
            </button>
          </div>

          {/* Status Messages */}
          {uploadError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700">{uploadError}</p>
              </div>
            </div>
          )}

          {uploadSuccess && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-700">{uploadSuccess}</p>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Tips for a great profile photo:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use a clear, well-lit photo</li>
              <li>• Make sure your face is clearly visible</li>
              <li>• Avoid group photos or photos with text</li>
              <li>• Square images work best</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
