import { current } from "@reduxjs/toolkit";
import axios from "../utils/axios-customize";

export const callRegister = (fullName, email, password, phone) => {
  return axios.post("/api/v1/user/register", {
    fullName,
    email,
    password,
    phone,
  });
};

export const callLogin = (username, password) => {
  return axios.post("/api/v1/auth/login", { username, password });
};

export const callFetchAccount = () => {
  return axios.get("/api/v1/auth/account");
};

export const callLogout = () => {
  return axios.post("/api/v1/auth/logout");
};

export const callFetchListUser = (query) => {
  return axios.get(`/api/v1/user?${query}`);
};

export const createUserApi = (fullName, password, email, phone) => {
  return axios.post(`/api/v1/user`, { fullName, password, email, phone });
};

export const importUserApi = (data) => {
  return axios.post("/api/v1/user/bulk-create", data);
};

export const updateUser = (data) => {
  return axios.put("/api/v1/user", data);
};

export const deleteUser = (id) => {
  return axios.delete(`/api/v1/user/${id}`);
};

export const getListBook = (query) => {
  return axios.get(`/api/v1/book?${query}`);
};

export const getBookCategory = () => {
  return axios.get("/api/v1/database/category");
};

export const callUploadBookImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "book",
    },
  });
};

export const createBook = (data) => {
  return axios.post("/api/v1/book", data);
};

export const updateBook = (
  id,
  thumbnail,
  slider,
  mainText,
  author,
  price,
  sold,
  quantity,
  category
) => {
  return axios.put(`/api/v1/book/${id}`, {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    sold,
    quantity,
    category,
  });
};

export const deleteBook = (id) => {
  return axios.delete(`/api/v1/book/${id}`);
};

export const getBookDetail = (id) => {
  return axios.get(`/api/v1/book/${id}`);
};

export const createOrder = (data) => {
  return axios.post("/api/v1/order", data);
};

export const getHistoryOrder = () => {
  return axios.get("/api/v1/history");
};

export const updateUserInfo = (_id, avatar, phone, fullName) => {
  return axios.put("/api/v1/user", {
    _id,
    avatar,
    phone,
    fullName,
  });
};

export const updateAvatar = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "avatar",
    },
  });
};

export const changePassword = (email, oldpass, newpass) => {
  return axios.post("/api/v1/user/change-password", {
    email,
    oldpass,
    newpass,
  });
};

export const fetchDataDashBoard = () => {
  return axios.get("/api/v1/database/dashboard");
};
