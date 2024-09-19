import { Modal, Tabs } from "antd";
import React from "react";
import UserInfo from "./UserInfo";
import ChangePassword from "./ChangePassword";

const ManageAccount = ({ showManageAccount, setShowManageAccount }) => {
  const items = [
    {
      key: "1",
      label: "Cập nhật thông tin",
      children: <UserInfo />,
    },
    {
      key: "2",
      label: "Đổi mật khẩu",
      children: <ChangePassword />,
    },
  ];
  return (
    <>
      <Modal
        title="Quản lý tài khoản"
        width={"50vw"}
        footer={null}
        open={showManageAccount}
        onCancel={() => setShowManageAccount(false)}
      >
        <Tabs defaultActiveKey="1" items={items} />
      </Modal>
    </>
  );
};

export default ManageAccount;
