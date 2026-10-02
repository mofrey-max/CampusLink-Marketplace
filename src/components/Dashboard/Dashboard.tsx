import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Award,
  Calendar,
  MessageSquare,
  Star,
  Clock,
  DollarSign,
  Target
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Active Projects',
      value: '3',
      icon: BookOpen,
      color: 'bg-blue-500',
      change: '+2 this week'
    },
    {
      title: 'Connections',
      value: '24',
      icon: Users,
      color: 'bg-green-500',
      change: '+5 new'
    },
    {
      title: 'Completion Rate',
      value: '94%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+3% this month'
    },
    {
      title: 'Rating',
      value: '4.8',
      icon: Award,
      color: 'bg-yellow-500',
      change: 'Excellent'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'project',
      title: 'Data Analysis Project submitted',
      time: '2 hours ago',
      icon: BookOpen
    },
    {
      id: 2,
      type: 'message',
      title: 'New message from Dr. Sarah Chen',
      time: '4 hours ago',
      icon: MessageSquare
    },
    {
      id: 3,
      type: 'review',
      title: 'Received 5-star review',
      time: '1 day ago',
      icon: Star
    },
    {
      id: 4,
      type: 'project',
      title: 'New project opportunity available',
      time: '2 days ago',
      icon: Target
    }
  ];

  const quickActions = [
    {
      title: 'Find Projects',
      description: 'Browse available projects',
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'Connect with Experts',
      description: 'Find academic experts',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Schedule Meeting',
      description: 'Book consultation',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'View Earnings',
      description: 'Check your wallet',
      icon: DollarSign,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name || 'Student'}! 👋
        </h1>
        <p className="text-blue-100">
          Ready to continue your academic journey? Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-xs text-green-600">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors"
              >
                <div className={`${action.color} p-3 rounded-lg mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-1">{action.title}</h3>
                <p className="text-xs text-gray-600 text-center">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Icon className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <div className="flex items-center mt-1">
                    <Clock className="w-3 h-3 text-gray-400 mr-1" />
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Profile Completion</span>
              <span className="text-sm text-gray-500">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Monthly Goals</span>
              <span className="text-sm text-gray-500">3/5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};