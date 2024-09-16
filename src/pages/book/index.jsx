import { useLocation } from "react-router-dom";
import BooksTable from "../../components/Admin/Book/BookTable";

const BookPage = () => {
  let location = useLocation();
  console.log("check location", location);
  let params = new URLSearchParams(location.search);
  const id = params.get("id");

  console.log("check book id", id);
  return <>book page</>;
};

export default BookPage;
