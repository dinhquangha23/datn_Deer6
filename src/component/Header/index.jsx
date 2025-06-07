import "./header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faMagnifyingGlass,
  faUser,
  faHeart,
  faBars,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { storecontext } from "../../util/contextAPI/Context";
import Axios from "../../util/axios";
import { jwtDecode } from "jwt-decode";
function Header({ toggle }) {
  const [active, setActive] = useState(false);
  const { numberCart, setNumberCart } = useContext(storecontext);

  // useEffect(()=>{
  //   if(localStorage.getItem("userID")==undefined){
  //     let dataLocalstorage= JSON.parse(localStorage.getItem("cart"))
  //     setNumberCart(dataLocalstorage.length);
  //   }else{
  //     let url =`${import.meta.env.VITE_APP_API}get_carts`
  //     let optionFetch ={
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({id_user: localStorage.getItem("userID")}),
  //     };
  //   fetch(url,optionFetch).then((Response)=>Response.json())
  //   .then(Response=>{
  //     setNumberCart(Response.length)
  //   })
  //   }
  // },[])

  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      const idUser = jwtDecode(localStorage.getItem("token")).id;
      Axios.get(`/cart/${idUser}`).then((res) => {
        setNumberCart(res.data.data.length);
      });
    }
  }, []);
  function showMenu() {
    setActive((Pre) => !Pre);
  }
  const closeMenuBar = () => {
    setActive(false);
  };

  let checkLogin = () => {
    let token = localStorage.getItem("token");
    if (token == undefined) return "/login";
    return "/profiledetail";
  };
  return (
    <header>
      <div className="content">
        <div className="logo">
          <Link to={"/"}>
            <img
              src="https://deer6.vn/wp-content/uploads/2021/11/logo-black.png"
              alt=""
            />
          </Link>
        </div>
        <div className="menubar">
          <ul className={`main-menu ${active ? " active" : ""}`}>
            <li onClick={closeMenuBar}>
              <Link to={"/"}>Home</Link>
            </li>
            <li onClick={closeMenuBar}>
              <Link to={"/all_products"}>All Products</Link>
            </li>
            <li onClick={closeMenuBar}>
              <Link to={"/all_products/tops"}>Tops</Link>
            </li>
            <li onClick={closeMenuBar}>
              <Link to={"/all_products/bottoms"}>Bottoms</Link>
            </li>
            <li onClick={closeMenuBar}>
              <a target="_blank" href="https://www.facebook.com/deer6.hanoi">
                Facebook
              </a>
            </li>
            <li onClick={closeMenuBar}>
              <a target="_blank" href="https://www.instagram.com/deer6.hanoi/">
                Instagram
              </a>
            </li>
            {/* <li onClick={closeMenuBar}>
              <a href="">Sale</a>
            </li>
            <li onClick={closeMenuBar}>
              <a href="">Pre order</a>
            </li> */}
          </ul>
        </div>
        <div className="funtion">
          <ul className="funtion-list">
            <li onClick={toggle}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </li>
            <li>
              <Link to={checkLogin()}>
                <FontAwesomeIcon icon={faUser} />
              </Link>
            </li>
            <li className="heart">
              <Link to={"/order_tracking"}>
                {/* <FontAwesomeIcon icon={faHeart} /> */}
                <FontAwesomeIcon icon={faTruckFast} />
                {/* <span className="heart-number">0</span> */}
              </Link>
            </li>
            <li className="cart">
              <Link to={"/cart"}>
                <FontAwesomeIcon icon={faCartShopping} />
                <span className="cart-number">{numberCart}</span>
              </Link>
            </li>
            <li className="menu-bars" onClick={showMenu}>
              <FontAwesomeIcon icon={faBars} />
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
