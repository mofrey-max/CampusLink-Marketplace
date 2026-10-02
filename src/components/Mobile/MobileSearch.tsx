import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';

interface MobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  filters?: Array<{ id: string; label: string; active: boolean }>;
  onFilterToggle?: (filterId: string) => void;
}

export const MobileSearch: React.FC<MobileSearchProps> = ({
  isOpen,
  onClose,
  onSearch,
  placeholder = "Search...",
  filters = [],
  onFilterToggle
}) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch(query);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="flex items-center p-4 border-b border-gray-200">
        <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-gray-900"
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        {filters.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="ml-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        )}
        
        <button
          onClick={onClose}
          className="ml-2 p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {showFilters && filters.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Filters</h3>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => onFilterToggle?.(filter.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter.active
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4">
        <button
          onClick={handleSearch}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Search
        </button>
      </div>
    </div>
  );
};