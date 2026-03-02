import Header from "../../common/Header";
import {
  DashboardOutlined,
  SignalFilled,
  MessageOutlined,
  FileTextOutlined,
  SettingOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import StatusBar from "../../../pages/dashboard/Dashboard/StatusBar";
import { useLocation, useNavigate } from "react-router-dom";
import type { ItemType, MenuItemType } from "antd/es/menu/interface";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { Content, Footer } = Layout;

  const items: ItemType<MenuItemType>[] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined/>,
      title: 'Dashboard',
    },
    {
      key: '/radio-management',
      icon: <SignalFilled />,
      title: 'Radio Management',
    },
    {
      key: '/communications',
      icon: <MessageOutlined />,
      title: 'Communications',
    },
    {
      key: '/communications-logs',
      icon: <FileTextOutlined />,
      title: 'Communications Logs',
    },
    {
      key: '/system-logs',
      icon: <FileTextOutlined />,
      title: 'System Logs',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      title: 'Settings',
    },
    {
      key: '/about-us',
      icon: <InfoCircleOutlined />,
      title: 'About Us',
    },
  ];

  return (
    <Layout style={{ height: '100vh', maxHeight:'100vh' }}>
      <Header onLogoutClick={()=>navigate('/login')}/>
      <Layout>
        <Sider
          collapsed
          style={{
            backgroundColor: "var(--ant-color-bg-base)",
            borderRight: "1px solid var(--ant-color-border)",
          }}
        >
          <Menu
            mode="inline"
            items={items}
            selectedKeys={[location.pathname]}
            onClick={(e) => navigate(e.key)}
          />
        </Sider>
        <Layout>
          <Content>
            {children}
          </Content>
          <Footer style={{padding:0,position:'relative'}}>
            <StatusBar
              userName="Sarah Anderson"
              systemStatus="healthy"
              usbStatus={true}
              mapServiceStatus={true}
              audioStatus={true}
            />
          </Footer>
        </Layout>
      </Layout>
    </Layout>

  );
};

export default MainLayout;
