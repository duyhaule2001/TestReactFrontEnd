import React, { useState, useEffect } from "react";
import {
  AppstoreOutlined,
  ExceptionOutlined,
  UserOutlined,
  DollarCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Space, message, Avatar } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./layout.scss";
import { useDispatch, useSelector } from "react-redux";
import { callLogout } from "../../services/api";
import { doLogoutAction } from "../../redux/account/accountSlice";

const { Content, Sider } = Layout;

const items = [
  {
    label: <Link to="/admin">Dashboard</Link>,
    key: "dashboard",
    icon: <AppstoreOutlined />,
  },
  {
    label: <span>Manage Users</span>,
    key: "user",
    icon: <UserOutlined />,
    children: [
      {
        label: <Link to="/admin/user">CRUD</Link>,
        key: "crud",
      },
      {
        label: "Files1",
        key: "file1",
      },
    ],
  },
  {
    label: <Link to="/admin/book">Manage Books</Link>,
    key: "book",
    icon: <ExceptionOutlined />,
  },
  {
    label: <Link to="/admin/order">Manage Orders</Link>,
    key: "order",
    icon: <DollarCircleOutlined />,
  },
];

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const user = useSelector((state) => state.account.user);

  const navigate = useNavigate();
  const location = useLocation(); // Sử dụng useLocation để lấy đường dẫn hiện tại
  const dispatch = useDispatch();

  useEffect(() => {
    // Lấy key của menu dựa trên URL hiện tại
    const path = location.pathname;
    if (path.includes("/admin/user")) {
      setActiveMenu("user");
    } else if (path.includes("/admin/book")) {
      setActiveMenu("book");
    } else if (path.includes("/admin/order")) {
      setActiveMenu("order");
    } else {
      setActiveMenu("dashboard");
    }
  }, [location.pathname]); // Chạy lại mỗi khi đường dẫn thay đổi

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  };

  let itemsDropdown = [
    {
      label: <label style={{ cursor: "pointer" }}>Quản lý tài khoản</label>,
      key: "account",
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];

  if (user?.role === "ADMIN") {
    itemsDropdown.splice(1, 0, {
      label: <Link to="/">Trang chủ</Link>,
      key: "home",
    });
  }

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;

  return (
    <Layout style={{ minHeight: "100vh" }} className="layout-admin">
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div style={{ height: 32, margin: 16, textAlign: "center" }}>Admin</div>
        <Menu
          selectedKeys={[activeMenu]} // Cập nhật selectedKeys từ activeMenu
          mode="inline"
          items={items}
          onClick={(e) => setActiveMenu(e.key)} // Cập nhật activeMenu khi nhấn vào item
        />
      </Sider>
      <Layout>
        <div className="admin-header">
          <span>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </span>
          <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <Avatar src={urlAvatar} /> {user?.fullName}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
        <Content style={{ padding: "15px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
