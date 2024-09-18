import { notification, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { getHistoryOrder } from "../../services/api";
import moment from "moment";

const OrderHistory = () => {
  const [listHistory, setListHistory] = useState([]);

  useEffect(() => {
    const fetchListHistory = async () => {
      const res = await getHistoryOrder();
      if (res.data) {
        setListHistory(res.data);
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    };
    fetchListHistory();
  }, []);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (item, record, index) => <>{index + 1}</>,
    },

    {
      title: "Thời gian",
      dataIndex: "createdAt",
      render: (item, record, index) => {
        return moment(item).format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalPrice",
      render: (item, record, index) => {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(item);
      },
    },
    {
      title: "Trạng thái",
      render: (_, { tags }) => <Tag color="cyan">Thành công</Tag>,
    },
    {
      title: "Chi tiết",
      render: (record) => (
        <ReactJson
          src={record.detail}
          name={"Chi tiết đơn mua"}
          collapsed={true}
          enableClipboard={false}
          displayDataTypes={false}
          displayObjectSize={false}
        />
      ),
    },
  ];
  return (
    <>
      <div>Lịch sử mua hàng</div>
      <Table dataSource={listHistory} columns={columns} />
    </>
  );
};

export default OrderHistory;
