import {
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { getBookCategory } from "../../../services/api";
import { v4 as uuidv4 } from "uuid";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message } from "antd";

const UpdateBook = ({
  setOpenUpdateBook,
  openUpdateBook,
  selectedUpdate,
  setSelectedUpdate,
}) => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);
  const [dataThumbnail, setDataThumbnail] = useState([]);
  const [dataSlider, setDataSlider] = useState([]);

  const [initForm, setInitForm] = useState(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState();

  const [previewImage, setPreviewImage] = useState();
  const [imageUrl, setImageUrl] = useState();

  const onFinish = (values) => {};

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getBookCategory();
      if (res && res.data) {
        const d = res.data.map((item) => {
          return { label: item, value: item };
        });
        setOptions(d);
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    console.log("check selectedUpdate", selectedUpdate);
    if (selectedUpdate?._id) {
      const arrThumbnail = [
        {
          uid: uuidv4(),
          name: selectedUpdate.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            selectedUpdate.thumbnail
          }`,
        },
      ];

      const arrSlider = selectedUpdate?.slider?.map((item) => {
        return {
          uid: uuidv4(),
          name: item,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
        };
      });

      const init = {
        _id: selectedUpdate._id,
        mainText: selectedUpdate.mainText,
        author: selectedUpdate.author,
        price: selectedUpdate.price,
        category: selectedUpdate.category,
        quantity: selectedUpdate.quantity,
        sold: selectedUpdate.sold,
        thumbnail: { fileList: arrThumbnail },
        slider: { fileList: arrSlider },
      };
      setInitForm(init);
      setDataThumbnail(arrThumbnail);
      setDataSlider(arrSlider);
      form.setFieldsValue(init);
    }

    return () => {
      form.resetFields();
    };
  }, [selectedUpdate]);

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

  const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBookImg(file);
    if (res && res.data) {
      setDataThumbnail([
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi khi upload file");
    }
  };

  const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBookImg(file);
    if (res && res.data) {
      //copy previous state => upload multiple images
      setDataSlider((dataSlider) => [
        ...dataSlider,
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi khi upload file");
    }
  };

  const handleRemoveFile = (file, type) => {
    if (type === "thumbnail") {
      setDataThumbnail([]);
    }
    if (type === "slider") {
      const newSlider = dataSlider.filter((x) => x.uid !== file.uid);
      setDataSlider(newSlider);
    }
  };

  const handlePreview = async (file) => {
    if (file.url && !file.originFileObj) {
      setPreviewImage(file.url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    }
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    });
  };

  return (
    <>
      <Modal
        title="Chỉnh sửa sách"
        open={openUpdateBook}
        onOk={() => form.submit()}
        onCancel={() => {
          setOpenUpdateBook(false);
          form.resetFields();
          setInitForm(null);
          setSelectedUpdate(null);
          setOpenUpdateBook(null);
        }}
        width={"50vw"}
      >
        <Form
          name="Sửa thông tin sách"
          onFinish={onFinish}
          autoComplete="off"
          form={form}
        >
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
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Ảnh thumbnail" name="thumbnail">
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "16px", // Khoảng cách giữa các ảnh
                  }}
                >
                  <Upload
                    name="thumbnail"
                    listType="picture-card"
                    maxCount={1}
                    multiple={false}
                    beforeUpload={beforeUpload}
                    customRequest={handleUploadFileThumbnail}
                    onChange={handleChange}
                    onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                    onPreview={handlePreview}
                    fileList={dataThumbnail}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100px", // Đặt chiều rộng cố định cho mỗi ảnh
                    }}
                  >
                    <div>
                      {loading ? <LoadingOutlined /> : <PlusOutlined />}
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>
                </div>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Ảnh slider" name="slider">
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "16px", // Khoảng cách giữa các ảnh
                  }}
                >
                  <Upload
                    name="slider"
                    listType="picture-card"
                    multiple
                    beforeUpload={beforeUpload}
                    customRequest={handleUploadFileSlider}
                    onChange={(info) => handleChange(info, "slider")}
                    onPreview={handlePreview}
                    onRemove={(file) => handleRemoveFile(file, "slider")}
                    fileList={dataSlider}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100px", // Đặt chiều rộng cố định cho mỗi ảnh
                    }}
                  >
                    <div>
                      {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UpdateBook;
