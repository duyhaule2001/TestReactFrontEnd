import { useLocation } from "react-router-dom";
import ViewDetail from "../../components/Book/ViewDetail";
import { getBookDetail } from "../../services/api";
import { useEffect, useState } from "react";

const BookPage = () => {
  const [bookData, setBookData] = useState([]);
  let location = useLocation();
  console.log("check location", location);
  let params = new URLSearchParams(location.search);
  const id = params.get("id");

  useEffect(() => {
    fetchBook(id);
  }, [id]);

  const fetchBook = async (id) => {
    const res = await getBookDetail(id);
    if (res && res.data) {
      let raw = res.data;
      raw.items = getImages(raw);

      setBookData(raw);
    }
  };

  const getImages = (raw) => {
    const images = [];
    if (raw.thumbnail) {
      images.push({
        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          raw.thumbnail
        }`,
        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          raw.thumbnail
        }`,
        originalClass: "original-image",
        thumbnailClass: "thumbnail-image",
      });
    }

    if (raw.slider) {
      raw.slider?.map((item) => {
        images.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          originalClass: "original-image",
          thumbnailClass: "thumbnail-image",
        });
      });
    }

    return images;
  };

  return (
    <>
      <ViewDetail bookData={bookData} />
    </>
  );
};

export default BookPage;
