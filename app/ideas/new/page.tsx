'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { createBusinessIdea } from '../../firebase/utils';

function NewIdeaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const defaultCategory = searchParams.get('category') || 'tech';
  
  const [idea, setIdea] = useState({
    title: '',
    description: '',
    category: defaultCategory,
    stage: 'concept',
    industry: 'tech',
    problem: '',
    solution: '',
    targetMarket: '',
    revenueModel: '',
    competitors: '',
    resources: '',
    timeline: '',
    budget: '',
    risks: '',
    nextSteps: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to create business ideas');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Save to Firebase
      const ideaId = await createBusinessIdea(user.id, idea);
      
      if (ideaId) {
        console.log('Business idea saved successfully with ID:', ideaId);
        router.push('/ideas');
      } else {
        alert('Failed to save business idea. Please try again.');
      }
    } catch (error) {
      console.error('Error saving business idea:', error);
      alert('Error saving business idea. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const categories = [
    { value: 'tech', label: 'Technology', icon: '🚀' },
    { value: 'health', label: 'Healthcare', icon: '🏥' },
    { value: 'finance', label: 'Finance', icon: '💰' },
    { value: 'education', label: 'Education', icon: '🎓' },
    { value: 'retail', label: 'Retail', icon: '🛍️' },
    { value: 'food', label: 'Food & Beverage', icon: '🍕' },
    { value: 'travel', label: 'Travel', icon: '✈️' },
    { value: 'other', label: 'Other', icon: '💡' }
  ];

  const stages = [
    { value: 'concept', label: 'Concept', description: 'Initial idea stage' },
    { value: 'research', label: 'Research', description: 'Market research phase' },
    { value: 'planning', label: 'Planning', description: 'Business plan development' },
    { value: 'development', label: 'Development', description: 'Building MVP/prototype' },
    { value: 'launch', label: 'Launch', description: 'Ready to go to market' }
  ];

  const industries = [
    { value: 'tech', label: 'Technology' },
    { value: 'health', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'retail', label: 'Retail' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'travel', label: 'Travel' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/ideas"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to Ideas
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">New Business Idea</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => router.push('/ideas')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="idea-form"
                disabled={isSaving || !idea.title.trim()}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSaving ? 'Saving...' : 'Save Idea'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form id="idea-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Idea Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={idea.title}
                  onChange={(e) => setIdea({ ...idea, title: e.target.value })}
                  placeholder="Enter a catchy title for your business idea..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={idea.category}
                  onChange={(e) => setIdea({ ...idea, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Brief Description
              </label>
              <textarea
                id="description"
                value={idea.description}
                onChange={(e) => setIdea({ ...idea, description: e.target.value })}
                placeholder="Describe your business idea in 2-3 sentences..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Business Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-2">
                  Development Stage
                </label>
                <select
                  id="stage"
                  value={idea.stage}
                  onChange={(e) => setIdea({ ...idea, stage: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {stages.map((stage) => (
                    <option key={stage.value} value={stage.value}>
                      {stage.label} - {stage.description}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  id="industry"
                  value={idea.industry}
                  onChange={(e) => setIdea({ ...idea, industry: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {industries.map((ind) => (
                    <option key={ind.value} value={ind.value}>
                      {ind.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Problem & Solution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Problem & Solution</h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Statement
                </label>
                <textarea
                  id="problem"
                  value={idea.problem}
                  onChange={(e) => setIdea({ ...idea, problem: e.target.value })}
                  placeholder="What problem does your business idea solve? Describe the pain points..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Solution
                </label>
                <textarea
                  id="solution"
                  value={idea.solution}
                  onChange={(e) => setIdea({ ...idea, solution: e.target.value })}
                  placeholder="How does your business idea solve this problem? Describe your unique approach..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Market & Revenue */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Market & Revenue</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="targetMarket" className="block text-sm font-medium text-gray-700 mb-2">
                  Target Market
                </label>
                <textarea
                  id="targetMarket"
                  value={idea.targetMarket}
                  onChange={(e) => setIdea({ ...idea, targetMarket: e.target.value })}
                  placeholder="Who is your target audience? Describe their demographics, needs, and behaviors..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="revenueModel" className="block text-sm font-medium text-gray-700 mb-2">
                  Revenue Model
                </label>
                <textarea
                  id="revenueModel"
                  value={idea.revenueModel}
                  onChange={(e) => setIdea({ ...idea, revenueModel: e.target.value })}
                  placeholder="How will you make money? Subscription, one-time sales, marketplace fees, etc..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Competition & Resources */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Competition & Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="competitors" className="block text-sm font-medium text-gray-700 mb-2">
                  Competitors
                </label>
                <textarea
                  id="competitors"
                  value={idea.competitors}
                  onChange={(e) => setIdea({ ...idea, competitors: e.target.value })}
                  placeholder="Who are your main competitors? What are their strengths and weaknesses?"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="resources" className="block text-sm font-medium text-gray-700 mb-2">
                  Required Resources
                </label>
                <textarea
                  id="resources"
                  value={idea.resources}
                  onChange={(e) => setIdea({ ...idea, resources: e.target.value })}
                  placeholder="What resources do you need? Team, technology, funding, partnerships..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Planning & Next Steps */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Planning & Next Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline
                </label>
                <textarea
                  id="timeline"
                  value={idea.timeline}
                  onChange={(e) => setIdea({ ...idea, timeline: e.target.value })}
                  placeholder="What's your estimated timeline? Key milestones and deadlines..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Estimate
                </label>
                <textarea
                  id="budget"
                  value={idea.budget}
                  onChange={(e) => setIdea({ ...idea, budget: e.target.value })}
                  placeholder="Estimated budget requirements and funding sources..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label htmlFor="nextSteps" className="block text-sm font-medium text-gray-700 mb-2">
                Next Steps
              </label>
              <textarea
                id="nextSteps"
                value={idea.nextSteps}
                onChange={(e) => setIdea({ ...idea, nextSteps: e.target.value })}
                placeholder="What are the immediate next steps to move this idea forward?"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => router.push('/ideas')}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !idea.title.trim()}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSaving ? 'Saving...' : 'Save Business Idea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewIdeaPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewIdeaForm />
    </Suspense>
  );
}
