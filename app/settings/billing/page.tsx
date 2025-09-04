'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BillingPage() {
  const [currentPlan] = useState('free');
  const [paymentMethods] = useState([
    { id: 1, type: 'visa', last4: '4242', expiry: '12/25' }
  ]);

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Up to 5 projects',
        'Basic AI tools',
        'Community support',
        '1GB storage'
      ],
      current: true
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'per month',
      features: [
        'Unlimited projects',
        'Advanced AI tools',
        'Priority support',
        '10GB storage',
        'Custom integrations'
      ],
      current: false
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'per month',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Advanced analytics',
        '100GB storage',
        'Dedicated support',
        'Custom branding'
      ],
      current: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/settings"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Settings
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Plans</h1>
          <p className="text-gray-600 mt-2">Manage your subscription and payment methods</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Plan */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h4>
              <p className="text-3xl font-bold text-blue-600 mb-2">$0</p>
              <p className="text-gray-500 mb-4">forever</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ Up to 5 projects</p>
                <p>✓ Basic AI tools</p>
                <p>✓ Community support</p>
                <p>✓ 1GB storage</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Upgrade Plan
              </button>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">V</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">**** **** **** {method.last4}</p>
                      <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                    </div>
                  </div>
                  <button className="text-red-600 hover:text-red-700 text-sm">
                    Remove
                  </button>
                </div>
              ))}
              <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
                + Add Payment Method
              </button>
            </div>
          </div>
        </div>

        {/* Available Plans */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Available Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl shadow-xl border-2 p-6 ${
                  plan.current ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{plan.price}</p>
                  <p className="text-gray-500">{plan.period}</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  {plan.current ? (
                    <button className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed">
                      Current Plan
                    </button>
                  ) : (
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      {plan.name === 'Pro' ? 'Upgrade to Pro' : 'Contact Sales'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No billing history available</p>
            <p className="text-sm">You're currently on the free plan</p>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-500">Projects Used</p>
              <p className="text-xs text-gray-400">of 5 available</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">0.3GB</p>
              <p className="text-sm text-gray-500">Storage Used</p>
              <p className="text-xs text-gray-400">of 1GB available</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">15</p>
              <p className="text-sm text-gray-500">AI Requests</p>
              <p className="text-xs text-gray-400">this month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

