import React, { useState } from 'react';
import { Search, X, ChevronDown, Filter } from 'lucide-react';

interface FilterOption {
  value: string;
  count: number;
}

interface FilterSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder: string;
  filters: {
    label: string;
    options: FilterOption[];
    selected: string[];
    onChange: (values: string[]) => void;
  }[];
  resultCount: number;
  itemName: string;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  filters,
  resultCount,
  itemName,
  onClearAll,
  hasActiveFilters
}) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const toggleFilterValue = (filterIndex: number, value: string) => {
    const filter = filters[filterIndex];
    const newSelected = filter.selected.includes(value)
      ? filter.selected.filter(v => v !== value)
      : [...filter.selected, value];
    filter.onChange(newSelected);
  };

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Barre de recherche */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398FBA] focus:border-transparent transition-colors text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filtres déroulants */}
          {filters.map((filter, filterIndex) => (
            <div key={filter.label} className="relative">
              <button
                onClick={() => toggleDropdown(filterIndex)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  filter.selected.length > 0
                    ? 'bg-[#398FBA] text-white border-[#398FBA]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span>{filter.label}</span>
                {filter.selected.length > 0 && (
                  <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                    {filter.selected.length}
                  </span>
                )}
                <ChevronDown className={`h-4 w-4 transition-transform ${
                  openDropdown === filterIndex ? 'rotate-180' : ''
                }`} />
              </button>

              {openDropdown === filterIndex && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setOpenDropdown(null)}
                  />
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-64 overflow-y-auto">
                    <div className="p-2">
                      {filter.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => toggleFilterValue(filterIndex, option.value)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                            filter.selected.includes(option.value)
                              ? 'bg-[#398FBA] text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span>{option.value}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            filter.selected.includes(option.value)
                              ? 'bg-white/20 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {option.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Compteur et bouton effacer */}
          <div className="flex items-center space-x-4 ml-auto">
            <div className="text-sm text-gray-600 flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>
                {resultCount} {itemName}{resultCount > 1 ? 's' : ''}
              </span>
              {hasActiveFilters && (
                <span className="px-2 py-1 bg-[#398FBA]/10 text-[#398FBA] rounded-full text-xs font-medium">
                  Filtres actifs
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <button
                onClick={onClearAll}
                className="flex items-center space-x-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Effacer</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};