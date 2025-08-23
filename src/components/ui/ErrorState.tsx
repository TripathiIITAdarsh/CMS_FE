import React from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = "Something went wrong",
  message,
  onRetry
}) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
        <div className="flex justify-center mb-4">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-800 mb-2">{title}</h3>
        <p className="text-red-600 mb-4">{message}</p>
        {onRetry && (
          <button 
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            onClick={onRetry}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;