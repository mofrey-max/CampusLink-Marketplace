import React, { useState } from 'react';
import { AlertTriangle, Shield, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { StudentKycModal } from './StudentKycModal';

export const VerificationBanner: React.FC = () => {
  const { user, requestVerification } = useAuth();
  const [showKycModal, setShowKycModal] = useState(false);

  if (!user || user.isVerified) return null;

  const isStudent = user.userType === 'student';

  const verificationStatus =
    user.verificationStatus === 'pending'
      ? isStudent ? 'Student KYC submitted' : 'Verification request submitted'
      : 'Account Verification Required';

  const verificationDescription =
    user.verificationStatus === 'pending'
      ? isStudent
        ? 'Your KYC submission is pending super admin review. You can reopen it below to confirm the details you submitted.'
        : 'Your verification request is pending super admin review.'
      : isStudent
        ? 'Complete your student KYC to access premium features like adding listings to the marketplace and accommodation finder.'
        : 'Request verification so a super admin can approve your expert or institution account.';

  return (
    <>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800 mb-1">
              {verificationStatus}
            </h3>
            <p className="text-sm text-yellow-700 mb-3">
              {verificationDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  if (isStudent) {
                    setShowKycModal(true);
                    return;
                  }
                  requestVerification();
                }}
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <Shield className="w-4 h-4 mr-2" />
                {isStudent
                  ? user.verificationStatus === 'pending' ? 'Review KYC' : 'Complete Student KYC'
                  : user.verificationStatus === 'pending' ? 'Verification Pending' : 'Request Verification'}
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-white text-yellow-800 text-sm font-medium rounded-lg border border-yellow-300 hover:bg-yellow-50 transition-colors">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
      {isStudent && (
        <StudentKycModal
          isOpen={showKycModal}
          onClose={() => setShowKycModal(false)}
          onSubmit={requestVerification}
          initialData={user.studentKyc}
        />
      )}
    </>
  );
};
