import { Col, Row, Skeleton } from "antd";
import React from "react";

const BookLoader = () => {
  return (
    <Row gutter={[20, 20]}>
      <Col md={10} sm={0} xs={0}>
        <Skeleton.Input
          active={true}
          block={true}
          style={{
            width: "100%",
            height: 350,
          }}
        />
        <div
          style={{
            display: "flex",
            gap: 20,
            justifyContent: "center",
            overflow: "hidden",
            marginTop: "20px",
          }}
        >
          <Skeleton.Image active={true} />
          <Skeleton.Image active={true} /> <Skeleton.Image active={true} />
        </div>
      </Col>

      <Col md={14} sm={24}>
        <div>
          <Skeleton />
          <Skeleton style={{ marginTop: "40px" }} />
        </div>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: 20,
          }}
        >
          <Skeleton.Button size="large" />
          <Skeleton.Button size="large" />
        </div>
      </Col>
    </Row>
  );
};

export default BookLoader;
