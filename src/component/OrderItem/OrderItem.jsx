// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import "./OrderItem.css";
import { fomartMoney } from "../../util";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import Axios from "../../util/axios";

export default function OrderItem({ datatrack }) {
  const navigate = useNavigate();
  const [more, setMore] = useState(false);
  const [state, setState] = useState("");
  const list_status = {
    ready_to_pick: "Đơn hàng mới tạo",
    picking: "Đang lấy hàng",
    money_collect_picking: "Đang thu tiền khi lấy hàng",
    picked: "Đã lấy hàng",
    storing: "Đã nhập kho phân loại",
    transporting: "Đang luân chuyển",
    sorting: "Đang phân loại",
    delivering: "Đang giao hàng",
    money_collect_delivering: "Đang thu tiền khi giao hàng",
    delivered: "Đã giao hàng thành công",
    delivery_fail: "Giao hàng thất bại",
    waiting_to_return: "Chờ trả hàng",
    return: "Chờ trả về người gửi",
    return_transporting: "Đang luân chuyển hàng trả",
    return_sorting: "Đang phân loại hàng trả",
    returning: "Đang trả hàng",
    return_fail: "Trả hàng thất bại",
    returned: "Đã trả hàng thành công",
    cancel: "Đơn hàng đã hủy",
    exception: "Xử lý ngoại lệ",
    damage: "Hàng bị hư hỏng",
    lost: "Hàng thất lạc",
  };
  const handelNavigate = () => {
    navigate(`/product_detail/${data?.id_product}`);
  };
  const baseStyle = {
    backgroundColor: "rgb(235, 225, 225)",
    width: "60%",
    position: "relative",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    overflow: "hidden",
    marginBottom: "20px",
    borderRadius: "20px",
    transition: "all 1s ease",
  };
  const handleSeeMore = () => {
    setMore((pre) => !pre);
  };
  console.log("data_order_item", datatrack);

  useEffect(() => {
    Axios.post("/GHN/checkState", { order_code: datatrack?.order_code }).then(
      (res) => {
        if (res.status == 200) {
          setState(res.data);
        }
      }
    );
  }, []);

  return (
    <div
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
          <span>Mã đơn Hàng: {datatrack?.order_code}</span>
          <span>Họ và Tên : {datatrack?.full_name}</span>
          <span>Địa chỉ: {datatrack?.address}</span>
          <span>
            Địa chỉ nhận hàng cụ thể :{" "}
            {`${datatrack?.address_detail} - ${datatrack?.ward} - ${datatrack?.district} - ${datatrack?.province}`}
          </span>
          <span>SDT: {datatrack?.phone}</span>
          <span>Phí ship : {fomartMoney(datatrack?.fee)} đ</span>
        </div>
        <div className="status_delivery">
          <div className="status_and_more">
            <span className="status">{list_status[state]}</span>
          </div>

          <span className="total_order">
            Tổng tiền : {fomartMoney(datatrack?.fee + datatrack?.total_money)} đ
          </span>
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
      {datatrack?.items.map((track, index) => {
        return (
          <div onClick={handelNavigate} key={index} className="order_container">
            <div className="order_thumnail">
              <img
                src={import.meta.env.VITE_HOST_API + track?.first_image}
                alt=""
              />
            </div>
            <div className="order_container_content">
              <span className="order_content_title">
                <span className="height_light">{track?.name}</span>
                <span className="size">
                  Size : {`${track.size} - ${track.color}`}
                </span>
                <span className="size">{`SL : ${track.quantity}`}</span>
              </span>
              <span className="order_content_price">
                {`Giá : `}
                {fomartMoney(track?.price)} ₫
              </span>
            </div>
            <div className="status_and_total_money">
              <div className="status_order">
                {/* <span className="status">{data.status}</span> */}
              </div>
              <span className="total_money">
                Tổng {track.quantity} sản phẩm là :{" "}
                {fomartMoney(track?.price * track?.quantity)} ₫
              </span>
            </div>
          </div>
        );
      })}
    </div>

    // <div onClick={handelNavigate} className="order_container">
    //   <div className="order_thumnail">
    //     <img src={import.meta.env.VITE_HOST_API + data?.first_image} alt="" />
    //   </div>
    //   <div className="order_container_content">
    //     <span className="order_content_title">
    //       <span className="height_light">{data?.name}</span>
    //       <span className="size">Size : {`${data.size} - ${data.color}`}</span>
    //       <span className="size">{`SL : ${data.quantity}`}</span>
    //     </span>
    //     <span className="order_content_price">
    //       {`Giá : `}
    //       {fomartMoney(data?.price)} ₫
    //     </span>
    //   </div>
    //   <div className="status_and_total_money">
    //     <div className="status_order">
    //       {/* <span className="status">{data.status}</span> */}
    //     </div>
    //     <span className="total_money">
    //       Tổng {data.quantity} sản phẩm là :{" "}
    //       {fomartMoney(data?.price * data?.quantity)} ₫
    //     </span>
    //   </div>
    // </div>
  );
}
