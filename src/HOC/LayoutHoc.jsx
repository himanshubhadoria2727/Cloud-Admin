import React, { useEffect, useState } from "react";
import styles from "./layout.module.css";

import { Layout, Menu, theme, Col, Dropdown, Spin } from "antd";
import Link from "next/link";
import { SVG } from "@/assest/svg";
import { useRouter } from "next/router";
import { IMAGES } from "@/assest/images";
import Image from "next/image";
import Lottie from "lottie-react";

const { Header, Sider, Content } = Layout;


const LayoutHoc = ({ children }) => {
  const [hide, setHide] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating an asynchronous operation to fetch animation data
        const response = await fetch(
          "https://lottie.host/eca1b917-2235-4b61-bad1-eb220d6e066e/f7iAIOSN33.json"
        );
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error("Error fetching animation data:", error);
      } finally {
        // Simulating the cleanup function
        const timeout = setTimeout(() => {
          setLoading(false);
        }, 2000); // Adjust the time according to your needs

        // Cleanup function
        return () => clearTimeout(timeout);
      }
    };

    fetchData();
  }, []);

  const { colorBgContainer } = theme.useToken();
  const router = useRouter();

const items = [
  {
    key: '1',
    label: (
      <Link
        href="/"
        onClick={(e) => {
          e.preventDefault(); // Prevent default link behavior
          localStorage.removeItem('auth_token'); // Remove the auth token
          // Redirect to home or another page
          router.push('/'); 
        }}
        rel="noopener noreferrer"
      >
        Log Out
      </Link>
    ),
  },

];
  return (
    <>

      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className={`${styles.sideBar}`}
        >
          <Col style={{ textAlign: "center" }}>
            <h3 className={`${styles.logoTitle}`}>Tabla</h3>
            {/* <Image src={IMAGES.Logo} alt="" className={`${styles.logoImg}`} /> */}
          </Col>
          <Menu theme="light" mode="inline">
            <Menu.Item icon={<SVG.Dashboard />} className={router.pathname === '/dashboard' ? ' settings active ' : 'settings'}>
              <Link href="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item icon={<SVG.User />} className={
              router.pathname === '/manage-raag-sub-raag' ||
                router.pathname === '/manage-raag-sub-raag/add-category' ||
                router.pathname === '/manage-raag-sub-raag/add-sub-category'
                ? 'settings active'
                : 'settings'
            }>
              <Link href="/manage-raag-sub-raag">Manage Taal & Sub Taal</Link>
            </Menu.Item>
            <Menu.Item icon={<SVG.User />} className={router.pathname === '/manage-tabla-music' || router.pathname === '/manage-tabla-music/add-tabla-music' ? 'settings active' : 'settings'}>
              <Link href="/manage-tabla-music">Manage Tabla Music</Link>
            </Menu.Item>
            {/* <Menu.Item icon={<SVG.User />} className={router.pathname === '/manage-tanpura' || router.pathname === '/manage-tanpura/add-tanpura' ? 'settings active' : 'settings'}>
              <Link href="/manage-tanpura">Manage Tanpura Music</Link>
            </Menu.Item>
            <Menu.Item icon={<SVG.User />} className={router.pathname === '/manage-surmandal' || router.pathname === '/manage-surmandal/add-surmandal' ? 'settings active' : 'settings'}>
              <Link href="/manage-surmandal">Manage Surmandal</Link>
            </Menu.Item>
            <Menu.Item icon={<SVG.User />} className={router.pathname === '/manage-surpeti' ? 'settings active' : 'settings'}>
              <Link href="/manage-surpeti">Manage Surpeti</Link>
            </Menu.Item> */}
            <Menu.Item icon={<SVG.User />} className={router.pathname === '/manage-user' ? 'settings active' : 'settings'}>
              <Link href="/manage-user">Manage Users</Link>
            </Menu.Item>
            <Menu.Item icon={<SVG.Setting />} className={router.pathname === '/manage-subscription-setting' || router.pathname === '/subscription-setting/add-plan' ? 'settings active ' : 'settings'}>
              <Link href="/manage-subscription-setting">Manage Subscription Settings</Link>
            </Menu.Item>
            <Menu.Item icon={<SVG.Property />} className={router.pathname === '/manage-transcation' ? 'settings active ' : 'settings'}>
              <Link href="/manage-transcation">Manage Subscription Orders</Link>
            </Menu.Item>

            <Menu.Item icon={<SVG.User />} className={router.pathname === '/manage-content' ? 'settings active' : 'settings'}>
              <Link href="/manage-content">Manage Content</Link>
            </Menu.Item>
            <Menu.Item icon={<SVG.User />} className={router.pathname === '/enquiries' ? 'settings active' : 'settings'}>
              <Link href="/enquiries">Enquiries</Link>
            </Menu.Item>
            <Menu.Item icon={<SVG.Setting />} className={router.pathname === '/admin-setting' ? ' settings active' : 'settings'}>
              <Link href="/admin-setting">Admin Settings</Link>
            </Menu.Item>

          </Menu>
        </Sider>

        <Header className={`${styles.Header}`}>
          <Dropdown
            menu={{
              items,
            }}
          >
            <Col className={`${styles.dropdown}`}>

              <h6>Pawan Sharma</h6>

            </Col>

          </Dropdown>




        </Header>
        {loading ? <Col className="loaderFile"> <Lottie animationData={animationData} loop autoplay /> </Col> : <> <Content className={`${styles.mainLayout}`}>

          {children}
        </Content></>}
      </Layout>
    </>
  );
};

export default LayoutHoc;
