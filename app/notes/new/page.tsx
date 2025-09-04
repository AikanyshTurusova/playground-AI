'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { createNote } from '../../firebase/utils';

export default function NewNotePage() {
  const router = useRouter();
  const { user } = useUser();
  const [note, setNote] = useState({
    title: '',
    content: '',
    category: 'personal',
    tags: '',
    isPublic: false
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to create notes');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Save to Firebase
      const noteId = await createNote(user.id, note);
      
      if (noteId) {
        console.log('Note saved successfully with ID:', noteId);
        router.push('/notes');
      } else {
        alert('Failed to save note. Please try again.');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Error saving note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const categories = [
    { 
      value: 'personal', 
      label: 'Personal', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      value: 'work', 
      label: 'Work', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      )
    },
    { 
      value: 'ideas', 
      label: 'Ideas', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    { 
      value: 'learning', 
      label: 'Learning', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    { 
      value: 'goals', 
      label: 'Goals', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    { 
      value: 'other', 
      label: 'Other', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/notes"
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                ← Back to Notes
              </Link>
              <h1 className="text-2xl font-bold text-slate-800">Create New Note</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => router.push('/notes')}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="note-form"
                disabled={isSaving || !note.title.trim()}
                className="px-6 py-2 bg-gradient-to-r from-slate-800 to-slate-700 text-white font-medium rounded-lg hover:from-slate-700 hover:to-slate-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSaving ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form id="note-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
              Note Title *
            </label>
            <input
              type="text"
              id="title"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              placeholder="Enter a descriptive title for your note..."
              className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              required
            />
          </div>

          {/* Category and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={note.category}
                onChange={(e) => setNote({ ...note, category: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={note.tags}
                onChange={(e) => setNote({ ...note, tags: e.target.value })}
                placeholder="Enter tags separated by commas..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
              <p className="text-sm text-slate-500 mt-1">
                Example: productivity, ideas, goals
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
              Note Content
            </label>
            <textarea
              id="content"
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
              placeholder="Start writing your note here... You can use markdown formatting for rich text."
              rows={15}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent font-mono text-sm"
            />
            <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
              <span>Supports markdown formatting</span>
              <span>{note.content.length} characters</span>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-medium text-slate-800 mb-4">Note Settings</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={note.isPublic}
                onChange={(e) => setNote({ ...note, isPublic: e.target.checked })}
                className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-slate-800">
                Make this note public (visible to others)
              </label>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Public notes can be shared and discovered by other users
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => router.push('/notes')}
              className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !note.title.trim()}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSaving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
