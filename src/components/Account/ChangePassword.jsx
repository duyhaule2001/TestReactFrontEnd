import React from "react";
import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  notification,
  Upload,
} from "antd";
import { useSelector } from "react-redux";
import { changePassword } from "../../services/api";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const user = useSelector((state) => state.account.user);

  const onFinish = async (values) => {
    const { email, oldpass, newpass } = values;
    const res = await changePassword(email, oldpass, newpass);
    if (res && res.data) {
      message.success("Thay đổi mật khẩu thành công");
      form.setFieldValue("oldpass", "");
      form.setFieldValue("newpass", "");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
  };
  return (
    <>
      <Form
        onFinish={onFinish}
        form={form}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Trường này không được để trống!",
            },
          ]}
          initialValue={user?.email}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Mật khẩu cũ"
          name="oldpass"
          rules={[
            {
              required: true,
              message: "Trường này không được để trống!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newpass"
          rules={[
            {
              required: true,
              message: "Trường này không được để trống!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">Cập nhật</Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ChangePassword;
