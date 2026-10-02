import React from 'react';
import { Building, Users, BookOpen, TrendingUp, Bell, Calendar, Award, MessageCircle, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface InstitutionDashboardProps {
  onNavigate: (tab: string) => void;
}

export const InstitutionDashboard: React.FC<InstitutionDashboardProps> = ({ onNavigate }) => {
  const { getAllUsers } = useAuth();
  const stats = [
    { icon: Users, label: 'Registered Students', value: '2,847', color: 'bg-blue-500' },
    { icon: BookOpen, label: 'Active Projects', value: '156', color: 'bg-green-500' },
    { icon: MessageCircle, label: 'Support Tickets', value: '23', color: 'bg-orange-500' },
    { icon: Award, label: 'Success Rate', value: '94%', color: 'bg-purple-500' }
  ];

  const recentActivity = [
    { type: 'registration', message: '45 new student registrations this week', time: '2 hours ago' },
    { type: 'verification', message: '12 students completed verification process', time: '4 hours ago' },
    { type: 'support', message: 'New support ticket from Computer Science dept', time: '6 hours ago' },
    { type: 'announcement', message: 'Campus-wide announcement published', time: '1 day ago' }
  ];

  const departmentStats = [
    { name: 'Computer Science', students: 456, projects: 34, completion: 92 },
    { name: 'Engineering', students: 389, projects: 28, completion: 88 },
    { name: 'Business Admin', students: 234, projects: 19, completion: 95 },
    { name: 'Medicine', students: 178, projects: 12, completion: 97 }
  ];

  const pendingApprovals = [
    { type: 'Expert Application', name: 'Dr. Sarah Chen - Mathematics', priority: 'high' },
    { type: 'Student Verification', name: 'Michael Johnson - CS Dept', priority: 'medium' },
    { type: 'Content Review', name: 'Data Science Course Material', priority: 'low' },
    { type: 'Partnership Request', name: 'TechCorp Internship Program', priority: 'high' }
  ];

  const pendingStudentKyc = getAllUsers().filter(
    (account) =>
      account.userType === 'student' &&
      account.verificationStatus === 'pending' &&
      account.studentKyc
  );

  const scrollToKycQueue = () => {
    const el = document.getElementById('institution-student-kyc-queue');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Institution Dashboard</h1>
        <p className="text-indigo-100">Manage your institution's CampusLink presence and student success.</p>
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Administrative Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={scrollToKycQueue}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
          >
            <Shield className="w-8 h-8 text-indigo-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">View Verification Queue</span>
          </button>
          <button 
            onClick={() => onNavigate('messages')}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
          >
            <Bell className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Send Announcement</span>
          </button>
          <button 
            onClick={() => onNavigate('projects')}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
          >
            <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">View Reports</span>
          </button>
          <button 
            onClick={() => onNavigate('messages')}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
          >
            <MessageCircle className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Support Center</span>
          </button>
        </div>
      </div>

      <div id="institution-student-kyc-queue" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 scroll-mt-24">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Student KYC Queue</h2>
            <p className="text-sm text-gray-600">Institutions can monitor submitted student KYC records, but only super admin can approve or reject them.</p>
          </div>
          <div className="px-3 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg">
            {pendingStudentKyc.length} pending
          </div>
        </div>

        {pendingStudentKyc.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
            No pending student KYC submissions right now.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingStudentKyc.map((student) => (
              <div key={student.id} className="rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 text-sm text-gray-700">
                      <p><span className="font-medium">ID Number:</span> {student.studentKyc?.idNumber}</p>
                      <p><span className="font-medium">Department:</span> {student.studentKyc?.department}</p>
                      <p><span className="font-medium">Level:</span> {student.studentKyc?.level}</p>
                      <p><span className="font-medium">Faculty:</span> {student.studentKyc?.faculty || 'Not provided'}</p>
                      <p><span className="font-medium">Certification:</span> {student.studentKyc?.certification || 'Not provided'}</p>
                      <p><span className="font-medium">Liveness:</span> {student.studentKyc?.livenessCheckCompleted ? 'Completed' : 'Missing'}</p>
                      <p><span className="font-medium">Student ID Card:</span> {student.studentKyc?.studentIdCardName}</p>
                      <p><span className="font-medium">Government ID:</span> {student.studentKyc?.governmentIdName}</p>
                    </div>
                  </div>

                  <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                    Super admin review only
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Department Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Students</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Active Projects</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {departmentStats.map((dept, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{dept.name}</td>
                  <td className="py-3 px-4 text-gray-600">{dept.students}</td>
                  <td className="py-3 px-4 text-gray-600">{dept.projects}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${dept.completion}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{dept.completion}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Approvals & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h2>
          <div className="space-y-3">
            {pendingApprovals.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.type}</p>
                  <p className="text-sm text-gray-600">{item.name}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.priority === 'high' ? 'bg-red-100 text-red-800' :
                  item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Platform Usage</h3>
            <p className="text-2xl font-bold text-green-600">98.5%</p>
            <p className="text-sm text-gray-500">Uptime this month</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Active Users</h3>
            <p className="text-2xl font-bold text-blue-600">1,247</p>
            <p className="text-sm text-gray-500">Online right now</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Satisfaction</h3>
            <p className="text-2xl font-bold text-purple-600">4.8/5</p>
            <p className="text-sm text-gray-500">Average rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};
