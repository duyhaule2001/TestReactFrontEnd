import { Form, Input, message, Modal, notification } from "antd";
import React from "react";
import { createUserApi } from "../../../services/api";

const CreateUser = ({ isOpenModal, setIsOpenModal, fetchUser }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const res = await createUserApi(
      values.fullName,
      values.password,
      values.email,
      values.phone
    );
    if (res.data) {
      message.success("Thêm mới tài khoản thành công");
      setIsOpenModal(false);
      await fetchUser();
      form.resetFields();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  return (
    <Modal
      title="Thêm mới người dùng"
      open={isOpenModal}
      onOk={() => form.submit()}
      onCancel={() => {
        setIsOpenModal(false);
      }}
      okText="Tạo Mới"
      cancelText="Huỷ"
    >
      <Form form={form} name="basic" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Tên hiển thị"
          name="fullName"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên hiển thị",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập password",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số điện thoại",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUser;
