import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Form,
  Checkbox,
  Divider,
  InputNumber,
  Button,
  Rate,
  Tabs,
  Pagination,
  notification,
  Spin,
} from "antd";
import "./home.scss";
import { useEffect, useState } from "react";
import { getBookCategory, getListBook } from "../../services/api";
const Home = () => {
  const [form] = Form.useForm();

  const [listCategory, setListCategory] = useState([]);

  const [filterQuery, setFilterQuery] = useState();
  const [sortQuery, setSortQuery] = useState("sort=-sold");
  const [listBook, setListBook] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [current, pageSize, filterQuery, sortQuery]);

  const fetchBook = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;

    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    if (filterQuery) {
      query += `&${filterQuery}`;
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
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getBookCategory();
      if (res.data) {
        const d = res.data.map((item) => {
          return {
            label: item,
            value: item,
          };
        });
        setListCategory(d);
      } else {
        notification.error({
          message: "Lỗi",
          description: res.data.message,
        });
      }
    };
    fetchCategory();
  }, []);

  const handleOnChangePage = (pagination) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  const handleChangeFilter = (changedValues, values) => {
    console.log(">>> check handleChangeFilter", changedValues, values);

    if (changedValues.category) {
      const cate = values.category;
      if (cate && cate.length > 0) {
        const f = cate.join(",");
        setFilterQuery(`category=${f}`);
      } else {
        setFilterQuery("");
      }
    }
  };

  const onFinish = (values) => {
    console.log("check value", values);
    if (values?.range?.from >= 0 && values.range.to >= 0) {
      let f = `price >=${values?.range?.from}&price<=${values?.range?.to}`;
      if (values?.category?.length) {
        const cate = values?.category?.join(",");
        f += `&category=${cate}`;
      }
      setFilterQuery(f);
    }
  };

  const items = [
    {
      key: "sort=-sold",
      label: `Phổ biến`,
      children: <></>,
    },
    {
      key: "sort=-createdAt",
      label: `Hàng Mới`,
      children: <></>,
    },
    {
      key: "sort=price",
      label: `Giá Thấp Đến Cao`,
      children: <></>,
    },
    {
      key: "sort=-price",
      label: `Giá Cao Đến Thấp`,
      children: <></>,
    },
  ];
  return (
    <div className="homepage-container" style={{ padding: "20px" }}>
      <Row gutter={[20, 20]}>
        <Col md={4} sm={0} xs={0}>
          <div style={{ marginBottom: "5px" }}>
            <span>
              <FilterTwoTone /> Bộ lọc tìm kiếm
            </span>
            <ReloadOutlined
              style={{ marginLeft: "10px" }}
              title="Reset"
              onClick={() => form.resetFields()}
            />
          </div>
          <Form
            onFinish={onFinish}
            form={form}
            onValuesChange={(changedValues, values) =>
              handleChangeFilter(changedValues, values)
            }
          >
            <Form.Item
              name="category"
              label="Danh mục sản phẩm"
              labelCol={{ span: 24 }}
            >
              <Checkbox.Group>
                <Row>
                  {listCategory?.map((item, index) => {
                    return (
                      <Col span={24} key={index}>
                        <Checkbox value={item.value}>{item.label}</Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Divider />
            <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <Form.Item name={["range", "from"]}>
                  <InputNumber
                    name="from"
                    min={0}
                    placeholder="đ TỪ"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
                <span>-</span>
                <Form.Item name={["range", "to"]}>
                  <InputNumber
                    name="to"
                    min={0}
                    placeholder="đ ĐẾN"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
              </div>
              <div>
                <Button
                  onClick={() => form.submit()}
                  style={{ width: "100%" }}
                  type="primary"
                >
                  Áp dụng
                </Button>
              </div>
            </Form.Item>
            <Divider />
            <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
              <div>
                <Rate
                  value={5}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text"></span>
              </div>
              <div>
                <Rate
                  value={4}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text">trở lên</span>
              </div>
              <div>
                <Rate
                  value={3}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text">trở lên</span>
              </div>
              <div>
                <Rate
                  value={2}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text">trở lên</span>
              </div>
              <div>
                <Rate
                  value={1}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text">trở lên</span>
              </div>
            </Form.Item>
          </Form>
        </Col>
        <Col md={20} xs={24}>
          <Row>
            <Tabs
              defaultActiveKey="1"
              items={items}
              onChange={(value) => setSortQuery(value)}
            />
          </Row>
          <Spin spinning={isLoading} tip="Loading...">
            <Row className="customize-row">
              {listBook.map((item, index) => {
                return (
                  <div className="column" key={index}>
                    <div className="wrapper">
                      <div className="thumbnail">
                        <img
                          src={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/images/book/${item.thumbnail}`}
                        />
                      </div>
                      <div className="text">{item.mainText}</div>
                      <div className="price">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price)}
                      </div>
                      <div className="rating">
                        <Rate
                          value={5}
                          disabled
                          style={{ color: "#ffce3d", fontSize: 10 }}
                        />
                        <span>Đã bán {item.sold}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Row>
          </Spin>
          <Divider />
          <Row style={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              current={current}
              pageSize={pageSize}
              total={total}
              responsive
              onChange={(p, s) =>
                handleOnChangePage({ current: p, pageSize: s })
              }
            />
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
