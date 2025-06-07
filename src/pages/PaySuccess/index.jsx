import React, { useEffect, useRef } from "react";
import "./PaySuccess.css";
import { useSearchParams } from "react-router-dom";
import { height } from "@fortawesome/free-brands-svg-icons/fa42Group";
import Axios from "../../util/axios";
export default function PaySuccess() {
  const [searchParams] = useSearchParams();
  const amount = searchParams.get("vnp_Amount");
  const allowRun = useRef(false);
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
  useEffect(() => {
    if (allowRun.current) return;
    allowRun.current = true;
    let paramsObject = Object.fromEntries(searchParams.entries());
    console.log(paramsObject);
    // console.log("/checkPayment?" + searchParams);
    Axios.get("/checkPayment?" + searchParams).then((res) => {
      if (res.data.code == 200) {
        Axios.put("/orderUpdateStatus", {
          id_order: localStorage.getItem("id_order"),
        }).then((res) => {
          if (res.data.code == 200) {
            Axios.post("/payment", {
              id_order: localStorage.getItem("id_order"),
              transaction_id: paramsObject.vnp_TransactionNo,
              payment_status: "Thành Công",
            }).then((res) => {
              localStorage.removeItem("id_order");
            });
          }
        });
      }
    });
  }, []);
  return (
    <div style={styles.container}>
      <h1 style={{ color: "green" }}>🎉 Thanh toán thành công!</h1>
      {amount && (
        <p>Bạn đã thanh toán: {(amount / 100).toLocaleString()} VND</p>
      )}
      {/* <a href="/" style={styles.link}>
        Quay về trang chủ
      </a> */}
    </div>
  );
}
