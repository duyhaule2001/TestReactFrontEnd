import { Form, Input, Modal, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect } from "react";
import { updateUser } from "../../../services/api";

const UpdateUser = ({ openUpdate, setOpenUpdate, userUpdate, fetchUser }) => {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
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
  };

  useEffect(() => {
    form.setFieldsValue(userUpdate);
  }, [userUpdate]);

  return (
    <div>
      <Modal
        title="Basic Modal"
        open={openUpdate}
        onOk={() => form.submit()}
        onCancel={() => setOpenUpdate(false)}
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
