import axios from "axios";
export const BASE_URL = "https://n-able-be.onrender.com/";
// export const BASE_URL =
//   "https://7597-2400-adc5-16b-5900-c029-2a21-f2ee-7054.ngrok-free.app";
export function axiosClient() {
  let defaultOptions = {
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      accept: "application/json",
    },
  };
  let instance = axios.create(defaultOptions);
  instance.interceptors.request.use(function (config) {
    config.headers.common = {
      "x-auth-token": `${localStorage.getItem("token")}`,
    };
    return config;
  });
  return instance;
}
export default axiosClient;
