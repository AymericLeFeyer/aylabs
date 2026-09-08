import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';

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
  const barRef = useRef<HTMLDivElement>(null);

  // Fermeture au clic extérieur et à Échap, comme les volets de la navigation.
  useEffect(() => {
    if (openDropdown === null) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!barRef.current?.contains(event.target as Node)) setOpenDropdown(null);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenDropdown(null);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openDropdown]);

  const toggleFilterValue = (filterIndex: number, value: string) => {
    const filter = filters[filterIndex];
    filter.onChange(
      filter.selected.includes(value)
        ? filter.selected.filter((v) => v !== value)
        : [...filter.selected, value]
    );
  };

  return (
    <div
      ref={barRef}
      className="sticky top-16 z-40 -mx-4 mb-8 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6"
    >
      <div className="flex flex-wrap items-center gap-3">
        {/* Recherche */}
        <div className="relative min-w-[16rem] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-9 text-sm transition-colors focus:border-brand focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              aria-label="Effacer la recherche"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filtres */}
        {filters.map((filter, filterIndex) => {
          const isOpen = openDropdown === filterIndex;
          const count = filter.selected.length;
          return (
            <div key={filter.label} className="relative">
              <button
                onClick={() => setOpenDropdown(isOpen ? null : filterIndex)}
                aria-expanded={isOpen}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  count > 0
                    ? 'border-brand bg-brand/10 text-brand'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span>{filter.label}</span>
                {count > 0 && (
                  <span className="rounded-full bg-brand px-1.5 text-xs font-semibold text-white">
                    {count}
                  </span>
                )}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {isOpen && (
                <div className="absolute left-0 top-full z-30 mt-2 max-h-72 w-72 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
                  {filter.options.map((option) => {
                    const selected = filter.selected.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => toggleFilterValue(filterIndex, option.value)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            selected
                              ? 'border-brand bg-brand text-white'
                              : 'border-gray-300'
                          }`}
                          aria-hidden="true"
                        >
                          {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                        </span>
                        <span className="min-w-0 flex-1 truncate">{option.value}</span>
                        <span className="text-xs text-gray-400">{option.count}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div className="ml-auto flex items-center gap-3 text-sm">
          <span className="whitespace-nowrap text-gray-500">
            <strong className="font-semibold text-[#141414]">{resultCount}</strong>{' '}
            {itemName}
            {resultCount > 1 ? 's' : ''}
          </span>
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="rounded-lg px-2.5 py-1.5 font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#141414]"
            >
              Tout effacer
            </button>
          )}
        </div>
      </div>

      {/* Filtres actifs : retirables un par un */}
      {filters.some((filter) => filter.selected.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.flatMap((filter, filterIndex) =>
            filter.selected.map((value) => (
              <button
                key={`${filter.label}-${value}`}
                onClick={() => toggleFilterValue(filterIndex, value)}
                className="group flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 py-1 pl-3 pr-2 text-xs font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-100"
              >
                {value}
                <X className="h-3.5 w-3.5 text-gray-400 transition-colors group-hover:text-[#141414]" />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
