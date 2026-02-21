import React from 'react';

/**
 * StatusBadge Component
 * Reusable badge for displaying status with different colors
 */
const StatusBadge = ({ status = 'default', children, className = '' }) => {
  const statusStyles = {
    success: 'bg-green-100 text-green-800 border border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    danger: 'bg-red-100 text-red-800 border border-red-300',
    info: 'bg-blue-100 text-blue-800 border border-blue-300',
    default: 'bg-gray-100 text-gray-800 border border-gray-300',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
        statusStyles[status] || statusStyles.default
      } ${className}`}
    >
      {children}
    </span>
  );
};

export default StatusBadge;
