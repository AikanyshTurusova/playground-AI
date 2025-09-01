'use client';

import { useEffect } from 'react';
import { app, analytics } from '../firebase';

export default function FirebaseExample() {
  useEffect(() => {
    // Log that Firebase is connected
    console.log('Firebase app initialized:', app.name);
    
    // Log analytics if available
    if (analytics) {
      console.log('Firebase Analytics initialized');
    }
  }, []);

  return (
    <div className="p-4 bg-green-100 rounded-lg">
      <h2 className="text-lg font-semibold text-green-800 mb-2">
        Firebase Connected Successfully! 🚀
      </h2>
      <p className="text-green-700">
        Check your browser console to see Firebase initialization logs.
      </p>
      <div className="mt-3 text-sm text-green-600">
        <p>App Name: {app.name}</p>
        <p>Project ID: {app.options.projectId}</p>
      </div>
    </div>
  );
}
