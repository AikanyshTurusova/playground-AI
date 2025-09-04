'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';

interface Task {
  id: string;
  key: string;
  summary: string;
  status: string | { name: string };
  priority: string | { name: string };
  assignee?: {
    emailAddress: string;
    displayName: string;
  };
  reporter: {
    displayName: string;
  };
  updated: string;
  issuetype: {
    name: string;
  };
}

interface MemberInfo {
  email: string;
  role: string;
  projectKey: string;
  active: boolean;
}

export default function MemberDashboard() {
  const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadMemberInfo();
  }, []);

  const loadMemberInfo = async () => {
    try {
      // In a real implementation, you would get this from authentication
      const response = await fetch('/api/jira/member/info');
      const data = await response.json();
      
      if (data.success) {
        setMemberInfo(data.data);
        loadAssignedTasks(data.data.email);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to load member info:', error);
      setLoading(false);
    }
  };

  const loadAssignedTasks = async (email: string) => {
    try {
      const response = await fetch(`/api/jira/member/tasks?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (data.success) {
        setAssignedTasks(data.data);
      }
    } catch (error) {
      console.error('Failed to load assigned tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskKey: string, newStatus: string) => {
    setUpdating(taskKey);
    try {
      const response = await fetch(`/api/jira/issues/${taskKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setAssignedTasks(tasks => 
          tasks.map(task => 
            task.key === taskKey 
              ? { ...task, status: newStatus }
              : task
          )
        );
        alert(`Task ${taskKey} status updated to ${newStatus}`);
      } else {
        alert(data.error || 'Failed to update task status');
      }
    } catch (error) {
      alert('Failed to update task status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: any) => {
    // Handle both string and object status formats
    const statusText = typeof status === 'string' ? status : status?.name || 'Unknown';
    
    switch (statusText.toLowerCase()) {
      case 'done':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'discovery':
        return 'bg-blue-100 text-blue-800';
      case 'ready for delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivery':
        return 'bg-orange-100 text-orange-800';
      case 'impact':
        return 'bg-pink-100 text-pink-800';
      case 'parking lot':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: any) => {
    // Handle both string and object priority formats
    const priorityText = typeof priority === 'string' ? priority : priority?.name || 'Unknown';
    
    switch (priorityText.toLowerCase()) {
      case 'high':
      case 'highest':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-lg">Loading your dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!memberInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-red-400 text-lg mb-4">❌ Access Denied</div>
            <p className="text-blue-200 mb-4">
              You need to be a team member to access this dashboard.
            </p>
            <a
              href="/jira"
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Tasks</h1>
            <p className="text-blue-200">
              Welcome, {memberInfo.email} • Role: {memberInfo.role} • Project: {memberInfo.projectKey}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{assignedTasks.length}</div>
            <div className="text-blue-200 text-sm">Assigned Tasks</div>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {assignedTasks.filter(t => {
                const status = typeof t.status === 'string' ? t.status : t.status?.name || '';
                return status === 'Parking lot';
              }).length}
            </div>
            <div className="text-blue-200 text-sm">Backlog</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {assignedTasks.filter(t => {
                const status = typeof t.status === 'string' ? t.status : t.status?.name || '';
                return status === 'Discovery';
              }).length}
            </div>
            <div className="text-blue-200 text-sm">Discovery</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {assignedTasks.filter(t => {
                const status = typeof t.status === 'string' ? t.status : t.status?.name || '';
                return status === 'Done';
              }).length}
            </div>
            <div className="text-blue-200 text-sm">Completed</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {assignedTasks.filter(t => {
                const priority = typeof t.priority === 'string' ? t.priority : t.priority?.name || '';
                return priority === 'High' || priority === 'Highest';
              }).length}
            </div>
            <div className="text-blue-200 text-sm">High Priority</div>
          </div>
        </div>

        {/* Assigned Tasks */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Your Assigned Tasks</h2>
          
          {assignedTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-blue-200">No tasks assigned to you yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignedTasks.map((task) => (
                <div key={task.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-white">{task.key}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {typeof task.status === 'string' ? task.status : task.status?.name || 'Unknown'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {typeof task.priority === 'string' ? task.priority : task.priority?.name || 'Unknown'}
                      </span>
                    </div>
                    <span className="text-sm text-blue-200">
                      {new Date(task.updated).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-white font-medium mb-3">{task.summary}</h3>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-blue-200">
                      <span>Reporter: {task.reporter.displayName}</span>
                      <span className="ml-4">Type: {task.issuetype.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-blue-200">Update Status:</span>
                      <select
                        value={typeof task.status === 'string' ? task.status : task.status?.name || 'Parking lot'}
                        onChange={(e) => updateTaskStatus(task.key, e.target.value)}
                        disabled={updating === task.key}
                        className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="Parking lot">Backlog</option>
                        <option value="Discovery">Discovery</option>
                        <option value="Ready for delivery">Ready for delivery</option>
                        <option value="Delivery">Delivery</option>
                        <option value="Impact">Impact</option>
                        <option value="Done">Done</option>
                      </select>
                      {updating === task.key && (
                        <div className="text-xs text-blue-200">Updating...</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
