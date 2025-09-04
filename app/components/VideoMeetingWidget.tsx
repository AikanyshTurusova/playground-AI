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
    <div className="bg-gradient-to-br from-slate-50 to-emerald-50 p-6 rounded-2xl border border-slate-200">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">Quick Video Meeting</h3>
      
      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Meeting ID</label>
          <input
            type="text"
            placeholder="Enter or generate meeting ID"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={generateMeetingId}
            className="px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-700 text-white text-sm font-medium rounded-lg hover:from-slate-700 hover:to-slate-600 transition-colors"
          >
            Generate ID
          </button>
          <button
            onClick={joinMeeting}
            disabled={!meetingId.trim()}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join Meeting
          </button>
        </div>
      </div>
      
      <div className="text-center">
        <Link
          href="/video-meetings"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-800 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-slate-700 hover:to-emerald-700 transition-all duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Create New Meeting
        </Link>
      </div>
    </div>
  );
}

