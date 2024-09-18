import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  notification,
  Radio,
  Row,
} from "antd";
import "./order.scss";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  doDeleteItemCartAction,
  doPlaceOrderAction,
  doUpdateAction,
} from "../../redux/order/orderSlice";
import { useEffect, useState } from "react";
import { createOrder } from "../../services/api";

const Payment = ({ setCurrentStep }) => {
  const [form] = Form.useForm();
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.order.carts);
  const user = useSelector((state) => state.account.user);

  useEffect(() => {
    if (cart && cart.length > 0) {
      let sum = 0;
      cart.map((item) => {
        sum += item.quantity * item.detail.price;
      });
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [cart]);

  const handleOnChangeInput = (value, book) => {
    if (!value || value < 1) return;
    if (!isNaN(value)) {
      dispatch(
        doUpdateAction({ quantity: value, detail: book, _id: book._id })
      );
    }
  };

  const onFinish = async (values) => {
    const detail = cart.map((item) => {
      return {
        bookName: item.detail.mainText,
        quantity: item.detail.quantity,
        _id: item.detail._id,
      };
    });

    const data = {
      name: values.fullName,
      address: values.address,
      phone: values.phone,
      totalPrice: totalPrice,
      detail: detail,
    };

    const res = await createOrder(data);
    if (res.data) {
      message.success("Đặt hàng thành công");
      setCurrentStep(2);
      dispatch(doPlaceOrderAction());
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="order-container"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <Row gutter={[20, 20]}>
          <Col md={16} xs={24}>
            {cart.map((book, index) => {
              const sumBookTotal = book?.detail?.price * book.quantity;
              return (
                <div className="order-book" key={index}>
                  <div className="book-content">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                        book?.detail?.thumbnail
                      }`}
                    />
                    <div className="title">{book?.detail?.mainText}</div>
                    <div className="price">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(book?.detail?.price)}
                    </div>
                  </div>
                  <div className="action">
                    <div className="quantity">
                      <InputNumber
                        onChange={(value) => handleOnChangeInput(value, book)}
                        value={book?.quantity}
                      />
                    </div>
                    <div className="sum">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(sumBookTotal)}
                    </div>
                    <DeleteOutlined
                      onClick={() =>
                        dispatch(doDeleteItemCartAction({ _id: book?._id }))
                      }
                      style={{ color: "red" }}
                    />
                  </div>
                </div>
              );
            })}
          </Col>
          <Col md={8} xs={24}>
            <div className="order-sum">
              <Form
                onFinish={onFinish}
                form={form}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  label="Tên người nhận"
                  name="fullName"
                  initialValue={user?.fullName}
                  rules={[
                    {
                      required: true,
                      message: "Trường này không được để trống!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  initialValue={user?.phone}
                  rules={[
                    {
                      required: true,
                      message: "Trường này không được để trống!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Địa chỉ"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Trường này không được để trống!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Hình thức thanh toán"
                  rules={[
                    {
                      required: true,
                      message: "Trường này không được để trống!",
                    },
                  ]}
                >
                  <Radio defaultChecked>Thanh toán khi nhận hàng </Radio>
                </Form.Item>

                <div className="calculate">
                  <span> Tổng tiền</span>
                  <span className="sum-final">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(totalPrice || 0)}
                  </span>
                </div>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Thanh Toán
                  </Button>
                </Form.Item>
              </Form>

              {/* <div className="info">
                <div className="method">
                  <div> Hình thức thanh toán</div>
                  <Radio checked>Thanh toán khi nhận hàng</Radio>
                </div>
                <Divider style={{ margin: "10px 0" }} />
                <div className="address">
                  <div> Địa chỉ nhận hàng</div>
                  <TextArea rows={4} />
                </div>
              </div>
              <div className="calculate">
                <span> Tạm tính</span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice || 0)}
                </span>
              </div>
              <Divider style={{ margin: "10px 0" }} />
              <div className="calculate">
                <span> Tổng tiền</span>
                <span className="sum-final">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice || 0)}
                </span>
              </div>
              <Divider style={{ margin: "10px 0" }} />
              <button onClick={() => handlePlaceOrder()}>
                Đặt Hàng ({cart?.length ?? 0})
              </button> */}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Payment;
