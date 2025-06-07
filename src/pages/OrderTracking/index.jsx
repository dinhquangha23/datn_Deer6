import React, { useEffect, useState } from "react";
import "./OrderTracking.css";
import OrderItem from "../../component/OrderItem/OrderItem";
import Axios from "../../util/axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
export default function OrderTracking() {
  const [dataTrack, setDataTrack] = useState([]);

  useEffect(() => {
    Axios.get("/orderTracking").then((res) => {
      setDataTrack(res.data.data);
    });
  }, []);
  // const handleSeeMore = () => {
  //   setMore((pre) => !pre);
  // };
  console.log(dataTrack);

  return (
    <div className="container">
      <div className="order_track_content">
        <div className="Title_tracking">
          <span>Theo dõi trạn thái đơn hàng</span>
        </div>
        {!dataTrack && (
          <h1 style={{ lineHeight: "30vh" }}>Chưa có đơn hàng nào</h1>
        )}
        {/* <div
          style={{
            ...baseStyle,
            maxHeight: more ? "500px" : "250px",
          }}
          className="wrap_tracking "
        >
          <div className="info_order">
            <div className="logo_tracking">
              <img
                src="https://deer6.vn/wp-content/uploads/2024/10/Untitled-2.png"
                alt=""
              />
            </div>
            <div className="info_delivery">
              <span>Mã đơn Hàng:</span>
              <span>Họ và Tên : Đinh quang hà</span>
              <span>địa chỉ: Thị trấn tân thanh - Thanh liêm - Ha nam</span>
              <span>
                địa chỉ nhận hàng cụ thể : thôn sơn thông - Thị trấn tân thanh -
                Thanh liêm - Ha nam
              </span>
              <span>SDT: 8437467118</span>
              <span>Phí ship : 30.000 đ</span>
            </div>
            <div className="status_delivery">
              <div className="status_and_more">
                <span className="status">Đang chờ xác nhận</span>
              </div>

              <span className="total_order">Tổng tiền : 20.000.000 đ</span>
            </div>
          </div>
          <div className="more">
            {more ? (
              <div onClick={handleSeeMore}>
                <span>Thu gọn đơn hàng</span>
                <FontAwesomeIcon icon={faAngleUp} />
              </div>
            ) : (
              <div onClick={handleSeeMore}>
                <span>Chi tiết đơn hàng</span>
                <FontAwesomeIcon icon={faAngleDown} />
              </div>
            )}
          </div>
          {dataTrack.map((track, index) => {
            return <OrderItem key={index} data={track} />;
          })}
        </div> */}

        {dataTrack.map((track, index) => {
          return <OrderItem key={index} datatrack={track} />;
        })}
      </div>
    </div>
  );
}
