import { Col, Divider, InputNumber, Radio, Row } from "antd";
import "./order.scss";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  doDeleteItemCartAction,
  doUpdateAction,
} from "../../redux/order/orderSlice";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";

const Payment = ({ setCurrentStep }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.order.carts);

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

  const handlePlaceOrder = () => {
    setCurrentStep(2);
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
              <div className="info">
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
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Payment;
