import React, { useEffect, useState } from "react";
import { Table, Row, Col, Button, Popconfirm, notification } from "antd";
import InputSearch from "./InputSearch";
import { callFetchListUser, deleteUser } from "../../../services/api";
import UserInfo from "./UserInfo";
import {
  CloudUploadOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import CreateUser from "./CreateUser";
import ImportUser from "./ImportUser";
import UpdateUser from "./UpdateUser";

const UserTable = () => {
  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [filterQuery, setFilterQuery] = useState();
  const [sortQuery, setSortQuery] = useState();
  const [loading, setLoading] = useState(false);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [openImport, setOpenImport] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const [userUpdate, setUserUpdate] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [current, pageSize, filterQuery, sortQuery]);

  const fetchUser = async () => {
    setLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;

    if (filterQuery) {
      query += `&${filterQuery}`;
    }

    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    const res = await callFetchListUser(query);
    if (res && res.data) {
      setListUser(res.data.result);
      setTotal(res.data.meta.total);
    }
    setLoading(false);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }

    if (sorter && sorter.field) {
      const q =
        sorter.order === "ascend"
          ? `sort=${sorter.field}`
          : `sort=-${sorter.field}`;
      setSortQuery(q);
    }
    console.log("params", pagination, filters, sorter, extra);
  };

  const handleSearch = (query) => {
    setCurrent(1);
    setFilterQuery(query);
  };

  const handleDownloadExcel = () => {
    if (listUser.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(listUser);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "DataSheet.csv");
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteUser(id);
    if (res.data) {
      notification.success({
        message: "Thành công",
        description: "Xoá người dùng thành công",
      });
      fetchUser();
    } else {
      notification.error({
        message: "Lỗi",
        description: res.message,
      });
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      render: (_, record) => {
        return (
          <a
            href="#"
            onClick={() => {
              setOpenDrawer(true);
              setSelectedUser(record);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Tên hiển thị",
      dataIndex: "fullName",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: true,
    },
    {
      title: "Action",
      render: (text, record, index) => {
        return (
          <div className="flex items-center justify-center space-x-3">
            <EditOutlined
              onClick={() => {
                setOpenUpdate(true);
                setUserUpdate(record);
              }}
              style={{ color: "blue" }}
            />
            <Popconfirm
              title="Xoá người dùng"
              description="Bạn có chắc chắn muốn xoá không?"
              okText="Xoá"
              cancelText="Không"
              placement="leftTop"
              onConfirm={() => handleDelete(record._id)}
            >
              <DeleteOutlined style={{ marginLeft: "10px", color: "red" }} />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearch
            handleSearch={handleSearch}
            setSortQuery={setSortQuery}
          />
        </Col>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            padding: "0 20px",
          }}
        >
          <span>Table List Users</span>
          <span style={{ display: "flex", gap: 15 }}>
            <Button onClick={() => handleDownloadExcel()}>
              <ExportOutlined />
              Export
            </Button>
            <Button
              onClick={() => {
                setOpenImport(true);
              }}
            >
              <CloudUploadOutlined />
              Import
            </Button>
            <Button onClick={() => setIsOpenModal(true)}>Thêm mới</Button>
            <Button>
              <ReloadOutlined
                onClick={() => {
                  setSortQuery("");
                  setFilterQuery("");
                }}
              />
            </Button>
          </span>
        </div>
        <Col span={24}>
          <Table
            className="def"
            columns={columns}
            dataSource={listUser}
            onChange={onChange}
            rowKey="_id"
            loading={loading}
            pagination={{
              current: current,
              pageSize: pageSize,
              showSizeChanger: true,
              total: total,
              showTotal: (total, range) => {
                return (
                  <div>
                    {range[0]}-{range[1]} trên {total} rows
                  </div>
                );
              },
            }}
          />
          <UserInfo
            setOpenDrawer={setOpenDrawer}
            openDrawer={openDrawer}
            selectedUser={selectedUser}
          />
          <CreateUser
            setIsOpenModal={setIsOpenModal}
            isOpenModal={isOpenModal}
            fetchUser={fetchUser}
          />
          <ImportUser
            fetchUser={fetchUser}
            openImport={openImport}
            setOpenImport={setOpenImport}
          />
          <UpdateUser
            setOpenUpdate={setOpenUpdate}
            openUpdate={openUpdate}
            userUpdate={userUpdate}
            fetchUser={fetchUser}
          />
        </Col>
      </Row>
    </>
  );
};

export default UserTable;
