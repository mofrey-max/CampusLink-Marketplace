import React, { useState } from 'react';
import { Mail, Lock, User, GraduationCap, Building, Star, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';

interface RegisterFormProps {
  onRegister: (userData: any) => Promise<{ success: boolean; message?: string }>;
  onSwitchToLogin: () => void;
  onOpenLegalPage?: (tab: 'privacy-policy' | 'terms-and-conditions' | 'return-policy') => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onSwitchToLogin, onOpenLegalPage }) => {
  const [userType, setUserType] = useState<'student' | 'expert' | 'institution'>('student');
  const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    course: '',
    level: '',
    location: '',
    phone: '',
    // Expert fields
    expertise: '',
    hourlyRate: '',
    yearsOfExperience: '',
    certifications: '',
    // Institution fields
    institutionName: '',
    position: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userTypes = [
    {
      id: 'student',
      label: 'Student',
      icon: GraduationCap,
      description: 'Find help with assignments and connect with peers'
    },
    {
      id: 'expert',
      label: 'Expert/Tutor',
      icon: Star,
      description: 'Offer your expertise and earn money helping students'
    },
    {
      id: 'institution',
      label: 'Institution Representative',
      icon: Building,
      description: 'Represent your university or educational institution'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');

      // Validation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      setIsLoading(true);
      
      const userData = {
        ...formData,
        userType,
        expertise: formData.expertise ? formData.expertise.split(',').map(s => s.trim()) : [],
        certifications: formData.certifications ? formData.certifications.split(',').map(s => s.trim()) : []
      };
      
      const result = await onRegister(userData);
      
      if (!result.success) {
        setError(result.message || 'Registration failed');
      } else {
        // Registration successful, form will automatically switch to dashboard
        setIsLoading(false);
        return;
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Registration form error:', error);
      setError('An unexpected error occurred during registration. Please try again.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    try {
      setFormData(prev => ({ ...prev, [field]: value }));
    } catch (error) {
      console.error('Error updating form field:', error);
    }
  };

  const selectedUserType = userTypes.find(type => type.id === userType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">CL</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Join CampusLink</h1>
          <p className="text-gray-600">Create your account and start connecting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserTypeDropdown(!showUserTypeDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <div className="flex items-center space-x-3">
                  {selectedUserType && <selectedUserType.icon className="w-5 h-5 text-purple-600" />}
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{selectedUserType?.label}</p>
                    <p className="text-sm text-gray-500">{selectedUserType?.description}</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showUserTypeDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showUserTypeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {userTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        setUserType(type.id as any);
                        setShowUserTypeDropdown(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      <type.icon className="w-5 h-5 text-purple-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{type.label}</p>
                        <p className="text-sm text-gray-500">{type.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Role-specific fields */}
          {userType === 'student' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University/Institution
                </label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => handleInputChange('university', e.target.value)}
                  placeholder="Your university name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course of Study
                </label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => handleInputChange('course', e.target.value)}
                  placeholder="e.g., Computer Science"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select Level</option>
                  <option value="100 Level">100 Level</option>
                  <option value="200 Level">200 Level</option>
                  <option value="300 Level">300 Level</option>
                  <option value="400 Level">400 Level</option>
                  <option value="500 Level">500 Level</option>
                  <option value="Final Year">Final Year</option>
                  <option value="Masters">Masters</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, State"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>
          )}

          {userType === 'expert' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Areas of Expertise
                  </label>
                  <input
                    type="text"
                    value={formData.expertise}
                    onChange={(e) => handleInputChange('expertise', e.target.value)}
                    placeholder="e.g., Mathematics, Physics, Programming"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple areas with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate (₦)
                  </label>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                    placeholder="e.g., 2500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                    placeholder="e.g., 3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University/Institution
                  </label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                    placeholder="Your affiliated institution"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications (Optional)
                </label>
                <input
                  type="text"
                  value={formData.certifications}
                  onChange={(e) => handleInputChange('certifications', e.target.value)}
                  placeholder="e.g., PhD Mathematics, AWS Certified, Google Analytics"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple certifications with commas</p>
              </div>
            </div>
          )}

          {userType === 'institution' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Name
                </label>
                <input
                  type="text"
                  value={formData.institutionName}
                  onChange={(e) => handleInputChange('institutionName', e.target.value)}
                  placeholder="University/College name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Position
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder="e.g., Dean, Professor, Admin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="e.g., Computer Science, Administration"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, State"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{' '}
              <button
                type="button"
                onClick={() => onOpenLegalPage?.('terms-and-conditions')}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Terms and Conditions
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => onOpenLegalPage?.('privacy-policy')}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Privacy Policy
              </button>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Account Verification:</p>
              <p>Student, expert, and institution accounts may require verification review before full access is granted.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
