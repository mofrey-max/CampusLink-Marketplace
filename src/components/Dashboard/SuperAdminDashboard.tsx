import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  BarChart3, 
  Settings, 
  AlertTriangle, 
  DollarSign, 
  Activity,
  UserCheck,
  UserX,
  Flag,
  Database,
  Bell,
  Lock,
  Unlock,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { AdminStats, SystemSettings, UserManagement } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { VerifiedStudentBadge } from '../UI/VerifiedStudentBadge';
import { usePremiumPlans } from '../../hooks/usePremiumPlans';

interface SuperAdminDashboardProps {
  onNavigate: (tab: string) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onNavigate }) => {
  const { getAllUsers, reviewStudentKyc } = useAuth();
  const { plans, updatePlanPrice, resetPlans } = usePremiumPlans();
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('all');

  // Mock data - in real app, this would come from API
  const adminStats: AdminStats = {
    totalUsers: 15847,
    totalStudents: 12456,
    totalExperts: 2891,
    totalInstitutions: 500,
    totalProjects: 8934,
    totalTransactions: 45678,
    totalRevenue: 2847500,
    activeUsers: 3456,
    pendingVerifications: 89,
    reportedContent: 23
  };

  const systemSettings: SystemSettings = {
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxFileUploadSize: 10,
    supportedFileTypes: ['jpg', 'png', 'pdf', 'doc', 'docx'],
    platformCommission: 5,
    minimumWithdrawal: 1000,
    notificationSettings: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false
    }
  };

  const recentUsers: UserManagement[] = [
    {
      id: '1',
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        userType: 'student',
        course: 'Computer Science',
        level: '300 Level',
        university: 'Tech University',
        location: 'Lagos, Nigeria',
        bio: 'Computer Science student',
        skills: ['Python', 'JavaScript'],
        joinDate: 'Jan 2024',
        rating: 4.5,
        reviews: 12,
        completedProjects: 8,
        earnings: 25000,
        isPremium: false,
        isVerified: true,
        isAuthorized: true
      },
      status: 'active',
      lastLogin: new Date(Date.now() - 3600000),
      registrationDate: new Date(Date.now() - 86400000 * 30),
      verificationStatus: 'verified',
      reportCount: 0,
      notes: ''
    },
    {
      id: '2',
      user: {
        id: '2',
        name: 'Dr. Sarah Chen',
        email: 'sarah.chen@gmail.com',
        userType: 'expert',
        course: '',
        level: '',
        university: 'Tech University',
        location: 'Abuja, Nigeria',
        bio: 'Mathematics expert',
        skills: ['Mathematics', 'Statistics'],
        joinDate: 'Dec 2023',
        rating: 4.9,
        reviews: 45,
        completedProjects: 67,
        earnings: 125000,
        isPremium: true,
        isVerified: true,
        isAuthorized: true
      },
      status: 'active',
      lastLogin: new Date(Date.now() - 1800000),
      registrationDate: new Date(Date.now() - 86400000 * 60),
      verificationStatus: 'verified',
      reportCount: 0,
      notes: 'Top-rated expert'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const handleUserAction = (userId: string, action: string) => {
    console.log(`Performing ${action} on user ${userId}`);
    // In real app, this would call API
    alert(`${action} action performed on user ${userId}`);
  };

  const handleSystemSettingChange = (setting: string, value: any) => {
    console.log(`Changing ${setting} to ${value}`);
    // In real app, this would update system settings
    alert(`System setting ${setting} updated`);
  };

  const pendingVerifications = getAllUsers().filter(
    (account) =>
      ['student', 'expert', 'institution'].includes(account.userType) &&
      account.verificationStatus === 'pending'
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{adminStats.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(adminStats.totalRevenue)}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{adminStats.activeUsers.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{adminStats.pendingVerifications}</p>
              <p className="text-sm text-gray-600">Pending Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Type Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{adminStats.totalStudents.toLocaleString()}</p>
            <p className="text-sm text-blue-700">Students</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-green-600">{adminStats.totalExperts.toLocaleString()}</p>
            <p className="text-sm text-green-700">Experts</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Database className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{adminStats.totalInstitutions.toLocaleString()}</p>
            <p className="text-sm text-purple-700">Institutions</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => setActiveSection('users')}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
          >
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Manage Users</span>
          </button>

          <button 
            onClick={() => setActiveSection('settings')}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
          >
            <Settings className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">System Settings</span>
          </button>

          <button 
            onClick={() => setActiveSection('analytics')}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
          >
            <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Analytics</span>
          </button>

          <button 
            onClick={() => setActiveSection('users')}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all"
          >
            <Flag className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Moderation</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Account Verification Review</h2>
            <p className="text-sm text-gray-600">Approve or reject pending student, expert, and institution verification requests.</p>
          </div>
          <div className="px-3 py-2 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg">
            {pendingVerifications.length} pending
          </div>
        </div>

        {pendingVerifications.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
            No pending verification submissions right now.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingVerifications.map((account) => (
              <div key={account.id} className="rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900">{account.name}</h3>
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full capitalize">
                          {account.userType}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{account.email}</p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 text-sm text-gray-700">
                      <p><span className="font-medium">University:</span> {account.university || 'Not provided'}</p>
                      <p><span className="font-medium">Location:</span> {account.location || 'Not provided'}</p>
                      {account.userType === 'student' ? (
                        <>
                          <p><span className="font-medium">ID Number:</span> {account.studentKyc?.idNumber}</p>
                          <p><span className="font-medium">Department:</span> {account.studentKyc?.department}</p>
                          <p><span className="font-medium">Level:</span> {account.studentKyc?.level}</p>
                          <p><span className="font-medium">Faculty:</span> {account.studentKyc?.faculty || 'Not provided'}</p>
                          <p><span className="font-medium">Certification:</span> {account.studentKyc?.certification || 'Not provided'}</p>
                          <p><span className="font-medium">Liveness:</span> {account.studentKyc?.livenessCheckCompleted ? 'Completed' : 'Missing'}</p>
                        </>
                      ) : account.userType === 'expert' ? (
                        <>
                          <p><span className="font-medium">Expertise:</span> {account.expertise?.join(', ') || 'Not provided'}</p>
                          <p><span className="font-medium">Experience:</span> {account.experience || 'Not provided'}</p>
                          <p><span className="font-medium">Hourly Rate:</span> {account.hourlyRate || 'Not provided'}</p>
                          <p><span className="font-medium">Certifications:</span> {account.certifications?.join(', ') || 'Not provided'}</p>
                        </>
                      ) : (
                        <>
                          <p><span className="font-medium">Institution:</span> {account.institutionName || 'Not provided'}</p>
                          <p><span className="font-medium">Position:</span> {account.position || 'Not provided'}</p>
                          <p><span className="font-medium">Department:</span> {account.department || 'Not provided'}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => reviewStudentKyc(account.id, 'verified')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => reviewStudentKyc(account.id, 'rejected')}
                      className="px-4 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name, email, or ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
          
          <select
            value={selectedUserType}
            onChange={(e) => setSelectedUserType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          >
            <option value="all">All Users</option>
            <option value="student">Students</option>
            <option value="expert">Experts</option>
            <option value="institution">Institutions</option>
          </select>

          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* User List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">User</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Last Login</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((userMgmt) => (
                <tr key={userMgmt.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{userMgmt.user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{userMgmt.user.name}</p>
                          {userMgmt.user.userType === 'student' && userMgmt.user.isVerified && (
                            <VerifiedStudentBadge compact />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{userMgmt.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      userMgmt.user.userType === 'student' ? 'bg-blue-100 text-blue-800' :
                      userMgmt.user.userType === 'expert' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {userMgmt.user.userType}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      userMgmt.status === 'active' ? 'bg-green-100 text-green-800' :
                      userMgmt.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {userMgmt.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {userMgmt.lastLogin.toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUserAction(userMgmt.user.id, 'view')}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction(userMgmt.user.id, 'edit')}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction(userMgmt.user.id, userMgmt.status === 'active' ? 'suspend' : 'activate')}
                        className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
                        title={userMgmt.status === 'active' ? 'Suspend' : 'Activate'}
                      >
                        {userMgmt.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleUserAction(userMgmt.user.id, 'delete')}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      {/* Platform Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h3 className="font-medium text-gray-900">Maintenance Mode</h3>
              <p className="text-sm text-gray-600">Temporarily disable the platform for maintenance</p>
            </div>
            <button 
              onClick={() => handleSystemSettingChange('maintenanceMode', !systemSettings.maintenanceMode)}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                systemSettings.maintenanceMode ? 'bg-red-600' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                systemSettings.maintenanceMode ? 'right-0.5' : 'left-0.5'
              }`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h3 className="font-medium text-gray-900">User Registration</h3>
              <p className="text-sm text-gray-600">Allow new users to register accounts</p>
            </div>
            <button 
              onClick={() => handleSystemSettingChange('registrationEnabled', !systemSettings.registrationEnabled)}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                systemSettings.registrationEnabled ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                systemSettings.registrationEnabled ? 'right-0.5' : 'left-0.5'
              }`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h3 className="font-medium text-gray-900">Email Verification Required</h3>
              <p className="text-sm text-gray-600">Require email verification for new accounts</p>
            </div>
            <button 
              onClick={() => handleSystemSettingChange('emailVerificationRequired', !systemSettings.emailVerificationRequired)}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                systemSettings.emailVerificationRequired ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                systemSettings.emailVerificationRequired ? 'right-0.5' : 'left-0.5'
              }`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Financial Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Commission (%)
            </label>
            <input
              type="number"
              value={systemSettings.platformCommission}
              onChange={(e) => handleSystemSettingChange('platformCommission', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Withdrawal (₦)
            </label>
            <input
              type="number"
              value={systemSettings.minimumWithdrawal}
              onChange={(e) => handleSystemSettingChange('minimumWithdrawal', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Premium Fee Plans</h2>
            <p className="text-sm text-gray-600">Set the premium subscription prices users see on the billing page.</p>
          </div>
          <button
            type="button"
            onClick={resetPlans}
            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-xl border border-gray-200 p-4 bg-gray-50">
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{plan.interval} billing plan</p>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Premium fee (₦)
              </label>
              <input
                type="number"
                min="0"
                value={plan.price}
                onChange={(e) => updatePlanPrice(plan.id, Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />

              <p className="mt-3 text-xs text-gray-500">
                This price updates the premium billing cards and subscription checkout amount.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h3 className="font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-600">Send notifications via email</p>
            </div>
            <button 
              onClick={() => handleSystemSettingChange('emailNotifications', !systemSettings.notificationSettings.emailNotifications)}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                systemSettings.notificationSettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                systemSettings.notificationSettings.emailNotifications ? 'right-0.5' : 'left-0.5'
              }`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h3 className="font-medium text-gray-900">Push Notifications</h3>
              <p className="text-sm text-gray-600">Send push notifications to mobile apps</p>
            </div>
            <button 
              onClick={() => handleSystemSettingChange('pushNotifications', !systemSettings.notificationSettings.pushNotifications)}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                systemSettings.notificationSettings.pushNotifications ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                systemSettings.notificationSettings.pushNotifications ? 'right-0.5' : 'left-0.5'
              }`}></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Revenue Analytics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{formatCurrency(adminStats.totalRevenue)}</p>
            <p className="text-sm text-green-700">Total Revenue</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(adminStats.totalRevenue * 0.05)}</p>
            <p className="text-sm text-blue-700">Platform Commission</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{adminStats.totalTransactions.toLocaleString()}</p>
            <p className="text-sm text-purple-700">Total Transactions</p>
          </div>
        </div>
      </div>

      {/* User Growth */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Analytics charts would be implemented here</p>
        </div>
      </div>

      {/* Platform Health */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">System Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Server Uptime</span>
                <span className="text-sm font-medium text-green-600">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="text-sm font-medium text-blue-600">245ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Error Rate</span>
                <span className="text-sm font-medium text-red-600">0.1%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-3">User Activity</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Daily Active Users</span>
                <span className="text-sm font-medium text-purple-600">{adminStats.activeUsers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Registrations</span>
                <span className="text-sm font-medium text-green-600">127</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Projects</span>
                <span className="text-sm font-medium text-blue-600">{adminStats.totalProjects.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Super Admin Dashboard</h1>
        <p className="text-red-100">Complete system control and management capabilities</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'settings', label: 'System Settings', icon: Settings },
          { id: 'analytics', label: 'Analytics', icon: Activity }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeSection === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeSection === 'overview' && renderOverview()}
      {activeSection === 'users' && renderUserManagement()}
      {activeSection === 'settings' && renderSystemSettings()}
      {activeSection === 'analytics' && renderAnalytics()}
    </div>
  );
};
