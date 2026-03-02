import React from 'react';
import { Button } from 'antd';

interface CustomButtonProps extends Omit<any, 'variant'> {
  label?: string;
  buttonType?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  fullWidth?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  buttonType = 'primary',
  fullWidth = false,
  className,
  children,
  ...props
}) => {
  return (
    <Button
      type={buttonType}
      size="large"
      className={`${fullWidth ? 'w-full' : ''} ${className || ''} ${buttonType === 'primary' ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
      {...props}
    >
      {label || children}
    </Button>
  );
};