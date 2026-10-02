export interface StudentKycData {
  idNumber: string;
  faculty?: string;
  department: string;
  level: string;
  certification?: string;
  studentIdCardName: string;
  governmentIdName: string;
  livenessCheckCompleted: boolean;
  submittedAt?: string;
  status: 'not_started' | 'pending' | 'verified';
}

export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'student' | 'expert' | 'institution';
  role?: 'user' | 'admin' | 'super_admin';
  course: string;
  level: string;
  university: string;
  location: string;
  bio: string;
  skills: string[];
  avatar?: string;
  isPremium: boolean;
  isVerified: boolean;
  isAuthorized: boolean;
  verificationStatus?: 'not_started' | 'pending' | 'verified' | 'rejected';
  joinDate: string;
  rating: number;
  reviews: number;
  completedProjects: number;
  earnings: number;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  // Expert-specific fields
  expertise?: string[];
  hourlyRate?: number;
  yearsOfExperience?: number;
  certifications?: string[];
  // Institution-specific fields
  institutionName?: string;
  position?: string;
  department?: string;
  faculty?: string;
  verificationDocuments?: string[];
  studentKyc?: StudentKycData;
}

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalExperts: number;
  totalInstitutions: number;
  totalProjects: number;
  totalTransactions: number;
  totalRevenue: number;
  activeUsers: number;
  pendingVerifications: number;
  reportedContent: number;
}

export interface SystemSettings {
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  maxFileUploadSize: number;
  supportedFileTypes: string[];
  platformCommission: number;
  minimumWithdrawal: number;
  notificationSettings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
  };
}

export interface UserManagement {
  id: string;
  user: User;
  status: 'active' | 'suspended' | 'banned' | 'pending_verification';
  lastLogin: Date;
  registrationDate: Date;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  reportCount: number;
  notes: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: 'NGN';
  transactions: Transaction[];
  accountNumber?: string;
  bankName?: string;
  accountName?: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'payment' | 'earning';
  amount: number;
  currency: 'NGN';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  reference: string;
  createdAt: Date;
  metadata?: any;
}

export interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    reference: string;
    trans: number;
    status: string;
    message: string;
    transaction: string;
    trxref: string;
  };
}

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  currency: 'NGN';
  interval: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
}

export interface MarketplaceProduct {
  id: string;
  title: string;
  sellerName: string;
  sellerType: 'expert' | 'student' | 'institution';
  itemType: 'service' | 'goods';
  category: string;
  description: string;
  location: string;
  delivery: string;
  price: number;
  imageAccent?: string;
  imageUrl?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  sellerName: string;
  itemType: 'service' | 'goods';
  category: string;
  description: string;
  location: string;
  delivery: string;
  price: number;
  quantity: number;
  imageAccent?: string;
  imageUrl?: string;
}

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  deliveryNote?: string;
  paymentMethod: 'wallet' | 'transfer' | 'card';
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'processing' | 'completed';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  paymentReference?: string;
  checkout: CheckoutFormData;
  createdAt: string;
  estimatedDelivery: string;
}
