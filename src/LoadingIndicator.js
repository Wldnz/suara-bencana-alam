import React from 'react';

const LoadingIndicator = () => {
  return (
    <div className="flex items-center justify-center mt-8">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500 border-4"></div>
      <div className="ml-4 text-gray-800">Loading...</div>
    </div>
  );
};

export default LoadingIndicator;
