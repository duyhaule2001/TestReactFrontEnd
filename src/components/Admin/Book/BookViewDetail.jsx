import { Descriptions, Divider, Drawer, Image, Modal, Upload } from "antd";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const BookViewDetail = ({
  openModalView,
  setOpenModalView,
  selectedView,
  setSelectedView,
}) => {
  const onClose = () => {
    setOpenModalView(false);
    setSelectedView(null);
  };
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (selectedView) {
      let imgThumbnail = {},
        imgSlider = [];
      if (selectedView.thumbnail) {
        imgThumbnail = {
          uid: uuidv4(),
          name: selectedView.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            selectedView.thumbnail
          }`,
        };
      }
      if (selectedView.slider && selectedView.slider.length > 0) {
        selectedView.slider.map((item) => {
          imgSlider.push({
            uid: uuidv4(),
            name: selectedView.thumbnail,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          });
        });
      }
      setFileList([imgThumbnail, ...imgSlider]);
    }
  }, [selectedView]);

  const handleCancel = () => {
    setPreviewOpen(false);
    setOpenModalView(false);
    setPreviewImage("");
    setSelectedView(null);
  };
  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.url);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  return (
    <>
      <Drawer
        title="Chức năng xem chi tiết"
        onClose={onClose}
        open={openModalView}
        width={"50%"}
      >
        {selectedView && (
          <Descriptions column={2} bordered title="Thông tin book">
            <Descriptions.Item label="Id">
              {selectedView?._id}
            </Descriptions.Item>
            <Descriptions.Item label="Tên sách">
              {selectedView?.mainText}
            </Descriptions.Item>
            <Descriptions.Item label="Tác giả">
              {selectedView?.author}
            </Descriptions.Item>
            <Descriptions.Item label="Giá tiền">
              {selectedView?.price}
            </Descriptions.Item>
            <Descriptions.Item label="Số lượng">
              {selectedView?.quantity}
            </Descriptions.Item>
            <Descriptions.Item label="Đã bán">
              {selectedView?.sold}
            </Descriptions.Item>
            <Descriptions.Item span={2} label="Thể loại">
              {selectedView?.category}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {moment(selectedView?.createdAt).format("DD-MM-YYYY HH:mm:ss")}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {moment(selectedView?.updatedAt).format("DD-MM-YYYY HH:mm:ss")}
            </Descriptions.Item>
          </Descriptions>
        )}
        <Divider orientation="left">Ảnh Book</Divider>
        <Upload
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={{ showRemoveIcon: false }}
          onCl
        ></Upload>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Drawer>
    </>
  );
};

export default BookViewDetail;
