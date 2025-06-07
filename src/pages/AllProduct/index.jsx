import "./AllProduct.css";
import Product from "../../component/Product/product";

import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Axios from "../../util/axios";

export default function AllProduct() {
  const [products, setProducts] = useState([]);
  const { category } = useParams();
  // const location = useLocation();
  useEffect(() => {
    console.log(category);
    let url;

    if (category) {
      switch (category) {
        case "tops":
          url = `/ProductByCategory/2`;
          break;
        case "bottoms":
          url = `/ProductByCategory/1`;
          break;
        default:
          url = `getAllProduct`;
          break;
      }
    } else {
      url = `getAllProduct`;
    }

    Axios.get(url).then((res) => {
      setProducts(res.data.data);
      // console.log(res.data.data);
    });

    // fetch(url)
    //   .then((Response) => Response.json())
    //   .then((Response) => {
    //     setProducts(Response);
    //   });
  }, [category]);
  return (
    <div className="container">
      <div className="redirect">
        <Link to={"/"}>
          <span>Trang chủ</span>
        </Link>
        <i>
          <FontAwesomeIcon icon={faAngleRight} />
        </i>
        <Link to={"/all_products"}>
          <span>Tất cả sản phẩm</span>
        </Link>

        {category == "tops" && (
          <>
            <i>
              <FontAwesomeIcon icon={faAngleRight} />
            </i>
            <Link to={"/all_products"}>
              <span>Tops</span>
            </Link>
          </>
        )}
        {category == "bottoms" && (
          <>
            <i>
              <FontAwesomeIcon icon={faAngleRight} />
            </i>
            <Link to={"/all_products"}>
              <span>Bottoms</span>
            </Link>
          </>
        )}
      </div>
      <div className="container-title">
        <h1>Tất cả sản phẩm</h1>
      </div>
      <div className="list-product">
        {products &&
          products.map((data, index) => {
            return <Product key={index} data={data} />;
          })}
      </div>
    </div>
  );
}
