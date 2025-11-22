import React, { useEffect, useState } from "react";
import styles from "./layout.module.css";

import { Layout, Menu, theme, Col, Dropdown, Input, Badge, Avatar, Drawer } from "antd";
import Link from "next/link";
import { SVG } from "@/assest/svg";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { SearchOutlined, BellOutlined, DashboardOutlined, SettingOutlined, UserOutlined, FileTextOutlined, MenuUnfoldOutlined, MenuFoldOutlined, StarOutlined, PullRequestOutlined, ProfileTwoTone, ProfileOutlined, PhoneOutlined } from "@ant-design/icons";
import Image from "next/image";
import { FaPhoneSquare, FaUser, FaUserAstronaut } from "react-icons/fa";

const Loader = dynamic(() => import("@/loader/loader"), { ssr: false });
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const { Header, Sider, Content } = Layout;

const LayoutHoc = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animationData, setAnimationData] = useState(null);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://lottie.host/eca1b917-2235-4b61-bad1-eb220d6e066e/f7iAIOSN33.json"
        );
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error("Error fetching animation data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const router = useRouter();

  const items = [
    {
      key: "1",
      label: (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            localStorage.removeItem("auth_token");
            // Clear cookie
            document.cookie = "auth_token=; path=/; max-age=0";
            router.push("/");
          }}
          rel="noopener noreferrer"
        >
          Log Out
        </a>
      ),
    },
  ];

  const handleMenuClick = (path) => {
    router.push(path);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => handleMenuClick("/dashboard"),
      style: {
        backgroundColor: router.pathname === "/dashboard" ? "#3861fb" : "white",
        color: router.pathname === "/dashboard" ? "white" : "black",
      },
    },
    {
      key: "/manage-properties",
      icon: <UserOutlined />,
      label: " Properties",
      onClick: () => handleMenuClick("/manage-properties"),
      style: {
        backgroundColor:
          router.pathname.startsWith("/manage-properties") ? "#3861fb" : "white",
        color: router.pathname.startsWith("/manage-properties") ? "white" : "black",
      },
    },
    {
      key: "/bookings",
      icon: <FileTextOutlined />,
      label: " Bookings",
      onClick: () => handleMenuClick("/bookings"),
      style: {
        backgroundColor: router.pathname === "/bookings" ? "#3861fb" : "white",
        color: router.pathname === "/bookings" ? "white" : "black",
      },
    },
    {
      key: "/reviews",
      icon: <StarOutlined />,
      label: "Reviews",
      onClick: () => handleMenuClick("/reviews"),
      style: {
        backgroundColor: router.pathname === "/reviews" ? "#3861fb" : "white",
        color: router.pathname === "/reviews" ? "white" : "black",
      },
    },
    {
      key: "/manage-user",
      icon: <UserOutlined />,
      label: " Users",
      onClick: () => handleMenuClick("/manage-user"),
      style: {
        backgroundColor: router.pathname === "/manage-user" ? "#3861fb" : "white",
        color: router.pathname === "/manage-user" ? "white" : "black",
      },
    },
    {
      key: "/agent-request",
      icon: <PhoneOutlined />,
      label: " Agent Request",
      onClick: () => handleMenuClick("/agent-request"),
      style: {
        backgroundColor: router.pathname === "/agent-request" ? "#3861fb" : "white",
        color: router.pathname === "/agent-request" ? "white" : "black",
      },
    },
    {
      key: "/enquiries",
      icon: <FileTextOutlined />,
      label: "Enquiries",
      onClick: () => handleMenuClick("/enquiries"),
      style: {
        backgroundColor: router.pathname === "/enquiries" ? "#3861fb" : "white",
        color: router.pathname === "/enquiries" ? "white" : "black",
      },
    },
    {
      key: "/admin-setting",
      icon: <SettingOutlined />,
      label: "Admin Settings",
      onClick: () => handleMenuClick("/admin-setting"),
      style: {
        backgroundColor: router.pathname === "/admin-setting" ? "#3861fb" : "white",
        color: router.pathname === "/admin-setting" ? "white" : "black",
      },
    },
  ];

  const renderSidebarContent = () => (
    <>
      <Col style={{ textAlign: "center", margin: "16px 0" }}>
        <Image
          src="/images/cloudlogo.png"
          alt="Logo"
          width={80}
          height={80}
          style={{ alignContent:"left" }}
        />
      </Col>
      <Menu
        theme="light"
        mode="inline"
        style={{ backgroundColor: "white" }}
        selectedKeys={[router.pathname]}
        items={menuItems}
      />
    </>
  );

  return (
    <Layout className={styles.layoutWrapper}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className={`${styles.sideBar} z-100`}
          width={200}
        >
          {renderSidebarContent()}
        </Sider>
      )}

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        closable={true}
        width={250}
        bodyStyle={{ padding: 0, backgroundColor: "white" }}
        headerStyle={{ display: "none" }}
      >
        {renderSidebarContent()}
      </Drawer>

      <Layout>
        <Header className={`${styles.Header} ${collapsed ? styles.HeaderCollapsed : ''}`}>
          <div className={styles.headerContainer}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => {
                  if (isMobile) {
                    setMobileDrawerOpen(!mobileDrawerOpen);
                  } else {
                    setCollapsed(!collapsed);
                  }
                },
                style: { fontSize: '20px', color: '#fff', marginRight: '24px', cursor: 'pointer' }
              })}
              <Input
                className={styles.searchBar}
                placeholder="Search..."
                prefix={<SearchOutlined />}
              />
            </div>
            <div className={styles.rightSection}>
              <Badge count={5} offset={[10, 0]}>
                <BellOutlined className={styles.notificationIcon} style={{ color: '#fff' }} />
              </Badge>
              <Dropdown menu={{ items }}>
                <div className={styles.profile}>
                  <Avatar
                    src="/profile-pic.jpg"
                    alt="User"
                    className={styles.avatar}
                  />
                  <span className={styles.username}>Malay Sharma</span>
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>

        <Content className={`${styles.mainLayout} ${collapsed ? styles.mainLayoutCollapsed : ''}`}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 64px)" }}>
              <Loader/>
            </div>
          ) : (
            children
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutHoc;
