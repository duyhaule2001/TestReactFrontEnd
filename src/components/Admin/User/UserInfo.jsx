import React from "react";
import { Badge, Descriptions, Drawer } from "antd";
import moment from "moment";

const UserInfo = ({ openDrawer, setOpenDrawer, selectedUser }) => {
  return (
    <>
      <Drawer
        title="Xem chi tiết"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        width="50vw"
      >
        {selectedUser ? (
          <Descriptions title="Thông tin user" bordered column={2}>
            <Descriptions.Item label="Id">{selectedUser._id}</Descriptions.Item>
            <Descriptions.Item label="Tên hiển thị">
              {selectedUser.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedUser.email}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedUser.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Role" span={3}>
              {selectedUser.role}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {moment(selectedUser.createdAt).format("DD/MM/YYYY HH:mm:ss")}
            </Descriptions.Item>
            <Descriptions.Item label="Update At">
              {moment(selectedUser.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>Loading</p>
        )}
      </Drawer>
    </>
  );
};

export default UserInfo;
