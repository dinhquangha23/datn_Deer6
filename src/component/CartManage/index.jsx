// eslint-disable-next-line no-unused-vars
import React from "react";
import "./Cartmanage.css";
import { fomartMoney } from "../../util";
import { Link, useNavigate } from "react-router-dom";

export default function CartManage({ dataManage }) {
  const navigate = useNavigate();
  const handelNavigate = () => {
    navigate(`/product_detail/${dataManage?.id_product}`);
  };

  console.log("dataManage", dataManage);
  return (
    <div onClick={handelNavigate} className="result_container_manage">
      <div className="result_thumnail_manage">
        <img
          src={`${import.meta.env.VITE_HOST_API}${dataManage.first_image}`}
          alt=""
        />
      </div>
      <div className="result_container_content_manage">
        <span className="result_content_title_manage">
          {dataManage.name} - {dataManage.color} - {dataManage.size} -{" "}
          {dataManage.quantity}
        </span>
        <span className="result_content_price_manage">
          {fomartMoney(dataManage?.price)} ₫
        </span>
      </div>
    </div>
  );
}
