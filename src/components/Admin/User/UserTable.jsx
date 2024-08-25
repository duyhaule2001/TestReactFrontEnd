import React, { useEffect, useState } from "react";
import { Table, Row, Col } from "antd";
import InputSearch from "./InputSearch";
import { callFetchListUser } from "../../../services/api";

const UserTable = () => {
  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [current, pageSize]);

  const fetchUser = async (searchFilter) => {
    setLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;

    if (searchFilter) {
      query += `&${searchFilter}`;
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
    console.log("params", pagination, filters, sorter, extra);
  };

  const handleSearch = (query) => {
    fetchUser(query);
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
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
          <InputSearch handleSearch={handleSearch} />
        </Col>
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
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default UserTable;
