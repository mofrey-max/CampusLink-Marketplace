import React, { useMemo, useState } from 'react';
import { Star, DollarSign, Users, BookOpen, TrendingUp, Calendar, Award, MessageCircle } from 'lucide-react';

interface ExpertDashboardProps {
  onNavigate: (tab: string) => void;
}

export const ExpertDashboard: React.FC<ExpertDashboardProps> = ({ onNavigate }) => {
  const [sessionsPage, setSessionsPage] = useState(1);
  const stats = [
    { icon: BookOpen, label: 'Active Students', value: '24', color: 'bg-blue-500' },
    { icon: Star, label: 'Average Rating', value: '4.9', color: 'bg-yellow-500' },
    { icon: DollarSign, label: 'Monthly Earnings', value: '₦85,000', color: 'bg-green-500' },
    { icon: Users, label: 'Total Reviews', value: '127', color: 'bg-purple-500' }
  ];

  const recentSessions = [
    { student: 'Sarah Johnson', subject: 'Data Analysis', time: '2:00 PM Today', status: 'confirmed', amount: '₦3,500' },
    { student: 'Michael Chen', subject: 'Python Programming', time: '4:30 PM Today', status: 'pending', amount: '₦2,500' },
    { student: 'Emma Wilson', subject: 'Statistics', time: '10:00 AM Tomorrow', status: 'confirmed', amount: '₦4,000' },
    { student: 'David Brown', subject: 'Machine Learning', time: '2:00 PM Tomorrow', status: 'confirmed', amount: '₦5,000' }
  ];

  const upcomingPayments = [
    { description: 'Weekly earnings payout', amount: '₦15,750', date: 'Friday, Jan 19' },
    { description: 'Bonus for 5-star ratings', amount: '₦2,500', date: 'Monday, Jan 22' }
  ];

  const sessionsPerPage = 3;
  const sessionsTotalPages = Math.max(1, Math.ceil(recentSessions.length / sessionsPerPage));
  const paginatedSessions = useMemo(
    () =>
      recentSessions.slice(
        (sessionsPage - 1) * sessionsPerPage,
        sessionsPage * sessionsPerPage
      ),
    [recentSessions, sessionsPage]
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Expert Dashboard</h1>
        <p className="text-green-100">Welcome back! You're helping students achieve their goals.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => onNavigate('profile')}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
          >
            <Calendar className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Set Availability</span>
          </button>
          <button 
            onClick={() => onNavigate('messages')}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
          >
            <MessageCircle className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Message Students</span>
          </button>
          <button 
            onClick={() => onNavigate('billing')}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
          >
            <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">View Analytics</span>
          </button>
          <button 
            onClick={() => onNavigate('profile')}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all"
          >
            <Award className="w-8 h-8 text-yellow-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Achievements</span>
          </button>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h2>
          {recentSessions.length > sessionsPerPage && (
            <p className="text-sm text-gray-500">Page {sessionsPage} of {sessionsTotalPages}</p>
          )}
        </div>
        <div className="space-y-4">
          {paginatedSessions.map((session, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{session.student.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{session.student}</h3>
                  <p className="text-sm text-gray-600">{session.subject}</p>
                  <p className="text-xs text-gray-500">{session.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{session.amount}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  session.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {session.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        {sessionsTotalPages > 1 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setSessionsPage((currentPage) => Math.max(1, currentPage - 1))}
              disabled={sessionsPage === 1}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: sessionsTotalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setSessionsPage(page)}
                  className={`min-w-[40px] px-3 py-2 border transition-colors ${
                    sessionsPage === page
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSessionsPage((currentPage) => Math.min(sessionsTotalPages, currentPage + 1))}
              disabled={sessionsPage === sessionsTotalPages}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week's Performance</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sessions Completed</span>
              <span className="font-semibold text-gray-900">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Hours Taught</span>
              <span className="font-semibold text-gray-900">18.5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Earnings</span>
              <span className="font-semibold text-green-600">₦42,500</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Rating</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-semibold text-gray-900">4.9</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Payments</h2>
          <div className="space-y-3">
            {upcomingPayments.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">{payment.description}</p>
                  <p className="text-sm text-green-700">{payment.date}</p>
                </div>
                <span className="font-bold text-green-600">{payment.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
