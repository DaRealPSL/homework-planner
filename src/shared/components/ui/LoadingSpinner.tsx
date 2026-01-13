import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary-400 rounded-full animate-spin mx-auto" style={{animationDuration: '1.5s'}}></div>
        </div>
        <p className="mt-6 text-lg font-medium text-gray-300">Loading your homework...</p>
        <p className="mt-2 text-sm text-gray-500">This won't take long</p>
      </div>
    </div>
  );
};
