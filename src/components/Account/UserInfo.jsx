import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  notification,
  Upload,
} from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAvatar, updateUserInfo } from "../../services/api";
import {
  doUpdateUserInfoAction,
  doUploadAvatarAction,
} from "../../redux/account/accountSlice";

const UserInfo = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.account.user);
  const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "");
  const tempAvatar = useSelector((state) => state.account.tempAvatar);

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    tempAvatar || user?.avatar
  }`;

  const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
    try {
      const res = await updateAvatar(file); // Gửi file lên server để cập nhật avatar
      if (res && res.data) {
        const newAvatar = res.data.fileUploaded; // Lấy URL ảnh mới từ response
        dispatch(doUploadAvatarAction({ avatar: newAvatar })); // Cập nhật URL vào Redux
        setUserAvatar(newAvatar); // Cập nhật URL mới vào local state để cập nhật Avatar
        onSuccess("ok");
      } else {
        onError("Đã có lỗi khi upload file");
      }
    } catch (error) {
      onError("Lỗi trong quá trình upload file");
    }
  };

  const onFinish = async (values) => {
    const { fullName, phone, _id } = values;
    const res = await updateUserInfo(_id, userAvatar, phone, fullName);
    if (res && res.data) {
      dispatch(doUpdateUserInfoAction({ avatar: userAvatar, phone, fullName }));
      message.success("Cập nhật thông tin user thành công");

      //force renew token
      localStorage.removeItem("access_token");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  const props = {
    maxCount: 1,
    multiple: false,
    showUploadList: false,
    customRequest: handleUploadAvatar,
    onChange(info) {
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        message.success(`Upload file thành công`);
      } else if (info.file.status === "error") {
        message.error(`Upload file thất bại`);
      }
    },
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Avatar
          size={{ xs: 32, sm: 64, md: 80, lg: 128, xl: 160, xxl: 200 }}
          icon={<AntDesignOutlined />}
          src={urlAvatar}
          shape="circle"
        />
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Upload Avatar</Button>
        </Upload>
      </div>
      <div style={{ width: "50%" }}>
        <Form
          onFinish={onFinish}
          form={form}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="id"
            name="_id"
            hidden
            rules={[
              {
                required: true,
                message: "Trường này không được để trống!",
              },
            ]}
            initialValue={user?.id}
          >
            <Input />
          </Form.Item>
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
            label="Tên hiển thị"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Trường này không được để trống!",
              },
            ]}
            initialValue={user?.fullName}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              {
                required: true,
                message: "Trường này không được để trống!",
              },
            ]}
            initialValue={user?.phone}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit">Cập nhật</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UserInfo;
