import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./DashBoard.css";
import {
  BankFilled,
  CodeSandboxOutlined,
  EuroCircleOutlined,
  FormatPainterOutlined,
  HomeFilled,
  LockFilled,
  MenuUnfoldOutlined,
  ProductOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  SkinOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Outlet, useNavigate, useOutlet } from "react-router-dom";
import OderManage from "../pageDashBoard/OrderManage";
import Axios from "../../util/axios";

export default function DashBoard({ noti }) {
  const nav = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      nav("/login");
    }
  });
  const outlet = useOutlet();
  const navigate = useNavigate();
  const items = [
    {
      key: "1",
      icon: <CodeSandboxOutlined />,
      label: "Order Manager",
      onClick: () => {
        navigate("ordermanage");
      },
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: "Account Manager",
      onClick: () => {
        navigate("accountmanage");
      },
    },
    {
      key: "3",
      icon: <ShoppingCartOutlined />,
      label: "Product Manager",
      onClick: () => {
        navigate("productmanage");
      },
    },
    {
      key: "4",
      icon: <ProductOutlined />,
      label: "Product Variant Manager",
      onClick: () => {
        navigate("productvariantmanage");
      },
    },
    {
      key: "5",
      icon: <MenuUnfoldOutlined />,
      label: "Category manager",
      onClick: () => {
        navigate("categorymanage");
      },
    },
    {
      key: "6",
      icon: <SkinOutlined />,
      label: "Size manager",
      onClick: () => {
        navigate("sizemanage");
      },
    },
    {
      key: "7",
      icon: <FormatPainterOutlined />,
      label: "Color manager",
      onClick: () => {
        navigate("colormanage");
      },
    },
    {
      key: "8",
      icon: <EuroCircleOutlined />,
      label: "payment manager",
      onClick: () => {
        navigate("paymentmanage");
      },
    },
    {
      key: "9",
      icon: <SettingOutlined />,
      label: "Option",
      children: [
        {
          key: "91",
          label: "Home",
          icon: <HomeFilled />,
          onClick: () => {
            navigate("/");
          },
        },
        {
          key: "92",
          label: "Logout Admin",
          icon: <LockFilled />,
          onClick: () => {
            localStorage.clear();
            navigate("/login");
          },
        },
      ],
    },
  ];
  const getLevelKeys = (items1) => {
    const key = {};
    const func = (items2, level = 1) => {
      items2.forEach((item) => {
        if (item.key) {
          key[item.key] = level;
        }
        if (item.children) {
          func(item.children, level + 1);
        }
      });
    };
    func(items1);
    return key;
  };
  const levelKeys = getLevelKeys(items);

  const [stateOpenKeys, setStateOpenKeys] = useState(["2", "23"]);
  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      nav("/login");
    } else {
      const token_id = jwtDecode(localStorage.getItem("token")).id;
      Axios.get(`/user/${token_id}`).then((res) => {
        // console.log(res.data.data[0].role);
        if (res.data.data[0].role !== 2) {
          navigate("/");
        }
      });
    }
  }, []);
  const handleNavigate = () => {
    navigate("/dashboard");
  };
  return (
    <div className="DashBoard">
      <div className="Left_Navbar">
        <div className="header_left_nav" onClick={handleNavigate}>
          <img
            src="https://deer6.vn/wp-content/uploads/2024/10/Untitled-2.png"
            alt=""
          />
          <span>ADMIN</span>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          openKeys={stateOpenKeys}
          onOpenChange={onOpenChange}
          style={{
            width: 256,
            minHeight: "100vh",
            flex: 1,
          }}
          items={items}
        />
      </div>
      <div className="dashboard_container">
        {outlet ? <Outlet></Outlet> : <OderManage noti={noti}></OderManage>}
      </div>
    </div>
  );
}
