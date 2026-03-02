


import React from 'react';
import { Select, type SelectProps } from 'antd';

interface CustomSelectProps extends SelectProps {
  label?: string;
  error?: string;
  required?: boolean;
  isDarkMode?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  error,
  required,
  isDarkMode = false,
  className,
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className={`block text-sm font-medium mb-2`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Select
        className={`w-full ${className || ''}`}
        size="large"
        {...props}
      />
      {error && (
        <span className="text-red-500 text-xs mt-1 block">{error}</span>
      )}
    </div>
  );
};