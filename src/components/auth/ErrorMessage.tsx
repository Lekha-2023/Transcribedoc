
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;
  
  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-500 text-sm rounded">
      {message}
    </div>
  );
};

export default ErrorMessage;
