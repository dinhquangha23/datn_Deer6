import { useParams, useNavigate, json } from "react-router-dom";
import "./ProductDetail.css";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { fomartMoney, MoneytoInt } from "../../util";
import { storecontext } from "../../util/contextAPI/Context";

import Axios from "../../util/axios";
import { toast } from "react-toastify";
import axios from "axios";
function productDetail({ noti }) {
  const sizeOrder = ["XS", "S", "M", "L", "XL"];
  const param = useParams();
  const [data, setData] = useState("");
  const { setNumberCart } = useContext(storecontext);
  const [active, setActive] = useState(1);
  const [activeSize, setActiveSize] = useState(0);
  const [activeColor, SetActiveColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const inputQuantityRef = useRef();
  const nav = useNavigate();
  const [dataReceipt, setDataReciept] = useState({
    id_product: "",
    color: "",
    size: "",
    quantity: 1,
    price: "",
  });
  const navigator = useNavigate();

  // console.log(data)
  useEffect(() => {
    console.log("hello");
    // let url = `${import.meta.env.VITE_APP_API}product/${param.id}`;
    // fetch(url)
    //   .then((Response) => Response.json())
    //   .then((Response) => {
    //     const [response]=Response;
    //     setData(response);
    //     console.log("data luc dau",response)
    //     setDataReciept((pre) => {
    //       return {
    //         ...pre,
    //         id_product: param.id,
    //         Title: response.Title,
    //         thumbnail: response.secondimage,
    //         // price: fomartMoney(response.price),
    //         price: (response.price),
    //       };
    //     });
    //   });
    Axios.get(`getDetailProduct/${param.id}`).then((res) => {
      console.log("kết quả khi get theo id", res.data.data[0]);
      setData(res.data.data[0]);
      setDataReciept((pre) => {
        return {
          ...pre,
          id_product: res.data.data[0]?.id,
          color: res.data.data[0]?.colors[0],
          size: res.data.data[0]?.sizes[0],
          price: res.data.data[0]?.price,
        };
      });
      res.data.data[0]?.sizes.sort((a, b) => {
        return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
      });
    });
    window.scrollTo(0, 0);
  }, [param.id]);

  let handleSize = (e, index) => {
    // setSize(e.target.textContent)
    setActiveSize(index);
    console.log("dữ liệu size : =====", e.target.textContent);
    setDataReciept({ ...dataReceipt, size: e.target.textContent });
  };

  let handleChangeQuantity = (e) => {
    if (e.target.value == "") {
      setQuantity(1);
    }
    setQuantity(e.target.value && parseInt(e.target.value));
    setDataReciept({
      ...dataReceipt,
      quantity: e.target.value && parseInt(e.target.value),
    });
    console.log("ham set quantity");
  };

  let handleMinus = () => {
    if (inputQuantityRef.current.value == "") {
      setQuantity(1);
    }
    if (quantity > inputQuantityRef.current.min) {
      setQuantity((pre) => pre - 1);
      setDataReciept({ ...dataReceipt, quantity: dataReceipt.quantity - 1 });
    }
  };

  let handlePlus = () => {
    if (inputQuantityRef.current.value == "") {
      setQuantity(1);
    } else if (quantity < inputQuantityRef.current.max) {
      setQuantity((pre) => pre + 1);
      setDataReciept({
        ...dataReceipt,
        quantity: parseInt(dataReceipt.quantity) + 1,
      });
    }
  };

  let handleBlur = (e) => {
    if (
      e.target.value == "" ||
      parseInt(e.target.value) > parseInt(e.target.max) ||
      parseInt(e.target.value) < parseInt(e.target.min)
    ) {
      setQuantity(1);
      setDataReciept({ ...dataReceipt, quantity: parseInt(1) });
    }
  };

  let handeleColorChange = (e, index) => {
    console.log(e.target.getAttribute("data-color"));
    console.log("vị trí hiện tại index: ", index);
    SetActiveColor(index);
    setDataReciept({
      ...dataReceipt,
      color: e.target.getAttribute("data-color"),
    });
  };

  let handelAddCart = () => {
    if (dataReceipt.quantity != 0) {
      // let url = "http://localhost:3000/api/carts";
      // let flagUpdate = false;
      // let flagMap = true;
      // if (localStorage.getItem("userID") == undefined) {
      //   const dataLocal = JSON.parse(localStorage.getItem("cart"));
      //   if (dataLocal == undefined || dataLocal.length == 0) {
      //     dataReceipt["id_local"] = uuidv4();
      //     localStorage.setItem("cart", JSON.stringify([dataReceipt]));
      //     setNumberCart((pre) => pre + 1);
      //   } else {
      //     dataLocal.map((value) => {
      //       if (
      //         value.id_product == dataReceipt.id_product &&
      //         value.color === dataReceipt.color &&
      //         value.size === dataReceipt.size
      //       ) {
      //         value.quantity += dataReceipt.quantity;
      //         localStorage.setItem("cart", JSON.stringify(dataLocal));
      //         flagMap = false;
      //       } else {
      //         flagUpdate = true;
      //       }
      //     });
      //     if (flagUpdate && flagMap) {
      //       flagUpdate = false;
      //       flagMap = true;
      //       console.log("data_recept_in_local", dataReceipt);
      //       dataReceipt["id_local"] = uuidv4();
      //       dataLocal.push(dataReceipt);
      //       localStorage.setItem("cart", JSON.stringify(dataLocal));
      //       setNumberCart((pre) => pre + 1);
      //     }
      //   }

      //   // console.log("localstorage co :",JSON.parse(dataLocal))
      // }
      //  else {
      // gọi api

      // let option = {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(dataReceipt),
      // };
      // fetch(url, option)
      //   .then((Response) => {
      //     Response.json();
      //   })
      //   .then((Response) => {
      //     //  navigator('/all_products')
      //     setNumberCart((pre) => pre + 1);
      //   });
      // }
      Axios.post("addCart", dataReceipt)
        .then((response) => {
          console.log("Response khi thêm cart:", response.data);
          if (response.data.code == 200) {
            setNumberCart((pre) => pre + 1);
          }

          noti(
            toast[response.data.code == 203 ? "error" : "success"](
              response.data.message
            )
          );
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };
  const handleBuyNow = () => {
    Axios.post("/checkVariant", dataReceipt).then((res) => {
      console.log(res.data);
      if (res.data.code == 204) {
        noti(toast.warning(res.data.message));
      } else {
        res.data.data[0].quantity = dataReceipt.quantity;
        res.data.data[0].name = data.name;
        res.data.data[0].color = dataReceipt.color;
        res.data.data[0].size = dataReceipt.size;
        res.data.data[0].price = dataReceipt.price;

        localStorage.setItem("payRightNow", JSON.stringify(res.data.data));
        nav("/pay");
      }
    });
  };

  useEffect(() => {
    console.log("dữ liệu data recipt", dataReceipt);
  });
  // console.log(dataReceipt);
  console.log("data đang có :", data);
  return (
    <div className="container">
      <div className="container_wrap">
        {/* {console.log(size)} */}
        <div className="main-image">
          <div className="thumbnail-left">
            <ul className="list-thumbnail-left">
              <li
                className={`list-thumbnail-left-item ${
                  active == 1 ? "active1" : ""
                }`}
                onClick={() => {
                  setActive(1);
                }}
              >
                <img
                  src={
                    data.first_image
                      ? `${import.meta.env.VITE_HOST_API}${data.first_image}`
                      : "https://cdn.photoroom.com/v1/assets-cached.jpg?path=backgrounds_v3/white/Photoroom_white_background_extremely_fine_texture_only_white_co_d6a2d66a-dfe4-41fc-80fd-ec55764101bb.jpg"
                  }
                  alt=""
                />
              </li>
              <li
                className={`list-thumbnail-left-item ${
                  active == 2 ? "active1" : ""
                }`}
                onClick={() => {
                  setActive(2);
                }}
              >
                <img
                  src={
                    data.second_image
                      ? `${import.meta.env.VITE_HOST_API}${data.second_image}`
                      : "https://cdn.photoroom.com/v1/assets-cached.jpg?path=backgrounds_v3/white/Photoroom_white_background_extremely_fine_texture_only_white_co_d6a2d66a-dfe4-41fc-80fd-ec55764101bb.jpg"
                  }
                  alt=""
                />
              </li>
            </ul>
          </div>
          <div className="image-center">
            <div
              className={`image-viewport-item ${active == 1 ? "active" : ""}`}
            >
              <img
                className="image-viewport-item-img"
                src={
                  data.first_image
                    ? `${import.meta.env.VITE_HOST_API}${data.first_image}`
                    : "https://cdn.photoroom.com/v1/assets-cached.jpg?path=backgrounds_v3/white/Photoroom_white_background_extremely_fine_texture_only_white_co_d6a2d66a-dfe4-41fc-80fd-ec55764101bb.jpg"
                }
                alt=""
              />
            </div>
            <div
              className={`image-viewport-item ${active == 2 ? "active" : ""}`}
            >
              <img
                className="image-viewport-item-img"
                src={
                  data.second_image
                    ? `${import.meta.env.VITE_HOST_API}${data.second_image}`
                    : "https://cdn.photoroom.com/v1/assets-cached.jpg?path=backgrounds_v3/white/Photoroom_white_background_extremely_fine_texture_only_white_co_d6a2d66a-dfe4-41fc-80fd-ec55764101bb.jpg"
                }
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="info-detail">
          <div className="info-detail-title">
            <h1>{"LOADING..." && data.name}</h1>
            <span />
            <span>{fomartMoney(data.price)}₫</span>
          </div>
          <div className="info-detail-option">
            <span>color</span>
            <ul className="option-color">
              {console.log(data.colors)}
              {/* bắt đầu phần colors */}
              {data.colors &&
                data?.colors.map((color, index) => {
                  return (
                    <li key={index} className="option-color-item">
                      <button
                        style={{ backgroundColor: color }}
                        className={`${activeColor == index ? "active" : ""}`}
                        data-color={color}
                        onClick={(event) => {
                          console.log("active color", activeColor);
                          handeleColorChange(event, index);
                        }}
                      />
                    </li>
                  );
                })}

              {/* <li
                className="option-color-item"
                onClick={() => {
                  SetActiveColor(1);
                }}
              >
                <button
                  className={`while ${activeColor == 1 ? "active" : ""}`}
                  data-color="while"
                  onClick={handeleColorChange}
                />
              </li> */}
              {/* <li
                className="option-color-item"
                onClick={() => {
                  SetActiveColor(2);
                }}
              >
                <button
                  className={`black ${activeColor == 2 ? "active" : ""}`}
                  data-color="black"
                  onClick={handeleColorChange}
                />
              </li> */}
            </ul>
            <span>Size</span>
            <ul className="option-size">
              {data.sizes &&
                data?.sizes.map((size, index) => {
                  return (
                    <li key={index} className="option-size-item">
                      <button
                        className={`${activeSize == index ? "active" : ""}`}
                        onClick={(e) => handleSize(e, index)}
                      >
                        {size}
                      </button>
                    </li>
                  );
                })}

              {/* <li className="option-size-item">
                <button
                  className={`${activeSize == 1 ? "active" : ""}`}
                  onClick={(e, index) => handleSize(e, 1)}
                >
                  M
                </button>
              </li> */}
              {/* <li className="option-size-item">
                <button
                  className={`${activeSize == 2 ? "active" : ""}`}
                  onClick={(e, index) => handleSize(e, 2)}
                >
                  L
                </button>
              </li>
              <li className="option-size-item">
                <button
                  className={`${activeSize == 3 ? "active" : ""}`}
                  onClick={(e, index) => handleSize(e, 3)}
                >
                  XL
                </button>
              </li> */}
            </ul>
          </div>
          <div className="info-detail-function">
            <div className="input-quantity">
              <input
                type="button"
                defaultValue="-"
                className="minus"
                onClick={handleMinus}
              />
              <input
                className="inputnumber"
                type="number"
                value={quantity}
                onChange={(e) => handleChangeQuantity(e)}
                step={1}
                size={2}
                max={10}
                min={1}
                ref={inputQuantityRef}
                onBlur={(e) => handleBlur(e)}
              />
              <input
                type="button"
                defaultValue="+"
                className="plus"
                onClick={handlePlus}
              />
            </div>
            <div className="add-cart">
              <button className="btn-add-cart" onClick={handelAddCart}>
                <i className="fa-solid fa-cart-shopping" />
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
          <div className="buy">
            <button className="buy-now" onClick={handleBuyNow}>
              Buy it now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default productDetail;
