'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { createLibraryResource } from '../../firebase/utils';

function NewLibraryResourceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const defaultType = searchParams.get('type') || 'article';
  const defaultTopic = searchParams.get('topic') || 'business';
  
  const [resource, setResource] = useState({
    title: '',
    type: defaultType,
    topic: defaultTopic,
    description: '',
    url: '',
    author: '',
    duration: '',
    difficulty: 'beginner',
    rating: 5,
    notes: '',
    tags: '',
    isCompleted: false,
    isBookmarked: false
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to add library resources');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Save to Firebase
      const resourceId = await createLibraryResource(user.id, resource);
      
      if (resourceId) {
        console.log('Library resource saved successfully with ID:', resourceId);
        router.push('/library');
      } else {
        alert('Failed to save library resource. Please try again.');
      }
    } catch (error) {
      console.error('Error saving library resource:', error);
      alert('Error saving library resource. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const resourceTypes = [
    { value: 'article', label: 'Article', icon: '📖' },
    { value: 'book', label: 'Book', icon: '📚' },
    { value: 'video', label: 'Video', icon: '🎥' },
    { value: 'podcast', label: 'Podcast', icon: '🎧' },
    { value: 'course', label: 'Course', icon: '🎓' },
    { value: 'tool', label: 'Tool/App', icon: '🛠️' },
    { value: 'paper', label: 'Research Paper', icon: '📄' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  const topics = [
    { value: 'business', label: 'Business' },
    { value: 'technology', label: 'Technology' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'finance', label: 'Finance' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'creativity', label: 'Creativity' },
    { value: 'science', label: 'Science' },
    { value: 'history', label: 'History' },
    { value: 'philosophy', label: 'Philosophy' },
    { value: 'other', label: 'Other' }
  ];

  const difficulties = [
    { value: 'beginner', label: 'Beginner', color: 'text-green-600' },
    { value: 'intermediate', label: 'Intermediate', color: 'text-yellow-600' },
    { value: 'advanced', label: 'Advanced', color: 'text-red-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/library"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to Library
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Add New Resource</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => router.push('/library')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="resource-form"
                disabled={isSaving || !resource.title.trim()}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSaving ? 'Saving...' : 'Save Resource'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form id="resource-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={resource.title}
                  onChange={(e) => setResource({ ...resource, title: e.target.value })}
                  placeholder="Enter the title of the resource..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Type
                </label>
                <select
                  id="type"
                  value={resource.type}
                  onChange={(e) => setResource({ ...resource, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {resourceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={resource.description}
                onChange={(e) => setResource({ ...resource, description: e.target.value })}
                placeholder="Briefly describe what this resource is about and why it's valuable..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Resource Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Resource Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                  Topic/Category
                </label>
                <select
                  id="topic"
                  value={resource.topic}
                  onChange={(e) => setResource({ ...resource, topic: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {topics.map((topic) => (
                    <option key={topic.value} value={topic.value}>
                      {topic.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  value={resource.difficulty}
                  onChange={(e) => setResource({ ...resource, difficulty: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {difficulties.map((diff) => (
                    <option key={diff.value} value={diff.value}>
                      {diff.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  Author/Creator
                </label>
                <input
                  type="text"
                  id="author"
                  value={resource.author}
                  onChange={(e) => setResource({ ...resource, author: e.target.value })}
                  placeholder="Who created this resource?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration/Length
                </label>
                <input
                  type="text"
                  id="duration"
                  value={resource.duration}
                  onChange={(e) => setResource({ ...resource, duration: e.target.value })}
                  placeholder="e.g., 2 hours, 300 pages, 45 minutes"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* URL and Access */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Access Information</h3>
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Resource URL
              </label>
              <input
                type="url"
                id="url"
                value={resource.url}
                onChange={(e) => setResource({ ...resource, url: e.target.value })}
                placeholder="https://example.com/resource"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Link to access the resource online
              </p>
            </div>
          </div>

          {/* Rating and Status */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rating & Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating (1-5)
                </label>
                <select
                  id="rating"
                  value={resource.rating}
                  onChange={(e) => setResource({ ...resource, rating: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {'⭐'.repeat(rating)} ({rating}/5)
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isCompleted"
                    checked={resource.isCompleted}
                    onChange={(e) => setResource({ ...resource, isCompleted: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isCompleted" className="ml-2 block text-sm text-gray-900">
                    Mark as completed
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isBookmarked"
                    checked={resource.isBookmarked}
                    onChange={(e) => setResource({ ...resource, isBookmarked: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isBookmarked" className="ml-2 block text-sm text-gray-900">
                    Add to bookmarks
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Tags */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notes & Organization</h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Notes
                </label>
                <textarea
                  id="notes"
                  value={resource.notes}
                  onChange={(e) => setResource({ ...resource, notes: e.target.value })}
                  placeholder="Add your personal notes, key takeaways, or thoughts about this resource..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  value={resource.tags}
                  onChange={(e) => setResource({ ...resource, tags: e.target.value })}
                  placeholder="Enter tags separated by commas..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Example: productivity, business, leadership, technology
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => router.push('/library')}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !resource.title.trim()}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSaving ? 'Saving...' : 'Save Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewLibraryResourcePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewLibraryResourceForm />
    </Suspense>
  );
}
