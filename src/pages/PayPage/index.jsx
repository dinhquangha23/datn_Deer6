import React, { useEffect, useRef, useState } from "react";
import "./Pay.css";
import { fomartMoney, MoneytoInt } from "../../util";
import { toast } from "react-toastify";
import Axios from "../../util/axios";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import { Flex } from "antd";
import Select from "react-select";
export default function PayPage({ noti }) {
  const [dataPay, setDataPay] = useState([]);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idUser, setIdUser] = useState("");
  const [note, setNote] = useState("");
  const [payMethod, setPayMethod] = useState("COD");
  const localtion = useLocation();
  const [addressDelivery, setAddressDelivery] = useState("");

  // danh sách Tỉnh - Huyện - Xã
  const [listProvinces, setListProvinces] = useState(null);
  const [listDistrict, setListDistrict] = useState(null);
  const [listWard, setListWard] = useState(null);
  const [province, setProvice] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);
  const [feeShip, setFeeShip] = useState();
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      boxShadow: "none",
      backgroundColor: state.isDisabled
        ? "transparent"
        : provided.backgroundColor,
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      borderColor: state.isFocused ? "transparent" : provided.borderColor,
      "&:hover": {
        borderColor: "transparent",
      },
    }),
  };

  let ListIdProduct = [];
  let estimate_money = 0;
  const nav = useNavigate();
  const clear = useRef(false);
  useEffect(() => {
    if (!clear.current) {
      clear.current = true;
      let id_user = jwtDecode(localStorage.getItem("token")).id;
      Axios.get(`/user/${id_user}`).then((res) => {
        console.log(res.data.data[0]);
        let data = res.data.data[0];
        data.full_name && setFullName(data.full_name);
        data.phone && setPhoneNumber(data.phone);
        data.address && setAddress(data.address);
        if (data.id_user_detail == null) {
          nav("/profileDetail");
        }
      });
      if (localStorage.getItem("payRightNow") == null) {
        Axios.get(`cart/${id_user}`).then((res) => {
          console.log("dữ liệu lấy ở cart", res.data.data);
          setDataPay(res.data.data);
        });
      } else {
        let data = JSON.parse(localStorage.getItem("payRightNow"));

        // console.log("dữ liệu trong local", data);
        setDataPay(data);
      }
      return;
    }

    return () => {
      localStorage.removeItem("payRightNow");
    };
  }, [localtion.pathname]);

  useEffect(() => {
    Axios.get("/GHN/provinces").then((res) => {
      if (res.data.code == 200) {
        let provinceOption = res?.data?.data?.map((province) => ({
          value: province.ProvinceID,
          label: province.ProvinceName,
        }));
        setListProvinces(provinceOption);
      }
    });
  }, []);

  useEffect(() => {
    if (province != null) {
      Axios.post("/GHN/district", { province_id: province?.value }).then(
        (res) => {
          // console.log("data tra ve ơ district", res.data.data);
          if (res.data.code == 200) {
            let districtOption = res?.data?.data?.map((district) => ({
              value: district.DistrictID,
              label: district.DistrictName,
            }));
            setListDistrict(districtOption);
          }
        }
      );
    }
  }, [province]);
  useEffect(() => {
    if (district != null) {
      Axios.post("/GHN/ward", { district_id: district?.value }).then((res) => {
        // console.log("data tra ve ơ ward", res.data.data);
        if (res.data.code == 200) {
          let wardOption = res?.data?.data?.map((ward) => ({
            value: ward.WardCode,
            label: ward.WardName,
          }));
          setListWard(wardOption);
        }
      });
    }
  }, [district]);
  useEffect(() => {
    if (ward !== null) {
      let payload = {
        district_id: district.value,
        ward_code: ward.value,
        list_item: dataPay,
      };
      Axios.post("/GHN/caculateFee", payload).then((res) => {
        if (res.data.code == 200) {
          setFeeShip(res.data.data.service_fee);
        }
      });
    } else {
      return;
    }
  }, [ward]);

  // useEffect(() => {
  //   if (localStorage.getItem("userID") != undefined) {
  //     let id_user = localStorage.getItem("userID");
  //     let url = `${import.meta.env.VITE_APP_API}user/${id_user}`;
  //     fetch(url)
  //       .then((Response) => Response.json())
  //       .then((response) => {
  //         // console.log(response)
  //         setFullName(response[0].fullname);
  //         setAddress(response[0].address);
  //         setPhoneNumber(response[0].phonenumber);
  //         setIdUser(response[0].id);
  //       });
  //   }
  // }, []);

  const handleInputNameChange = (e) => {
    setFullName(e.target.value);
  };
  const handleInputAddressDeliveryChange = (e) => {
    // console.log(e.target.value);
    setAddressDelivery(e.target.value);
  };
  const handleInputPhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };
  const handleInputNoteChange = (e) => {
    setNote(e.target.value);
  };

  console.log("data in payPage", dataPay);
  // console.log("listIDProduct in payPage", ListIdProduct)
  const handleOrderPay = () => {
    console.log(estimate_money);

    if (
      province != null &&
      district !== null &&
      ward != null &&
      addressDelivery != ""
    ) {
      const orderSend = {
        totalMoney: estimate_money - feeShip,
        fee_ship: feeShip,
        note: note,
        dataCarts: dataPay,
        name: fullName,
        province_id: province.label,
        district_id: district.label,
        ward_id: ward.label,
        address_delivery: addressDelivery,
        pay_method: payMethod,
        phone: phoneNumber,
      };
      if (payMethod == "COD") {
        Axios.post("order", orderSend).then((res) => {
          console.log("thêm vào order và trả về", res);
          if (res.status == 200) {
            noti(toast("Đã Đặt Hàng Thành Công"));
            nav("/order_tracking");
          }
        });
      }
      if (payMethod == "VNPAY") {
        Axios.post("order", orderSend).then((res) => {
          console.log("dữ liệu trả về", res.data);
          if (res.status == 200) {
            localStorage.setItem("id_order", res.data.data.id_order);
            Axios.post("/createUrlPayment", { amount: estimate_money }).then(
              (res) => {
                window.location.href = res.data.paymentUrl;
                localStorage.removeItem("payRightNow");
              }
            );
          }
        });
      }
      console.log("dữ liệu tạo đơn vịn vận chyển", orderSend);
    } else {
      noti(toast.warning("Điền đầy đủ thông tin nhận hàng"));
    }

    // if (payMethod == "COD") {
    //   Axios.post("order", orderSend).then((res) => {
    //     console.log("thêm vào order và trả về", res);
    //     if (res.status == 200) {
    //       noti(toast("Đã Đặt Hàng Thành Công"));
    //     }
    //   });
    // }
    // if (payMethod == "VNPAY") {
    //   Axios.post("order", orderSend).then((res) => {
    //     console.log("dữ liệu trả về", res.data);
    //     if (res.status == 200) {
    //       localStorage.setItem("id_order", res.data.data.id_order);
    //       Axios.post("/createUrlPayment", { amount: estimate_money }).then(
    //         (res) => {
    //           window.location.href = res.data.paymentUrl;
    //           localStorage.removeItem("payRightNow");
    //         }
    //       );
    //     }
    //   });
    // }
  };

  return (
    <div className="container_pay">
      <div className="content">
        <h1 className="title">Thanh toán</h1>
        <div className="bill">
          <div className="info_user_order">
            <h3>Thông tin thanh toán</h3>
            <div className="info-input">
              <label htmlFor="">Họ và tên</label>
              <input
                disabled={true}
                className="name"
                type="text"
                onChange={handleInputNameChange}
                value={fullName}
              />
            </div>
            {/* <div className="info-input">
              <label htmlFor="">Địa chỉ</label>
              <input
                disabled={true}
                className="address"
                type="text"
                onChange={handleInputAddressChange}
                value={address}
              />
            </div> */}

            <div className="info-input">
              <label htmlFor="">Số điện thoại</label>
              <input
                disabled={true}
                className="phonenumber"
                type="number"
                onChange={handleInputPhoneNumberChange}
                value={phoneNumber}
              />
            </div>
            <div className="info-input">
              <label htmlFor="">Tỉnh</label>
              <Select
                value={province}
                placeholder="chọn tỉnh nhận hàng"
                options={listProvinces}
                onChange={(e) => {
                  setProvice(e);
                  setDistrict(null);
                  setWard(null);
                }}
                styles={customStyles}
                className="select"
              />
            </div>
            <div className="info-input">
              <label htmlFor="">Quận - Huyện</label>
              <Select
                isDisabled={province == null ? true : false}
                placeholder="chọn Quận/Huyện nhận hàng"
                styles={customStyles}
                options={listDistrict}
                value={district}
                onChange={(e) => {
                  setDistrict(e);
                  setWard(null);
                }}
                className={["select", province == null ? "disable" : ""].join(
                  " "
                )}
              />
            </div>
            <div className="info-input">
              <label htmlFor="">Phường - Xã</label>
              <Select
                value={ward}
                isDisabled={district == null ? true : false}
                placeholder="chọn Xã/Phường nhận hàng"
                styles={customStyles}
                options={listWard}
                onChange={(e) => {
                  setWard(e);
                  setAddressDelivery("");
                }}
                className={["select", district == null ? "disable" : ""].join(
                  " "
                )}
              />
            </div>
            <div className="info-input">
              <label htmlFor="">Địa chỉ giao hàng cụ thể</label>
              <input
                disabled={ward == null ? true : false}
                spellCheck={false}
                className="address"
                type="text"
                onChange={handleInputAddressDeliveryChange}
                value={addressDelivery}
              />
            </div>
            <div className="info-input">
              <label htmlFor="">Ghi chú đơn hàng</label>
              <textarea
                placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                name=""
                id=""
                cols={20}
                rows={10}
                value={note}
                onChange={handleInputNoteChange}
              />
            </div>
          </div>
          <div className="total_money_cart">
            <h2>Đơn hàng của bạn</h2>
            <table className="table_total_money">
              <tbody>
                <tr>
                  <th>Sản phẩm</th>
                  <td>Tạm Tính</td>
                </tr>

                {dataPay &&
                  dataPay.map((value, index) => {
                    estimate_money += value.price * value.quantity;
                    ListIdProduct.push(
                      `${parseInt(value.id_product)}-${value.quantity}-${
                        value.color
                      }`
                    );
                    return (
                      <tr key={index}>
                        <th>
                          <span className="titel">{value.name}</span> -{" "}
                          <span className="size">{value.size} </span> -{" "}
                          <span className="titel">{value.color}</span> x{" "}
                          <span className="Quantity">{value.quantity}</span>
                        </th>
                        <td>{fomartMoney(value.price * value.quantity)} ₫</td>
                      </tr>
                    );
                  })}
                {/* <tr>
                      <th><span className="titel">Áo phông Made extreme 24001</span> - <span className="size">L</span>  x <span className="Quantity">2</span></th>
                      <td>660.000 ₫</td>
                  </tr> */}

                <tr className="estimate">
                  <th>Tạm tính</th>
                  <td>
                    <span>{fomartMoney(estimate_money)} ₫</span>
                  </td>
                </tr>
                <tr>
                  <th>Giao Hàng(Phí vận chuyển)</th>
                  <td>{ward != null ? fomartMoney(feeShip) : "---------"} ₫</td>
                </tr>
                <tr>
                  <th>Tổng</th>
                  <td className="total_money">
                    {" "}
                    <span>
                      {ward != null
                        ? fomartMoney((estimate_money += feeShip))
                        : fomartMoney(estimate_money)}
                    </span>{" "}
                    ₫
                  </td>
                </tr>
                <tr>
                  <th style={{ display: "flex", alignItems: "center" }}>
                    {" "}
                    <input
                      type="radio"
                      name=""
                      id=""
                      value={"COD"}
                      checked={payMethod == "COD" ? true : false}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setPayMethod(e.target.value);
                      }}
                      style={{ width: 15, marginRight: 14 }}
                    />
                    Thanh toán khi nhận hàng - COD
                  </th>
                  <th
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: -15,
                    }}
                  >
                    {" "}
                    <input
                      type="radio"
                      name=""
                      id=""
                      value={"VNPAY"}
                      checked={payMethod == "VNPAY" ? true : false}
                      style={{ width: 15, marginRight: 14 }}
                      onChange={(e) => {
                        setPayMethod(e.target.value);
                      }}
                    />
                    Thanh toán bằng VN-Pay
                  </th>
                </tr>
              </tbody>
            </table>
            <div className="check_out">
              <button className="btn_check_out_2" onClick={handleOrderPay}>
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
