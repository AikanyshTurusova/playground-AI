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
    { value: 'personal', label: 'Personal', icon: '👤' },
    { value: 'work', label: 'Work', icon: '💼' },
    { value: 'ideas', label: 'Ideas', icon: '💡' },
    { value: 'learning', label: 'Learning', icon: '📚' },
    { value: 'goals', label: 'Goals', icon: '🎯' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/notes"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to Notes
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Create New Note</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => router.push('/notes')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="note-form"
                disabled={isSaving || !note.title.trim()}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Note Title *
            </label>
            <input
              type="text"
              id="title"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              placeholder="Enter a descriptive title for your note..."
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Category and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={note.category}
                onChange={(e) => setNote({ ...note, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={note.tags}
                onChange={(e) => setNote({ ...note, tags: e.target.value })}
                placeholder="Enter tags separated by commas..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Example: productivity, ideas, goals
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Note Content
            </label>
            <textarea
              id="content"
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
              placeholder="Start writing your note here... You can use markdown formatting for rich text."
              rows={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
            <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
              <span>Supports markdown formatting</span>
              <span>{note.content.length} characters</span>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Note Settings</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={note.isPublic}
                onChange={(e) => setNote({ ...note, isPublic: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                Make this note public (visible to others)
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Public notes can be shared and discovered by other users
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => router.push('/notes')}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
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
