
import React from "react";

import { Input, type InputProps } from "antd";
import { type TextAreaProps } from "antd/es/input";
import type { SearchProps } from "antd/es/input";

interface CustomInputProps extends InputProps {
  label?: string;
  error?: string;
  required?: boolean;
  isDarkMode?: boolean;

}

interface CustomPasswordProps extends InputProps {
  label?: string;
  error?: string;
  required?: boolean;
  isDarkMode?: boolean;
}

interface CustomTextAreaProps extends TextAreaProps {
  label?: string;
  error?: string;
  required?: boolean;
  isDarkMode?: boolean;
}

interface CustomSearchProps extends SearchProps {
  label?: string;
  error?: string;
  required?: boolean;
  noMarginBottom?: boolean;
  isDarkMode?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
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
        <label
          className={`block text-sm font-medium mb-2`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Input
        className={`${className || ""}`}
        size="large"
        {...props}
      />
      {error && (
        <span className="text-red-500 text-xs mt-1 block">{error}</span>
      )}
    </div>
  );
};

export const CustomPassword: React.FC<CustomPasswordProps> = ({
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
        <label
          className={`block text-sm font-medium mb-2`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Input.Password
        className={`${className || ""}`}
        size="large"
        {...props}
      />
      {error && (
        <span className="text-red-500 text-xs mt-1 block">{error}</span>
      )}
    </div>
  );
};

export const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  label,
  error,
  required,
  isDarkMode = false,
  className,
  ...props
}) => {
  const textareaId = props.id || props.name;
  
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={textareaId}
          className={`block text-sm font-medium mb-2`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Input.TextArea
        id={textareaId}
        className={`${className || ""} ${
          isDarkMode
            ? "bg-gray-800 text-white border-gray-600 hover:border-blue-500 focus:border-blue-500"
            : ""
        }`}
        {...props} // This spreads all props including value, onChange, onBlur from react-hook-form
      />
      {error && (
        <span className="text-red-500 text-xs mt-1 block">{error}</span>
      )}
    </div>
  );
};
export const CustomSearch: React.FC<CustomSearchProps> = ({
  label,
  error,
  noMarginBottom,
  required,
  isDarkMode = false,
  className,
  ...props
}) => {
  return (
    <div className={`${noMarginBottom ? "" : "mb-4"}`}>
      {label && (
        <label
          className={`block text-sm font-medium mb-2 ${
            isDarkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Input.Search
        className={`${className || ""} ${
          isDarkMode
            ? "[&_input]:bg-gray-800 [&_input]:text-white [&_input]:border-gray-600 hover:[&_input]:border-blue-500 [&_.ant-input-search-button]:bg-blue-600 [&_.ant-input-search-button]:border-blue-600"
            : ""
        }`}
        size="large"
        {...props}
      />
      {error && (
        <span className="text-red-500 text-xs mt-1 block">{error}</span>
      )}
    </div>
  );
};
