'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function VideoMeetingWidget() {
  const [meetingId, setMeetingId] = useState('');

  const generateMeetingId = () => {
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setMeetingId(id);
  };

  const joinMeeting = () => {
    if (meetingId.trim()) {
      window.open(`/video-meetings?join=${meetingId}`, '_blank');
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border border-blue-200">
      <h3 className="text-xl font-semibold text-blue-900 mb-4">Quick Video Meeting</h3>
      
      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-2">Meeting ID</label>
          <input
            type="text"
            placeholder="Enter or generate meeting ID"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={generateMeetingId}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate ID
          </button>
          <button
            onClick={joinMeeting}
            disabled={!meetingId.trim()}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join Meeting
          </button>
        </div>
      </div>
      
      <div className="text-center">
        <Link
          href="/video-meetings"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
        >
          <span className="mr-2">🎥</span>
          Create New Meeting
        </Link>
      </div>
    </div>
  );
}
