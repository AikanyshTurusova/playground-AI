'use client';

import { useState, useEffect } from 'react';
import { ActivityLog, ActivityAction } from '../../lib/types/team';
import { TeamService } from '../../lib/services/teamService';

interface ActivityFeedProps {
  teamId: string;
  limit?: number;
  showHeader?: boolean;
}

export default function ActivityFeed({ teamId, limit = 20, showHeader = true }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [teamId, limit]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const activitiesData = await TeamService.getTeamActivities(teamId, limit);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (action: ActivityAction) => {
    switch (action) {
      case ActivityAction.TEAM_CREATED:
      case ActivityAction.TEAM_UPDATED:
        return (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case ActivityAction.MEMBER_JOINED:
      case ActivityAction.MEMBER_LEFT:
        return (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case ActivityAction.PROJECT_CREATED:
      case ActivityAction.PROJECT_UPDATED:
      case ActivityAction.PROJECT_DELETED:
        return (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case ActivityAction.TASK_CREATED:
      case ActivityAction.TASK_UPDATED:
      case ActivityAction.TASK_ASSIGNED:
      case ActivityAction.TASK_COMPLETED:
        return (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case ActivityAction.COMMENT_ADDED:
        return (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case ActivityAction.FILE_UPLOADED:
        return (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  const getActivityColor = (action: ActivityAction) => {
    switch (action) {
      case ActivityAction.TEAM_CREATED:
      case ActivityAction.PROJECT_CREATED:
      case ActivityAction.TASK_CREATED:
        return 'from-emerald-500 to-teal-500';
      case ActivityAction.MEMBER_JOINED:
      case ActivityAction.TASK_COMPLETED:
        return 'from-green-500 to-emerald-500';
      case ActivityAction.TASK_ASSIGNED:
      case ActivityAction.COMMENT_ADDED:
        return 'from-blue-500 to-indigo-500';
      case ActivityAction.FILE_UPLOADED:
        return 'from-purple-500 to-pink-500';
      case ActivityAction.MEMBER_LEFT:
      case ActivityAction.PROJECT_DELETED:
        return 'from-red-500 to-pink-500';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        {showHeader && <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>}
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      {showHeader && <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>}
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-slate-500">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${getActivityColor(activity.action)} rounded-full flex items-center justify-center flex-shrink-0`}>
                {getActivityIcon(activity.action)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800">
                  {activity.description}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {formatTimeAgo(activity.createdAt)}
                </p>
                
                {activity.metadata && (
                  <div className="mt-2 text-xs text-slate-600">
                    {activity.metadata.projectName && (
                      <span className="inline-block bg-slate-100 text-slate-700 px-2 py-1 rounded mr-2">
                        {activity.metadata.projectName}
                      </span>
                    )}
                    {activity.metadata.taskTitle && (
                      <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {activity.metadata.taskTitle}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activities.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-200">
          <button
            onClick={loadActivities}
            className="w-full text-center text-sm text-slate-600 hover:text-slate-800 transition-colors"
          >
            Refresh Activity
          </button>
        </div>
      )}
    </div>
  );
}

