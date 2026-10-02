import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { StudentKycData, User } from '../types';

type AuthResult = { success: boolean; message?: string };
type StoredUser = User & { password: string };

const SESSION_STORAGE_KEY = 'campuslink_user';
const REGISTERED_USERS_STORAGE_KEY = 'campuslink_registered_users';

// Mock user database for demonstration
const demoUsers: StoredUser[] = [
  {
    id: '1',
    email: 'john.doe@university.edu',
    password: 'password123',
    name: 'John Doe',
    userType: 'student' as const,
    role: 'user' as const,
    course: 'Computer Science',
    level: 'Final Year',
    university: 'Tech University',
    location: 'Lagos, Nigeria',
    bio: 'Passionate computer science student with expertise in data analysis and web development.',
    skills: ['Python', 'JavaScript', 'Data Analysis', 'React', 'Machine Learning'],
    joinDate: 'September 2021',
    rating: 4.8,
    reviews: 24,
    completedProjects: 15,
    earnings: 125000,
    isPremium: false,
    isVerified: true,
    isAuthorized: true,
    verificationStatus: 'verified',
    department: 'Computer Science',
    faculty: 'Engineering',
    studentKyc: {
      idNumber: 'CL-STU-2021-001',
      faculty: 'Engineering',
      department: 'Computer Science',
      level: 'Final Year',
      certification: '',
      studentIdCardName: 'john-doe-student-id-card.jpg',
      governmentIdName: 'john-doe-national-id.jpg',
      livenessCheckCompleted: true,
      submittedAt: '2026-07-20T10:30:00.000Z',
      status: 'verified'
    }
  },
  {
    id: '2',
    email: 'sarah.chen@gmail.com',
    password: 'expert123',
    name: 'Dr. Sarah Chen',
    userType: 'expert' as const,
    role: 'user' as const,
    course: '',
    level: '',
    university: 'Tech University',
    location: 'Abuja, Nigeria',
    bio: 'Mathematics professor with 10+ years of teaching experience.',
    skills: ['Mathematics', 'Statistics', 'Data Science', 'Python', 'R'],
    joinDate: 'January 2020',
    rating: 4.9,
    reviews: 127,
    completedProjects: 89,
    earnings: 450000,
    isPremium: true,
    isVerified: true,
    isAuthorized: true,
    verificationStatus: 'verified',
    expertise: ['Mathematics', 'Statistics', 'Data Science'],
    hourlyRate: 4500,
    yearsOfExperience: 10,
    certifications: ['PhD Mathematics', 'Data Science Certificate']
  },
  {
    id: '3',
    email: 'admin@techuniversity.com',
    password: 'admin123',
    name: 'Prof. Michael Johnson',
    userType: 'institution' as const,
    role: 'user' as const,
    course: '',
    level: '',
    university: 'Tech University',
    location: 'Lagos, Nigeria',
    bio: 'Dean of Student Affairs at Tech University.',
    skills: ['Administration', 'Student Management', 'Policy Development'],
    joinDate: 'March 2019',
    rating: 5.0,
    reviews: 45,
    completedProjects: 0,
    earnings: 0,
    isPremium: true,
    isVerified: true,
    isAuthorized: true,
    verificationStatus: 'verified',
    institutionName: 'Tech University',
    position: 'Dean of Student Affairs',
    department: 'Administration'
  },
  {
    id: '4',
    email: 'admin@campuslink.com',
    password: 'admin123',
    name: 'System Administrator',
    userType: 'institution' as const,
    role: 'super_admin' as const,
    course: '',
    level: '',
    university: 'CampusLink Platform',
    location: 'Global',
    bio: 'Super Administrator with full system access and management capabilities.',
    skills: ['System Administration', 'User Management', 'Platform Analytics'],
    joinDate: 'January 2024',
    rating: 5.0,
    reviews: 0,
    completedProjects: 0,
    earnings: 0,
    isPremium: true,
    isVerified: true,
    isAuthorized: true,
    verificationStatus: 'verified',
    institutionName: 'CampusLink Platform',
    position: 'Super Administrator',
    department: 'System Administration'
  }
];

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  showRegister: boolean;
  setShowRegister: Dispatch<SetStateAction<boolean>>;
  register: (userData: any) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  requestVerification: (kycData?: StudentKycData) => Promise<void>;
  getAllUsers: () => User[];
  reviewStudentKyc: (userId: string, decision: 'verified' | 'rejected') => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: boolean;
  canAddListing: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const loadRegisteredUsers = (): StoredUser[] => {
  try {
    const rawUsers = localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
    if (!rawUsers) return [];

    const parsedUsers = JSON.parse(rawUsers);
    return Array.isArray(parsedUsers) ? parsedUsers : [];
  } catch (error) {
    console.error('Failed to load registered users:', error);
    localStorage.removeItem(REGISTERED_USERS_STORAGE_KEY);
    return [];
  }
};

