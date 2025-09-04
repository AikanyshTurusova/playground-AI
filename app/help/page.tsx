'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'ai-tools', name: 'AI Tools' },
    { id: 'account', name: 'Account & Billing' },
    { id: 'technical', name: 'Technical Issues' },
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I get started with PlayGround AI?',
      answer: 'Getting started is easy! Simply sign up for an account, verify your email, and you\'ll be taken to your dashboard where you can explore all the AI tools and features available.'
    },
    {
      id: 2,
      category: 'ai-tools',
      question: 'What AI tools are available?',
      answer: 'PlayGround AI offers a comprehensive suite of AI tools including image generation, chat assistance, video meeting integration, and more. Each tool is designed to enhance your productivity and creativity.'
    },
    {
      id: 3,
      category: 'account',
      question: 'How do I change my profile picture?',
      answer: 'Click on your profile icon in the navigation bar, then select "Change Photo" from the dropdown menu. You can upload a new image from your device.'
    },
    {
      id: 4,
      category: 'technical',
      question: 'Why am I getting a 404 error?',
      answer: 'A 404 error typically means the page you\'re trying to access doesn\'t exist. Make sure you\'re using the correct URL and that all features have been properly implemented.'
    },
    {
      id: 5,
      category: 'ai-tools',
      question: 'How do I generate images with AI?',
      answer: 'Navigate to the AI Image section from your dashboard or the navigation menu. Enter a description of the image you want to generate, and our AI will create it for you.'
    },
    {
      id: 6,
      category: 'account',
      question: 'How do I delete my account?',
      answer: 'You can delete your account by going to Settings > Account Settings > Danger Zone > Delete Account. This action is permanent and cannot be undone.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600 mt-2">Find answers to common questions and get the help you need</p>
        </div>

        {/* Search and Categories */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">FAQ</h3>
            <p className="text-gray-600 text-sm mb-4">Find answers to frequently asked questions</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Browse FAQ
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm mb-4">Chat with our support team in real-time</p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Start Chat
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm mb-4">Send us an email and we'll get back to you</p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Send Email
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>
          
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-500">No results found for your search.</p>
              <p className="text-sm text-gray-400">Try adjusting your search terms or category filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Still need help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📧 Email: support@playgroundai.com</p>
                <p>📞 Phone: +1 (555) 123-4567</p>
                <p>🕒 Hours: Monday - Friday, 9 AM - 6 PM EST</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Response Times</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>💬 Live Chat: Immediate</p>
                <p>📧 Email: Within 24 hours</p>
                <p>📞 Phone: Business hours only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

