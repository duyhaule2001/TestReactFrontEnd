import { Row, Col, Rate, Divider, Button, Input, InputNumber } from "antd";
import "./book.scss";
import ImageGallery from "react-image-gallery";
import { useRef, useState } from "react";
import ModalGallery from "./ModalGallery";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BsCartPlus } from "react-icons/bs";
import BookLoader from "./BookLoader";
import { useDispatch } from "react-redux";
import { doAddBookAction } from "../../redux/order/orderSlice";

const ViewDetail = ({ bookData }) => {
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const refGallery = useRef(null);

  const images = bookData?.items ?? [];

  const [currentQuantity, setCurrentQuantity] = useState(1);

  const dispatch = useDispatch();

  const handleOnClickImage = () => {
    //get current index onClick
    // alert(refGallery?.current?.getCurrentIndex());
    setIsOpenModalGallery(true);
    setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
    // refGallery?.current?.fullScreen()
  };

  const handleChangeButton = (type) => {
    if (type === "Min") {
      if (currentQuantity - 1 <= 0) return;
      setCurrentQuantity(currentQuantity - 1);
    }

    if (type === "Max") {
      if (currentQuantity === +bookData.quantity) return;
      setCurrentQuantity(currentQuantity + 1);
    }
  };

  // Hàm thay đổi giá trị thông qua input
  const handleInputChange = (value) => {
    if (!isNaN(value)) {
      if (+value > 0 && +value < +bookData.quantity) {
        setCurrentQuantity(+value);
      }
    }
  };

  const handleAddToCart = (quantity, book) => {
    dispatch(doAddBookAction({ quantity, detail: book, _id: book._id }));
  };

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="view-detail-book"
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          minHeight: "calc(100vh - 150px)",
        }}
      >
        <div style={{ padding: "20px", background: "#fff", borderRadius: 5 }}>
          {bookData && bookData._id ? (
            <Row gutter={[20, 20]}>
              <Col md={10} sm={0} xs={0}>
                <ImageGallery
                  ref={refGallery}
                  items={images}
                  showPlayButton={false} //hide play button
                  showFullscreenButton={false} //hide fullscreen button
                  renderLeftNav={() => <></>} //left arrow === <> </>
                  renderRightNav={() => <></>} //right arrow === <> </>
                  slideOnThumbnailOver={false} //onHover => auto scroll images
                  onClick={() => handleOnClickImage()}
                />
              </Col>
              <Col md={14} sm={24}>
                <Col md={0} sm={24} xs={24}>
                  <ImageGallery
                    ref={refGallery}
                    items={images}
                    showPlayButton={false} //hide play button
                    showFullscreenButton={false} //hide fullscreen button
                    renderLeftNav={() => <></>} //left arrow === <> </>
                    renderRightNav={() => <></>} //right arrow === <> </>
                    showThumbnails={false}
                  />
                </Col>
                <Col span={24}>
                  <div className="author">
                    Tác giả: <a href="#">{bookData.author}</a>{" "}
                  </div>
                  <div className="title">{bookData.mainText}</div>
                  <div className="rating">
                    <Rate
                      value={5}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 12 }}
                    />
                    <span className="sold">
                      <Divider type="vertical" />
                      {bookData.sold}
                    </span>
                  </div>
                  <div className="price">
                    <span className="currency">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(bookData.price)}
                    </span>
                  </div>
                  <div className="delivery">
                    <div>
                      <span className="left">Vận chuyển</span>
                      <span className="right">Miễn phí vận chuyển</span>
                    </div>
                  </div>
                  <div className="quantity">
                    <span className="left">{bookData.quantity}</span>
                    <span className="right">
                      <button onClick={() => handleChangeButton("Min")}>
                        <MinusOutlined />
                      </button>
                      <input
                        value={currentQuantity}
                        onChange={(event) =>
                          handleInputChange(event.target.value)
                        }
                      />
                      <button onClick={() => handleChangeButton("Max")}>
                        <PlusOutlined />
                      </button>
                    </span>
                  </div>
                  <div className="buy">
                    <button
                      className="cart"
                      onClick={() => handleAddToCart(currentQuantity, bookData)}
                    >
                      <BsCartPlus className="icon-cart" />
                      <span>Thêm vào giỏ hàng</span>
                    </button>
                    <button className="now">Mua ngay</button>
                  </div>
                </Col>
              </Col>
            </Row>
          ) : (
            <BookLoader />
          )}
        </div>
      </div>
      <ModalGallery
        isOpen={isOpenModalGallery}
        setIsOpen={setIsOpenModalGallery}
        currentIndex={currentIndex}
        items={images}
        title={"hardcode"}
      />
    </div>
  );
};

export default ViewDetail;
