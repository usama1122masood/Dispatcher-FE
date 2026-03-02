

import React from 'react';
import { Layout, Menu, Avatar } from 'antd';
import {
  DashboardOutlined,
  SignalFilled,
  MessageOutlined,
  FileTextOutlined,
  SettingOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';
import { selectIsDarkMode } from '../../../store/slices/Themeslice';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDarkMode = useAppSelector(selectIsDarkMode);

  const items: any = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
    },
    {
      key: '/radio-management',
      icon: <SignalFilled />,
    },
    {
      key: '/communications',
      icon: <MessageOutlined />,
    },
    {
      key: '/communications-logs',
      icon: <FileTextOutlined />,
    },
    {
      key: '/system-logs',
      icon: <FileTextOutlined />,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
    },
    {
      key: '/about-us',
      icon: <InfoCircleOutlined />,
    },
  ];

  const handleMenuClick: any = (e: any) => {
    navigate(e.key);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sider
    width={65}
      className={`
        h-[calc(100vh-64px)] pt-2 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}
      `}
    >
      {/* Menu Items */}
      <Menu
        mode="vertical"
        selectedKeys={[location.pathname]}
        items={items}
        onClick={handleMenuClick}
        className="h-[calc(100vh-160px)] border-r-0"
        style={{
          background: 'transparent',
        }}
      />
    </Sider>
  );
};

export default Sidebar;