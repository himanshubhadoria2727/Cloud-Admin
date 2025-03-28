import React, { useEffect, useState } from "react";
import styles from "./layout.module.css";

import { Layout, Menu, theme, Col, Dropdown, Input, Badge, Avatar } from "antd";
import Link from "next/link";
import { SVG } from "@/assest/svg";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { SearchOutlined, BellOutlined, DashboardOutlined, SettingOutlined, UserOutlined, FileTextOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import Loader from "@/loader/loader";
import Image from "next/image";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const { Header, Sider, Content } = Layout;

const LayoutHoc = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animationData, setAnimationData] = useState(null);

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
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            localStorage.removeItem("auth_token");
            router.push("/");
          }}
          rel="noopener noreferrer"
        >
          Log Out
        </Link>
      ),
    },
  ];

  return (
    <Layout className={styles.layoutWrapper}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={`${styles.sideBar}`}
        width={200}
      >
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
          items={[
            {
              key: "/dashboard",
              icon: <DashboardOutlined />,
              label: <Link href="/dashboard">Dashboard</Link>,
              style: {
                backgroundColor: router.pathname === "/dashboard" ? "#3861fb" : "white",
                color: router.pathname === "/dashboard" ? "white" : "black",
              },
            },
            {
              key: "/manage-properties",
              icon: <UserOutlined />,
              label: <Link href="/manage-properties">Manage Properties</Link>,
              style: {
                backgroundColor:
                  router.pathname.startsWith("/manage-properties") ? "#3861fb" : "white",
                color: router.pathname.startsWith("/manage-properties") ? "white" : "black",
              },
            },
            {
              key: "/bookings",
              icon: <FileTextOutlined />,
              label: <Link href="/bookings">Manage Bookings</Link>,
              style: {
                backgroundColor: router.pathname === "/bookings" ? "#3861fb" : "white",
                color: router.pathname === "/bookings" ? "white" : "black",
              },
            },
            {
              key: "/manage-user",
              icon: <UserOutlined />,
              label: <Link href="/manage-user">Manage Users</Link>,
              style: {
                backgroundColor: router.pathname === "/manage-user" ? "#3861fb" : "white",
                color: router.pathname === "/manage-user" ? "white" : "black",
              },
            },
            // {
            //   key: "/manage-subscription-setting",
            //   icon: <SettingOutlined />,
            //   label: <Link href="/manage-subscription-setting">Analytics</Link>,
            //   style: {
            //     backgroundColor:
            //       router.pathname.startsWith("/manage-subscription-setting")
            //         ? "#3861fb"
            //         : "white",
            //     color: router.pathname.startsWith("/manage-subscription-setting")
            //       ? "white"
            //       : "black",
            //   },
            // },
            {
              key: "/enquiries",
              icon: <FileTextOutlined />,
              label: <Link href="/enquiries">Enquiries</Link>,
              style: {
                backgroundColor: router.pathname === "/enquiries" ? "#3861fb" : "white",
                color: router.pathname === "/enquiries" ? "white" : "black",
              },
            },
            {
              key: "/admin-setting",
              icon: <SettingOutlined />,
              label: <Link href="/admin-setting">Admin Settings</Link>,
              style: {
                backgroundColor: router.pathname === "/admin-setting" ? "#3861fb" : "white",
                color: router.pathname === "/admin-setting" ? "white" : "black",
              },
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header className={`${styles.Header} ${collapsed ? styles.HeaderCollapsed : ''}`}>
          <div className={styles.headerContainer}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
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
