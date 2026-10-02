import React, { useState } from 'react';
import { Edit, Star, MapPin, Calendar, Award, BookOpen, DollarSign, Users, Settings, Shield, Wallet, CreditCard } from 'lucide-react';
import { EditProfileModal } from './EditProfileModal';
import { WalletDashboard } from '../Wallet/WalletDashboard';
import { BillingDashboard } from '../Billing/BillingDashboard';
import { useAuth } from '../../hooks/useAuth';
import { StudentKycModal } from '../Auth/StudentKycModal';
import { VerifiedStudentBadge } from '../UI/VerifiedStudentBadge';

export const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const { user: authUser, updateUser, requestVerification } = useAuth();

  if (!authUser) return null;

  const stats = [
    { icon: BookOpen, label: 'Projects Completed', value: authUser.completedProjects, color: 'bg-blue-500' },
    { icon: Star, label: 'Average Rating', value: authUser.rating, color: 'bg-yellow-500' },
    { icon: DollarSign, label: 'Total Earnings', value: `₦${authUser.earnings}`, color: 'bg-green-500' },
    { icon: Users, label: 'Reviews', value: authUser.reviews, color: 'bg-purple-500' }
  ];

  const recentActivity = [
    { type: 'project', message: 'Completed "Data Analysis for Marketing" project', date: '2 days ago' },
    { type: 'review', message: 'Received 5-star review from Sarah Wilson', date: '3 days ago' },
    { type: 'earning', message: 'Earned $75 for Python tutoring session', date: '5 days ago' },
    { type: 'project', message: 'Started new project "Web Development Portfolio"', date: '1 week ago' }
  ];

  const handleSaveProfile = (updatedData: any) => {
    updateUser(updatedData);
  };

  const handleUpgrade = () => {
    updateUser({ isPremium: true });
  };

  return (
    <>
      <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{authUser.name.charAt(0)}</span>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold">{authUser.name}</h1>
              {authUser.isVerified && authUser.userType === 'student' && (
                <VerifiedStudentBadge inverted />
              )}
              {authUser.isVerified && authUser.userType !== 'student' && (
                <div className="flex items-center space-x-1 bg-white bg-opacity-20 px-2 py-1 rounded-full">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              )}
              {!authUser.isVerified && authUser.userType === 'student' && (
                <div className="flex items-center space-x-1 bg-white bg-opacity-20 px-2 py-1 rounded-full">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {authUser.verificationStatus === 'pending' ? 'KYC Pending' : 'KYC Required'}
                  </span>
                </div>
              )}
              {!authUser.isVerified && authUser.userType !== 'student' && (
                <div className="flex items-center space-x-1 bg-white bg-opacity-20 px-2 py-1 rounded-full">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {authUser.verificationStatus === 'pending' ? 'Verification Pending' : 'Verification Required'}
                  </span>
                </div>
              )}
              {authUser.isPremium && (
                <div className="flex items-center space-x-1 bg-yellow-500 px-2 py-1 rounded-full">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">Premium</span>
                </div>
              )}
            </div>
            
            <p className="text-purple-100 mb-2">{authUser.course} • {authUser.level}</p>
            <p className="text-purple-100 mb-4">{authUser.university}</p>
            
            <div className="flex items-center space-x-4 text-sm text-purple-100">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{authUser.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {authUser.joinDate}</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setShowEditModal(true)}
            className="px-6 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        {authUser.userType === 'student' && !authUser.isVerified && (
          <div className="mt-4">
            <button
              onClick={() => setShowKycModal(true)}
              className="px-5 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              {authUser.verificationStatus === 'pending' ? 'Review Student KYC' : 'Complete Student KYC'}
            </button>
          </div>
        )}
        {authUser.userType !== 'student' && !authUser.isVerified && (
          <div className="mt-4">
            <button
              onClick={() => requestVerification()}
              className="px-5 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              {authUser.verificationStatus === 'pending' ? 'Verification Pending' : 'Request Verification'}
            </button>
          </div>
        )}
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

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'overview'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'activity'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Activity
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'wallet'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Wallet
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'billing'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Billing
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'settings'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Bio */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
            <p className="text-gray-600 mb-4">{authUser.bio}</p>

            {authUser.userType === 'student' && authUser.studentKyc && (
              <div className="mb-4 border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-medium text-gray-900 mb-3">Student KYC</h3>
                <div className="grid gap-3 md:grid-cols-2 text-sm text-slate-700">
                  <p><span className="font-medium">ID Number:</span> {authUser.studentKyc.idNumber}</p>
                  <p><span className="font-medium">Department:</span> {authUser.studentKyc.department}</p>
                  <p><span className="font-medium">Level:</span> {authUser.studentKyc.level}</p>
                  <p><span className="font-medium">Faculty:</span> {authUser.studentKyc.faculty || 'Not provided'}</p>
                  <p><span className="font-medium">Certification:</span> {authUser.studentKyc.certification || 'Not provided'}</p>
                  <p><span className="font-medium">Liveness Check:</span> {authUser.studentKyc.livenessCheckCompleted ? 'Completed' : 'Pending'}</p>
                  <p><span className="font-medium">Student ID Card:</span> {authUser.studentKyc.studentIdCardName}</p>
                  <p><span className="font-medium">Government ID:</span> {authUser.studentKyc.governmentIdName}</p>
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {authUser.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Upgrade to Premium */}
          {!authUser.isPremium && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
                  <p className="text-yellow-100 mb-4">Get priority support, advanced analytics, and exclusive features</p>
                  <ul className="text-sm text-yellow-100 space-y-1">
                    <li>• Priority project visibility</li>
                    <li>• Advanced profile analytics</li>
                    <li>• Exclusive networking events</li>
                  </ul>
                </div>
                <button 
                  onClick={() => setActiveTab('billing')}
                  className="px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'wallet' && (
        <WalletDashboard 
          userId={authUser.id} 
          userEmail={authUser.email} 
        />
      )}

      {activeTab === 'billing' && (
        <BillingDashboard
          userEmail={authUser.email}
          isPremium={authUser.isPremium}
          onUpgrade={handleUpgrade}
        />
      )}

      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive updates about your projects and messages</p>
                </div>
                <button className="w-12 h-6 bg-purple-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">Profile Visibility</h3>
                  <p className="text-sm text-gray-600">Make your profile visible to other students</p>
                </div>
                <button className="w-12 h-6 bg-purple-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Enable
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={authUser}
        onSave={handleSaveProfile}
      />
      <StudentKycModal
        isOpen={showKycModal}
        onClose={() => setShowKycModal(false)}
        onSubmit={requestVerification}
        initialData={authUser.studentKyc}
      />
    </>
  );
};
