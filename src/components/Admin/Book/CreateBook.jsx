import {
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Row,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { getBookCategory } from "../../../services/api";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const CreateBook = ({ openCreateBook, setOpenCreateBook }) => {
  const [form] = Form.useForm();

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info, type) => {
    if (info.file.status === "uploading") {
      type ? setLoadingSlider(true) : setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        type ? setLoadingSlider(false) : setLoading(false);
        setImageUrl(url);
      });
    }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getBookCategory();
      if (res.data) {
        const formattedOptions = res.data.map((item) => ({
          label: item,
          value: item,
        }));
        setOptions(formattedOptions);
      } else {
        notification.error({
          message: "Error",
          description: res.message,
        });
      }
    };
    fetchCategory();
  }, []);

  const handleUploadFile = ({ file, onSuccess, onError }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };
  return (
    <div>
      <Modal
        title="Thêm mới sách"
        open={openCreateBook}
        onOk={() => form.submit()}
        onCancel={() => setOpenCreateBook(false)}
        width={"50%"}
      >
        <Form onFinish={onFinish} layout="vertical" form={form}>
          <Row gutter={15}>
            <Col span={12}>
              <Form.Item
                label="Tên sách"
                name="mainText"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Tác giả"
                name="author"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Giá tiền"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  addonAfter="VND"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Thể loại"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Select options={options} />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Số lượng"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Đã bán"
                name="sold"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  defaultValue={0}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Upload"
                name="thumbnail"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  beforeUpload={beforeUpload}
                  customRequest={handleUploadFile}
                  onChange={handleChange}
                  maxCount={1}
                  multiple={false}
                >
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Upload
                  </div>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Upload"
                name="slider"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Upload
                  name="slider"
                  listType="picture-card"
                  className="avatar-uploader"
                  beforeUpload={beforeUpload}
                  customRequest={handleUploadFile}
                  onChange={(info) => handleChange(info, "slider")}
                  multiple
                >
                  {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Upload
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateBook;
