import { Button, Form, Input, Modal, notification } from "antd";
import React, { useEffect, useState } from "react";
import { updateUser } from "../../../services/api";

const UpdateUser = ({ openUpdate, setOpenUpdate, userUpdate, fetchUser }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    setLoading(true);
    const data = {
      _id: values._id,
      fullName: values.fullName,
      phone: values.phone,
    };
    const res = await updateUser(data);
    if (res.data) {
      notification.success({
        message: "Thành công",
        description: "Cập nhật người dùng thành công",
      });
      setOpenUpdate(false);
      await fetchUser();
    } else {
      notification.error({
        message: "Thất bại",
        description: res.message,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userUpdate) {
      form.setFieldsValue(userUpdate);
    }
  }, [userUpdate]);

  return (
    <div>
      <Modal
        title="Basic Modal"
        open={openUpdate}
        onOk={() => form.submit()}
        onCancel={() => setOpenUpdate(false)}
        footer={[
          <Button key="cancel" onClick={() => setOpenUpdate(false)}>
            Hủy bỏ
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
          >
            Cập nhật
          </Button>,
        ]}
      >
        <Form form={form} name="basic" onFinish={onFinish} layout="vertical">
          <Form.Item label="ID" name="_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="Tên hiển thị" name="fullName">
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateUser;
