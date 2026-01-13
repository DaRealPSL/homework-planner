import React from 'react';

export const CalendarSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-48 bg-gray-700 rounded"></div>
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-gray-700 rounded-lg"></div>
          <div className="h-10 w-10 bg-gray-700 rounded-lg"></div>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-6 bg-gray-700 rounded"></div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {[...Array(35)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-700 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
};

export const HomeworkListSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-800 rounded-xl p-4 border border-gray-700 animate-pulse"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 bg-gray-700 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-9 bg-gray-700 rounded-lg"></div>
              <div className="h-9 w-9 bg-gray-700 rounded-lg"></div>
            </div>
          </div>
          <div className="h-4 w-full bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700 animate-pulse">
      <div className="h-6 w-32 bg-gray-700 rounded mb-4"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
            <div className="h-4 w-24 bg-gray-700 rounded"></div>
            <div className="h-6 w-12 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};