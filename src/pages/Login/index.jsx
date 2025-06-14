import React, { useEffect, useRef, useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function LoginPage({ noti }) {
  const container_login = useRef();
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [emailRegist, setEmailRegist] = useState("");
  const [passwordRegist, setPasswordRegist] = useState("");
  const [Name, setName] = useState("");
  const navigate = useNavigate();
  const handleSingUpButton = () => {
    container_login.current.classList.add("right-panel-active");
  };
  const handleSingInButton = () => {
    container_login.current.classList.remove("right-panel-active");
  };

  // handel change value in loginm and regist
  const handleEmailChange = (even) => {
    setEmailLogin(even.target.value);
  };
  const handlePasswordChange = (even) => {
    setPasswordLogin(even.target.value);
  };
  const handleEmail_RegistChange = (even) => {
    setEmailRegist(even.target.value);
  };
  const handlePassword_RegistChange = (even) => {
    setPasswordRegist(even.target.value);
  };
  const handleNameChange = (even) => {
    setName(even.target.value);
  };

  const handlelLogin = (e) => {
    e.preventDefault();
    if (!checkEmail(emailLogin)) {
      noti(toast["warning"]("Email không đúng định dạng"));
      return;
    }
    if (!checkPassword(passwordLogin)) {
      noti(toast["warning"]("Mật khẩu cần lớn hơn 6 ký tự"));
      return;
    }

    const dataLogin = {
      email: emailLogin,
      password: passwordLogin,
    };
    let optionLogin = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataLogin),
    };
    let url = `${import.meta.env.VITE_APP_API}login`;
    fetch(url, optionLogin)
      .then((Response) => Response.json())
      .then((response) => {
        console.log("hà login :", response);
        if (response.code == 200) {
          console.log(response?.data?.token);
          console.log(response?.data?.refreshToken);
          localStorage.setItem("token", response?.data?.token);
          localStorage.setItem("refreshToken", response?.data?.refreshToken);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
        let type = response.code == 200 ? "success" : "error";
        noti(toast[type](response.message));
      });
    // noti(toast["error"]("Wow so easy!"))
  };
  const handlelRegist = (e) => {
    e.preventDefault();
    // noti(toast["error"]("Wow so easy!"));
    if (!checkEmail(emailRegist)) {
      noti(toast["warning"]("Email không đúng định dạng"));
      return;
    }
    if (!checkPassword(passwordRegist)) {
      noti(toast["warning"]("Mật khẩu cần lớn hơn 6 ký tự"));
      return;
    }
    const dataRegist = {
      email: emailRegist,
      password: passwordRegist,
      name: Name,
    };
    let optionRegist = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataRegist),
    };
    let url = `${import.meta.env.VITE_APP_API}register`;
    fetch(url, optionRegist)
      .then((Response) => Response.json())
      .then((response) => {
        console.log(response);
        let type = response.code == 402 ? "warning" : "success";
        noti(toast[type](response.message));
      });
  };

  const handleGoogleSuccess = (credentialResponse) => {
    let optionGoogleAuth = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken: credentialResponse.credential }),
    };
    let url = `${import.meta.env.VITE_APP_API}authGoogle`;
    fetch(url, optionGoogleAuth)
      .then((Response) => Response.json())
      .then((response) => {
        console.log("kết quả trả về từ googleAuth", response);
        if (response.code == 200) {
          console.log(response?.data?.token);
          console.log(response?.data?.refreshToken);
          localStorage.setItem("token", response?.data?.token);
          localStorage.setItem("refreshToken", response?.data?.refreshToken);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
        let type = response.code == 200 ? "success" : "error";
        noti(toast[type](response.message));
      });
  };
  const handleGoogleError = () => {};

  const checkEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const checkPassword = (password) => {
    const passwordRegex = /^[A-Za-z0-9]{6,}$/;
    return passwordRegex.test(password);
  };
  return (
    <>
      <div ref={container_login} className="container_login" id="container">
        <div className="form-container sign-up-container">
          <form action="">
            <h1>Tạo tài khoản</h1>
            {/* <div className="social-container">
              <a href="#" className="social">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" className="social">
                <i className="fab fa-google-plus-g" />
              </a>
              <a href="#" className="social">
                <i className="fab fa-linkedin-in" />
              </a>
            </div> */}
            <span style={{ marginTop: "10px" }}>
              Hoặc sử dụng Google Account để đăng nhập
            </span>
            <input
              className="Name"
              type="text"
              placeholder="Name"
              onChange={handleNameChange}
              value={Name}
            />
            <input
              className="Email"
              type="email"
              placeholder="Email"
              onChange={handleEmail_RegistChange}
              value={emailRegist}
            />
            <input
              className="PassWord"
              type="password"
              placeholder="Password"
              onChange={handlePassword_RegistChange}
              value={passwordRegist}
            />
            <button className="button" onClick={handlelRegist}>
              Sign Up
            </button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form action="/login" className="login_form">
            <h1>Đăng nhập</h1>
            <div className="social-container">
              {/* <a href="#" className="social">
                <i className="fab fa-facebook-f" />
              </a> */}

              {/* <a href="" className="social">
                <FontAwesomeIcon icon={faGoogle} />
              </a> */}
              {/* <a href="#" className="social">
                <i className="fab fa-linkedin-in" />
              </a> */}
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              ></GoogleLogin>
            </div>
            <span style={{ marginBottom: 10 }}></span>
            <span style={{ marginBottom: 10, fontSize: 15 }}>
              Tài khoản và mật khẩu
            </span>
            <input
              className="Email"
              type="email"
              placeholder="Email hoặc tên đăng nhập"
              onChange={handleEmailChange}
              value={emailLogin}
            />
            <input
              className="PassWord"
              type="password"
              placeholder="Mật khẩu"
              onChange={handlePasswordChange}
              value={passwordLogin}
            />
            <span style={{ marginBottom: 26 }}></span>
            {/* <a href="#">Bạn quên mật khẩu?</a> */}
            <button type="submit" className="button" onClick={handlelLogin}>
              Đăng nhập
            </button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Chào Mừng !</h1>
              <p>
                Giữ kết nối với chúng tôi bằng cách đăng nhập với thông tin của
                bạn
              </p>
              <button
                onClick={handleSingInButton}
                className=" button ghost"
                id="signIn"
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Chào bạn!</h1>
              <p>Vui lòng đăng ký để trải nghiệm được hiệu quả hơn</p>
              <button
                onClick={handleSingUpButton}
                className=" button ghost"
                id="signUp"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
