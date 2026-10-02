import React, { useState } from 'react';
import { Search, Filter, Plus, MapPin, Star, Wifi, Car, Utensils, Shield, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { VerificationBanner } from '../Auth/VerificationBanner';

export const Accommodation: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const { canAddListing } = useAuth();

  return (
    <div className="space-y-6">
      <VerificationBanner />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accommodation Finder</h1>
          <p className="text-gray-600">Find verified hostels and roommates</p>
        </div>
        
        <button 
          className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${
            canAddListing 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!canAddListing}
          title={!canAddListing ? 'Account verification required to add listings' : 'Add accommodation listing'}
        >
          <Plus className="w-5 h-5" />
          <span>Add Listing</span>
        </button>
      </div>
    </div>
  );
};