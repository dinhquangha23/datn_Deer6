import axios from "axios";
const Axios = axios.create({
  baseURL: import.meta.env.VITE_APP_API, // đường dẫn của backend
});

Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Hoặc từ nơi bạn lưu trữ token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi là 401 và chưa từng thử refresh
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_APP_API}refreshtoken`,
          {
            refreshToken: localStorage.getItem("refreshToken"),
          }
        );

        let accessToken = refreshResponse.data.accessToken;
        localStorage.setItem("accessToken", accessToken);

        // Cập nhật lại header và gửi lại request gốc
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return Axios(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token thất bại", refreshError);
        // Optional: chuyển hướng về login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default Axios;
