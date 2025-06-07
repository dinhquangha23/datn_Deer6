import "./App.css";
import Header from "./component/Header";
import Container from "./component/Container/container";
import Footer from "./component/Footer/footer";
import {
  AllProduct,
  CartProduct,
  ProductDetail,
  LoginPage,
  PayPage,
  ProfileDetail,
  DashBoard,
  AccountManage,
  ProductManage,
  CategoryManage,
  PaySuccess,
  PayFail,
  OrderTracking,
  SizeManage,
  ColorManage,
  PaymentManage,
  ProductVariantManage,
} from "./pages";
import SearchSide from "./component/SearchSide/SearchSide";

import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Bounce } from "react-toastify/unstyled";
function App() {
  const notify = function (no) {
    no;
  };
  const location = useLocation();
  const isLoginPage =
    location.pathname === "/login" || location.pathname.includes("/dashboard");
  const navigate = useNavigate();
  // console.log("location ", isLoginPage);
  const [showSearch, setShowSearch] = useState(false);
  const toggleShowSearch = () => {
    setShowSearch(!showSearch);
  };
  useEffect(() => {
    console.log(location.pathname);
    if (location.pathname !== "/pay") {
      localStorage.removeItem("payRightNow");
    }
  }, []);
  useEffect(() => {
    if (
      ["/cart", "/order_tracking", "/profiledetail"].includes(location.pathname)
    ) {
      localStorage.getItem("token") == null && navigate("/login");
    }
  });

  return (
    <>
      {!isLoginPage && <Header toggle={toggleShowSearch} />}
      <Routes>
        {/* <Route path="/" Component={Container}/> // componet không cần thẻ đóng mở mà chỉ cần truyền tên vào là được */}
        {/* start dash board */}
        <Route path="/dashboard" element={<DashBoard noti={notify} />}>
          <Route
            path="accountmanage"
            element={<AccountManage noti={notify} />}
          />
          <Route
            path="productmanage"
            element={<ProductManage noti={notify} />}
          />
          <Route
            path="categorymanage"
            element={<CategoryManage noti={notify} />}
          />
          <Route path="sizemanage" element={<SizeManage noti={notify} />} />
          <Route path="colormanage" element={<ColorManage noti={notify} />} />
          <Route
            path="paymentmanage"
            element={<PaymentManage noti={notify} />}
          />
          <Route
            path="productvariantmanage"
            element={<ProductVariantManage noti={notify} />}
          />
        </Route>
        {/* end dash board */}
        <Route path="/login" element={<LoginPage noti={notify} />} />
        <Route path="/profiledetail" element={<ProfileDetail />} />
        <Route path="/pay" element={<PayPage noti={notify} />} />
        <Route path="/all_products" element={<AllProduct />} />
        <Route path="/all_products/:category" element={<AllProduct />} />
        <Route path="/paysuccess" element={<PaySuccess />} />
        <Route path="/payfail" element={<PayFail />} />
        <Route path="/order_tracking" element={<OrderTracking />} />
        <Route
          path="/product_detail/:id"
          element={<ProductDetail noti={notify} />}
        />
        <Route path="/cart" element={<CartProduct />} />
        <Route path="/" element={<Container />} />
      </Routes>
      {<SearchSide isShow={showSearch} toggleshow={toggleShowSearch} />}

      {/* {showSearch?<SearchSide isShow={showSearch} toggleshow={toggleShowSearch}/>:<Fragment/>} */}
      {!isLoginPage && <Footer />}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
}

export default App;
