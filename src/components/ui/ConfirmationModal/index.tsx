import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../../store/hooks';
import { selectIsDarkMode } from '../../../store/slices/Themeslice';

interface ConfirmationModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onConfirm,
  onCancel,
  title,
  message,
}) => {
  const isDarkMode = useAppSelector(selectIsDarkMode);

  return (
    <Modal
      open={open}
      title={
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined className="text-orange-500 text-xl" />
          <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
            {title}
          </span>
        </div>
      }
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Yes, Switch Call"
      cancelText="Cancel"
      okButtonProps={{
        className: 'bg-blue-500 hover:bg-blue-600',
      }}
      className={isDarkMode ? '[&_.ant-modal-content]:bg-gray-800' : ''}
    >
      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
        {message}
      </p>
    </Modal>
  );
};