import React from "react";
import "./PayFail.css";
import { useSearchParams } from "react-router-dom";
export default function PayFail() {
  const [searchParams] = useSearchParams();
  const amount = searchParams.get("vnp_Amount");
  const styles = {
    container: {
      textAlign: "center",
      padding: "60px",
      fontFamily: "sans-serif",
      height: "70vh",
      lineheight: "70vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    },
  };
  return (
    <div style={styles.container}>
      <h1 style={{ color: "red" }}>❌ Thanh toán thất bại!</h1>
      <p>Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.</p>
    </div>
  );
}
