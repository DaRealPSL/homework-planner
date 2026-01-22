// src/features/search/components/SearchFilterBar.tsx
import React, { useState } from 'react';

export interface FilterOptions {
  searchQuery: string;
  subject: string;
  status: 'all' | 'pending' | 'completed';
  sortBy: 'due_date' | 'created_at' | 'subject' | 'title';
  sortOrder: 'asc' | 'desc';
}

interface SearchFilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  subjects: string[];
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  filters,
  onFiltersChange,
  subjects,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-4 border border-gray-700 mb-6">
      {/* Search Bar */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search homework..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-400"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
            showFilters
              ? 'bg-primary-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Subject Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
            <select
              value={filters.subject}
              onChange={(e) => updateFilter('subject', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value as FilterOptions['status'])}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
            <div className="flex gap-2">
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value as FilterOptions['sortBy'])}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="due_date">Due Date</option>
                <option value="created_at">Created</option>
                <option value="subject">Subject</option>
                <option value="title">Title</option>
              </select>

              <button
                onClick={() =>
                  updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')
                }
                className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg hover:bg-gray-600 transition-colors"
                title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                {filters.sortOrder === 'asc' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {(filters.searchQuery || filters.subject || filters.status !== 'all') && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-400">Active filters:</span>

          {filters.searchQuery && (
            <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm flex items-center gap-2">
              Search: "{filters.searchQuery}"
              <button
                onClick={() => updateFilter('searchQuery', '')}
                className="hover:text-primary-100"
              >
                ×
              </button>
            </span>
          )}

          {filters.subject && (
            <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm flex items-center gap-2">
              Subject: {filters.subject}
              <button onClick={() => updateFilter('subject', '')} className="hover:text-primary-100">
                ×
              </button>
            </span>
          )}

          {filters.status !== 'all' && (
            <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm flex items-center gap-2">
              Status: {filters.status}
              <button
                onClick={() => updateFilter('status', 'all')}
                className="hover:text-primary-100"
              >
                ×
              </button>
            </span>
          )}

          <button
            onClick={() =>
              onFiltersChange({
                searchQuery: '',
                subject: '',
                status: 'all',
                sortBy: 'due_date',
                sortOrder: 'asc',
              })
            }
            className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};