import { InboxOutlined } from "@ant-design/icons";
import { Modal, message, Upload, Table } from "antd";
import React, { useState } from "react";
import { json } from "react-router-dom";
import * as XLSX from "xlsx";

const ImportUser = ({ openImport, setOpenImport }) => {
  const [dataExcel, setDataExcel] = useState([]);
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };

  const { Dragger } = Upload;
  const props = {
    name: "file",
    multiple: false,
    maxCount: 1,
    // action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    accept:
      ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    customRequest: dummyRequest,
    onChange(info) {
      console.log("check info", info);
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj;
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = function (e) {
            const data = new Uint8Array(reader.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, {
              header: ["fullName", "email", "phone"],
              range: 1, //skip header row
            });
            if (json && json.length > 0) setDataExcel(json);
          };
        }

        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <>
      <Modal
        title="Basic Modal"
        open={openImport}
        onOk={handleOk}
        onCancel={() => setOpenImport(false)}
        okText="Import Data"
      >
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from
            uploading company data or other banned files.
          </p>
        </Dragger>
        <Table
          title={() => <span>Dữ liệu upload:</span>}
          dataSource={dataExcel}
          columns={[
            { dataIndex: "fullName", title: "Tên hiển thị" },
            { dataIndex: "email", title: "Email" },
            { dataIndex: "phone", title: "Số điện thoại" },
          ]}
        />
      </Modal>
    </>
  );
};

export default ImportUser;
