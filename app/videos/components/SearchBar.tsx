'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleQuickSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    onSearch(searchTerm);
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for videos on YouTube..."
            className="w-full px-6 py-4 pl-14 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-2xl">🔍</span>
          </div>
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute inset-y-0 right-0 px-6 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-r-xl hover:from-red-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Searching...</span>
              </div>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>

      {/* Quick Search Suggestions */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 mr-2">Popular searches:</span>
        {[
          'programming tutorials',
          'business tips',
          'cooking recipes',
          'fitness workouts',
          'music covers',
          'travel vlogs',
          'science experiments',
          'gaming highlights'
        ].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleQuickSearch(suggestion)}
            disabled={isLoading}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Search Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-lg">💡</span>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Search Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use quotes for exact phrase matching</li>
              <li>• Add filters like &quot;4K&quot;, &quot;HD&quot;, or &quot;recent&quot;</li>
              <li>• Search by channel name or specific topics</li>
              <li>• Use filters for duration, upload date, or view count</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
