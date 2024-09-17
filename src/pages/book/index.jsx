import { useLocation } from "react-router-dom";
import ViewDetail from "../../components/Book/ViewDetail";

const BookPage = () => {
  let location = useLocation();
  console.log("check location", location);
  let params = new URLSearchParams(location.search);
  const id = params.get("id");

  console.log("check book id", id);
  return (
    <>
      <ViewDetail />
    </>
  );
};

export default BookPage;
