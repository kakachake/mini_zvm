import axios from "axios";

const request = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "http://101.43.155.53:9001"
      : "/api",
  timeout: 10000,
});

export default request;
