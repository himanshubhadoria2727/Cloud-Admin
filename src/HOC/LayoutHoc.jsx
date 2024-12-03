import React, { useEffect, useState } from "react";
import styles from "./layout.module.css";

import { Layout, Menu, theme, Col, Dropdown, Input, Badge, Avatar } from "antd";
import Link from "next/link";
import { SVG } from "@/assest/svg";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { SearchOutlined, BellOutlined, DashboardOutlined, SettingOutlined, UserOutlined, FileTextOutlined } from "@ant-design/icons";

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
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={`${styles.sideBar}`}
      >
        <Col style={{ textAlign: "center", margin: "16px 0" }}>
          <h3 className={`${styles.logoTitle}`}>Cloud Accommodation</h3>
        </Col>
        <Menu theme="light" mode="inline">
          <Menu.Item
            icon={<DashboardOutlined />}
            className={router.pathname === "/dashboard" ? "active" : ""}
          >
            <Link href="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item
            icon={<UserOutlined />}
            className={
              router.pathname.startsWith("/manage-properties") ? "active" : ""
            }
          >
            <Link href="/manage-properties">Manage Properties</Link>
          </Menu.Item>
          <Menu.Item
            icon={<FileTextOutlined />}
            className={router.pathname === "/manage-tabla-music" ? "active" : ""}
          >
            <Link href="/manage-tabla-music">Manage Bookings</Link>
          </Menu.Item>
          <Menu.Item
            icon={<UserOutlined />}
            className={router.pathname === "/manage-user" ? "active" : ""}
          >
            <Link href="/manage-user">Manage Users</Link>
          </Menu.Item>
          <Menu.Item
            icon={<SettingOutlined />}
            className={
              router.pathname.startsWith("/manage-subscription-setting")
                ? "active"
                : ""
            }
          >
            <Link href="/manage-subscription-setting">Analytics</Link>
          </Menu.Item>
          <Menu.Item
            icon={<FileTextOutlined />}
            className={router.pathname === "/enquiries" ? "active" : ""}
          >
            <Link href="/enquiries">Enquiries</Link>
          </Menu.Item>
          <Menu.Item
            icon={<SettingOutlined />}
            className={router.pathname === "/admin-setting" ? "active" : ""}
          >
            <Link href="/admin-setting">Admin Settings</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header className={styles.Header}>
          <div className={styles.headerContainer}>
            <Input
              className={styles.searchBar}
              placeholder="Search..."
              prefix={<SearchOutlined />}
            />
            <div className={styles.rightSection}>
              <Badge count={5} offset={[10, 0]}>
                <BellOutlined className={styles.notificationIcon} />
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


        <Content className={`${styles.mainLayout}`}>
          {loading ? (
            <div className="loaderFile">
              <Lottie animationData={animationData} loop autoplay />
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
