import React, { useEffect, useState } from "react";
import "./ProfileDetail.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import Axios from "../../util/axios";
export default function ProfileDetail() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idUser, setIdUser] = useState("");
  const [isCreate, setIsCreate] = useState(true);
  const handleInputNameChange = (e) => {
    setFullName(e.target.value);
  };
  const handleInputAddressChange = (e) => {
    setAddress(e.target.value);
  };
  const handleInputPhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };
  const handleOnbur = (e) => {
    if (e.target.value !== "") {
      setPhoneNumber(parseInt(e.target.value.replace(/^0/, "84")));
    }
  };
  // useEffect(() => {
  //   if (localStorage.getItem("token") == null) {
  //     navigate("/login");
  //   }
  // }, []);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");

    navigate("/login");
  };

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      let id_user = jwtDecode(localStorage.getItem("token")).id;
      let email = jwtDecode(localStorage.getItem("token")).email;
      setIdUser(id_user);
      setEmail(email);
      console.log("id user là ", id_user, email);
      Axios.get(`/user/${id_user}`).then((res) => {
        console.log(res.data.data[0]);
        let data = res.data.data[0];
        data.full_name && setFullName(data.full_name);
        data.phone && setPhoneNumber(data.phone);
        data.address && setAddress(data.address);
        if (data.id_user_detail !== null) {
          setIsCreate(false);
        }
      });
    } else {
      navigate("/login");
    }

    // console.log("id user là ", id_user, email);

    // let url = `${import.meta.env.VITE_APP_API}user/${id_user}`;
    // fetch(url)
    //   .then((Response) => Response.json())
    //   .then((response) => {
    //     console.log(response);
    //     setUserName(response[0].username);
    //     setFullName(response[0].fullname);
    //     setAddress(response[0].address);
    //     setPhoneNumber(response[0].phonenumber);
    //     setIdUser(response[0].id);
    //   });
  }, []);
  const handleUpdateUser = () => {
    let dataUpdate = {
      idUser,
      fullName,
      address,
      phoneNumber,
    };
    // console.log(dataUpdate);
    if (isCreate) {
      Axios.post("/user", dataUpdate).then((res) => {
        console.log("tạo mới này :", res.data);
      });
    } else {
      Axios.put("/user", dataUpdate).then((res) => {
        console.log("cập nhập này", res.data);
      });
    }
    // let optionUpdate = {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(dataUpdate),
    // };
    // fetch(url, optionUpdate)
    //   .then((Response) => Response.json())
    //   .then((response) => {
    //     console.log(response);
    //   });
  };
  return (
    <div className="container">
      <div className="redirect">
        <Link to={"/"}>
          <span>Trang chủ</span>
        </Link>
        <i>
          <FontAwesomeIcon icon={faAngleRight} />
        </i>
        <Link>
          <span>Thông tin chi tiết</span>
        </Link>
      </div>
      <div className="container-title">
        <h1>Thông tin chi tiết</h1>
      </div>
      <div className="container-content">
        <div className="content-input">
          <label htmlFor="username">Tên tài khoản hoặc email</label>
          <input
            type="text"
            id="username"
            spellCheck="false"
            disabled={true}
            placeholder="Tên tài khoản"
            value={email}
          />
        </div>
        <div className="content-input">
          <label htmlFor="fullname">Họ và tên</label>
          <input
            type="text"
            id="fullname"
            spellCheck="false"
            placeholder="Họ và tên"
            onChange={handleInputNameChange}
            value={fullName}
          />
        </div>
        <div className="content-input">
          <label htmlFor="address">Địa chỉ</label>
          <input
            type="text"
            id="address"
            spellCheck="false"
            placeholder="Địa chỉ"
            onChange={handleInputAddressChange}
            value={address}
          />
        </div>
        <div className="content-input">
          <label htmlFor="phonenumber">Số điện thoại</label>
          <input
            type="number"
            size={10}
            id="phonenumber"
            spellCheck="false"
            placeholder="Số điện thoại"
            onChange={handleInputPhoneNumberChange}
            value={phoneNumber}
            onBlur={handleOnbur}
          />
        </div>
        <button type="button" onClick={handleUpdateUser}>
          Cập nhập
        </button>
        <button type="button" style={{ marginLeft: 20 }} onClick={handleLogout}>
          Đăng Xuất
        </button>
      </div>
    </div>
  );
}
