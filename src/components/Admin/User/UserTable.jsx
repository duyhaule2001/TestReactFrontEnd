import React, { useEffect, useState } from "react";
import { Table, Row, Col, Button } from "antd";
import InputSearch from "./InputSearch";
import { callFetchListUser } from "../../../services/api";
import UserInfo from "./UserInfo";
import {
  CloudUploadOutlined,
  ExportOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import CreateUser from "./CreateUser";
import ImportUser from "./ImportUser";

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
    setFilterQuery(query);
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
          <>
            <button>Delete</button>
          </>
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
            <Button>
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
        </Col>
      </Row>
    </>
  );
};

export default UserTable;
