import { InboxOutlined } from "@ant-design/icons";
import { Modal, message, Upload, Table, notification } from "antd";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import SampleExcel from "./data/template.xlsx?url";
import { importUserApi } from "../../../services/api";

const ImportUser = ({ openImport, setOpenImport, fetchUser }) => {
  const [dataExcel, setDataExcel] = useState([]);

  console.log("dataexcel", dataExcel);

  const handleSubmit = async () => {
    const data = dataExcel.map((item) => {
      item.password = "123456";
      return item;
    });
    console.log("data", data);

    const res = await importUserApi(data);
    if (res.data) {
      notification.success({
        message: `Thành công: ${res.data.countSuccess}, Error: ${res.data.countError}`,
        description: "Import thành công",
      });
      await fetchUser();
      setOpenImport(false);
      setDataExcel([]);
    } else {
      notification.error({
        message: "Có lỗi",
        description: res.data.message,
      });
    }
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
        onOk={handleSubmit}
        maskClosable={false}
        onCancel={() => {
          setOpenImport(false);
          setDataExcel([]);
        }}
        okButtonProps={{
          disabled: dataExcel.length < 1,
        }}
        okText="Import Data"
      >
        <Dragger {...props} showUploadList={dataExcel.length > 0}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            <a href={SampleExcel} onClick={(e) => e.stopPropagation()} download>
              Download Sample File
            </a>
          </p>
        </Dragger>
        <Table
          title={() => <span>Dữ liệu upload:</span>}
          rowKey="id"
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
