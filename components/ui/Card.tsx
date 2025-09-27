import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  const clickableClasses = onClick ? 'cursor-pointer hover:shadow-lg hover:border-indigo-500 transition-all duration-200' : '';
  return (
    <div
      className={`bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-6 ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};