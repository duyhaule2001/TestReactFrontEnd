import { Card, Col, notification, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import { fetchDataDashBoard } from "../../services/api";
import CountUp from "react-countup";

const AdminPage = () => {
  const [dataDashBoard, setDataDashBoard] = useState({
    countOrder: 0,
    countUser: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchDataDashBoard();
      if (res.data) {
        setDataDashBoard(res.data);
      }
    };

    fetchData();
  }, []);

  const formatter = (value) => <CountUp end={value} separator="," />;
  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Tổng User" bordered={false}>
            <Statistic formatter={formatter} value={dataDashBoard.countUser} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Tổng Đơn hàng" bordered={false}>
            <Statistic formatter={formatter} value={dataDashBoard.countOrder} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminPage;