const saveRegisteredUsers = (users: StoredUser[]) => {
  localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(users));
};

const stripPassword = ({ password: _, ...userWithoutPassword }: StoredUser): User => userWithoutPassword;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem(SESSION_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const register = async (userData: any): Promise<AuthResult> => {
    setIsLoading(true);
    
    try {
      // Simulate API call for registration
      await new Promise(resolve => setTimeout(resolve, 1500));

      const existingUser = [...demoUsers, ...loadRegisteredUsers()].find(
        existing => existing.email.toLowerCase() === userData.email.toLowerCase()
      );

      if (existingUser) {
        setIsLoading(false);
        return {
          success: false,
          message: 'An account with this email already exists.'
        };
      }
      
      // Create user based on type
      const newUser: StoredUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        userType: userData.userType,
        role: 'user' as const,
        course: userData.course || '',
        level: userData.level || '',
        university: userData.university || userData.institutionName || '',
        location: userData.location || '',
        bio: `${userData.userType === 'expert' ? 'Expert in ' + userData.expertise.join(', ') : 
              userData.userType === 'institution' ? userData.position + ' at ' + userData.institutionName :
              'Student at ' + userData.university}`,
        skills: userData.expertise || [],
        joinDate: new Date().toLocaleDateString(),
        rating: userData.userType === 'expert' ? 5.0 : 0,
        reviews: 0,
        completedProjects: 0,
        earnings: 0,
        isPremium: false,
        isVerified: false,
        isAuthorized: true,
        verificationStatus: 'not_started',
        phone: userData.phone,
        // Expert-specific fields
        expertise: userData.expertise || [],
        hourlyRate: userData.hourlyRate ? parseFloat(userData.hourlyRate) : undefined,
        yearsOfExperience: userData.yearsOfExperience ? parseInt(userData.yearsOfExperience) : undefined,
        certifications: userData.certifications || [],
        // Institution-specific fields
        institutionName: userData.institutionName,
        position: userData.position,
        department: userData.department,
        faculty: userData.faculty
      };

      const { password: _, ...sessionUser } = newUser;
      const registeredUsers = loadRegisteredUsers();
      saveRegisteredUsers([...registeredUsers, newUser]);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { 
        success: false, 
        message: 'Registration failed. Please try again.' 
      };
    }
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const availableUsers = [...demoUsers, ...loadRegisteredUsers()];
      
      // Find user in mock database
      const foundUser = availableUsers.find(u => {
        try {
          const emailMatch = u.email.toLowerCase() === email.toLowerCase();
          const passwordMatch = u.password === password;
          return emailMatch && passwordMatch;
        } catch (error) {
          console.error('Error matching user:', error);
          return false;
        }
      });
      
      if (!foundUser) {
        setIsLoading(false);
        return {
          success: false,
          message: 'Invalid email or password. Please check your credentials and try again.'
        };
      }

      try {
        const userWithoutPassword = stripPassword(foundUser);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userWithoutPassword));
        setUser(userWithoutPassword);
      } catch (storageError) {
        console.error('Error storing user data:', storageError);
        setIsLoading(false);
        return {
          success: false,
          message: 'Login successful but failed to save session. Please try again.'
        };
      }
      
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('💥 LOGIN ERROR', error);
      setIsLoading(false);
      return { 
        success: false, 
        message: 'An error occurred during login. Please try again.' 
      };
    }
  };

  const requestVerification = async (kycData?: StudentKycData) => {
    try {
      // Simulate verification request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const nextKycData = kycData
          ? {
              ...kycData,
              submittedAt: new Date().toISOString(),
              status: 'pending' as const
            }
          : user.studentKyc;

        const updatedUser = {
          ...user,
          isVerified: !!nextKycData && nextKycData.status === 'verified',
          verificationStatus: nextKycData ? nextKycData.status : 'pending',
          studentKyc: nextKycData,
          department: nextKycData?.department || user.department,
          faculty: nextKycData?.faculty || user.faculty,
          level: nextKycData?.level || user.level,
          certifications: nextKycData?.certification
            ? [nextKycData.certification]
            : user.certifications,
          verificationDocuments: nextKycData
            ? [nextKycData.studentIdCardName, nextKycData.governmentIdName]
            : user.verificationDocuments
        };
        setUser(updatedUser);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));

        const registeredUsers = loadRegisteredUsers();
        const updatedRegisteredUsers = registeredUsers.map(registeredUser =>
          registeredUser.id === updatedUser.id
            ? { ...registeredUser, ...updatedUser }
            : registeredUser
        );

        saveRegisteredUsers(updatedRegisteredUsers);
      }
    } catch (error) {
      console.error('Verification request failed:', error);
      throw new Error('Failed to request verification');
    }
  };

  const getAllUsers = (): User[] => {
    return [...demoUsers, ...loadRegisteredUsers()].map(stripPassword);
  };

  const reviewStudentKyc = (userId: string, decision: 'verified' | 'rejected') => {
    const registeredUsers = loadRegisteredUsers();
    const updatedRegisteredUsers = registeredUsers.map((registeredUser) => {
      if (registeredUser.id !== userId) return registeredUser;

      const nextStudentKyc = registeredUser.userType === 'student' && registeredUser.studentKyc
        ? {
            ...registeredUser.studentKyc,
            status: decision === 'verified' ? 'verified' as const : 'not_started' as const
          }
        : registeredUser.studentKyc;

      return {
        ...registeredUser,
        isVerified: decision === 'verified',
        verificationStatus: decision,
        studentKyc: nextStudentKyc
      };
    });

    saveRegisteredUsers(updatedRegisteredUsers);

    if (user?.id === userId) {
      const updatedCurrentUser = updatedRegisteredUsers.find((registeredUser) => registeredUser.id === userId);
      if (updatedCurrentUser) {
        const sessionUser = stripPassword(updatedCurrentUser);
        setUser(sessionUser);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
      }
    }
  };

  const updateUser = (updates: Partial<User>) => {
    try {
      if (user) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));

        const registeredUsers = loadRegisteredUsers();
        const updatedRegisteredUsers = registeredUsers.map(registeredUser =>
          registeredUser.id === updatedUser.id
            ? { ...registeredUser, ...updates }
            : registeredUser
        );

        saveRegisteredUsers(updatedRegisteredUsers);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      throw new Error('Failed to update user profile');
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      setUser(null);
    }
  };

  const value = useMemo(() => ({
    user,
    isLoading,
    showRegister,
    setShowRegister,
    register,
    login,
    requestVerification,
    getAllUsers,
    reviewStudentKyc,
    updateUser,
    logout,
    isAuthenticated: !!user,
    canAddListing: !!user?.isVerified
  }), [user, isLoading, showRegister]);

  return createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
