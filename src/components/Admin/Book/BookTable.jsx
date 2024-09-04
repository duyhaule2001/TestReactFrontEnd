import { Button, notification, Table } from "antd";
import React, { useEffect, useState } from "react";
import { getListBook } from "../../../services/api";
import SearchBook from "./SearchBook";
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import BookViewDetail from "./BookViewDetail";
import moment from "moment";
import CreateBook from "./CreateBook";

const BooksTable = () => {
  const [listBook, setListBook] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const [filterQuery, setFilterQuery] = useState();
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

  const [openModalView, setOpenModalView] = useState(false);

  const [selectedView, setSelectedView] = useState(null);

  const [openCreateBook, setOpenCreateBook] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [current, pageSize, filterQuery, sortQuery]);

  const fetchBook = async () => {
    let query = `current=${current}&pageSize=${pageSize}`;

    if (filterQuery) {
      query += `&${filterQuery}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    const res = await getListBook(query);
    if (res.data) {
      setListBook(res.data.result);
      setCurrent(res.data.meta.current);
      setPageSize(res.data.meta.pageSize);
      setTotal(res.data.meta.total);
    } else {
      notification.error({
        message: "Lỗi",
        description: res.message,
      });
    }
  };

  const handleOnChangeTable = (pagination, filters, sorter, extra) => {
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
  };
  const handleSearch = (query) => {
    setFilterQuery(query);
  };

  const columns = [
    {
      title: "id",
      render: (record) => {
        return (
          <a
            href="#"
            onClick={() => {
              setOpenModalView(true);
              setSelectedView(record);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Tên Sách",
      dataIndex: "mainText",
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      sorter: true,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      sorter: true,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      sorter: true,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      sorter: true,
      render: (text) => {
        return moment(text).format("DD-MM-YYYY HH:mm:ss");
      },
    },
    {
      title: "Action",
      render: () => {
        return (
          <div>
            <EditOutlined style={{ color: "blue", marginRight: "10px" }} />
            <DeleteOutlined style={{ color: "red" }} />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <SearchBook handleSearch={handleSearch} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "0 10px",
          height: "50px",
        }}
      >
        <span>Table List Book</span>
        <div>
          <Button type="primary" style={{ marginRight: "5px" }}>
            <ExportOutlined />
            Export
          </Button>
          <Button
            onClick={() => setOpenCreateBook(true)}
            type="primary"
            style={{ marginRight: "5px" }}
          >
            <PlusOutlined /> Thêm mới
          </Button>
          <Button onClick={() => setFilterQuery("")} type="primary">
            <ReloadOutlined />
          </Button>
        </div>
      </div>
      <Table
        dataSource={listBook}
        columns={columns}
        rowKey="_id"
        onChange={handleOnChangeTable}
        pagination={{
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
        }}
      />
      <BookViewDetail
        setOpenModalView={setOpenModalView}
        openModalView={openModalView}
        selectedView={selectedView}
      />
      <CreateBook
        setOpenCreateBook={setOpenCreateBook}
        openCreateBook={openCreateBook}
        fetchBook={fetchBook}
      />
    </>
  );
};

export default BooksTable;
