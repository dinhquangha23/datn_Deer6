import { Button, Input, Modal, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import CartItem from "../../../component/CartItem";
import CartManage from "../../../component/CartManage";
import CartResult from "../../../component/CartResult/CartResult";
import "./OderManage.css";
import { fomartMoney } from "../../../util";
import { toast } from "react-toastify";
import Axios from "../../../util/axios";
import { useNavigate } from "react-router-dom";
const { Search } = Input;

function OderManage({ noti }) {
  const nav = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      nav("/login");
    }
  });
  const columns = [
    {
      title: "Tên Khách Hàng",
      dataIndex: "full_name",
      key: "full_name",
      render: (text) => <a>{text}</a>,
      onCell: () => ({
        style: { width: 180 },
      }),
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phone",
      key: "phone",
      onCell: () => ({
        style: { width: 120 },
      }),
    },
    {
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
      onCell: () => ({
        style: { width: 300 },
      }),
    },
    {
      title: "Tổng Tiền",
      dataIndex: "total_money",
      key: "TotalMoney",
      render: (text) => <a>{fomartMoney(text)}</a>,
      onCell: () => ({
        style: { width: 100 },
      }),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (text) => <a>{text}</a>,
      onCell: () => ({
        style: { width: 200 },
      }),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "note",
      render: (text, record) => {
        return (
          <Select
            className={text === "Đang Giao Hàng" ? "green-select" : ""}
            value={text}
            onChange={(value) => {
              handleSelectStatusChange(value, record);
            }}
            style={{ width: 200 }}
            placeholder="Trạng thái đơn hàng"
          >
            {ListStatus.map((value, index) => (
              <Select.Option key={index} value={value}>
                {value}
              </Select.Option>
            ))}
          </Select>
        );
      },
      onCell: () => ({
        style: { width: 150 },
      }),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              setIsCreate(false);
              handleCheckDetail(record);
            }}
          >
            Detail
          </Button>
          <Button
            type="primary"
            onClick={() => {
              handleDelete(record);
            }}
            danger
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  const handleSelectStatusChange = (value, record) => {
    // let url = `${import.meta.env.VITE_APP_API}payment`;
    // let optionFetch = {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ status: value, id: record.id }),
    // };
    // fetch(url, optionFetch)
    //   .then((response) => response.json())
    //   .then((Response) => {
    //     setFlagrender((pre) => !pre);
    //   });
    // console.log(record);
    Axios.put("/AdminUpdateStatus", {
      id_order: record.id,
      status: value,
    }).then((res) => {
      if (res.data.code == 200) {
        noti(toast.success(res.data.message));
        setFlagrender((pre) => !pre);
      }
    });
  };

  const handleCheckDetail = (data) => {
    // console.log("in check detail data:",data.id_product)
    // let url = `${import.meta.env.VITE_APP_API}getlistproduct`;
    // let optionFetch = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: data.id_product,
    // };
    // fetch(url, optionFetch)
    //   .then((response) => response.json())
    //   .then((Response) => {
    //     setDataModal(Response);
    //     showModal();
    //   });
    Axios.get(`/orderTrackingByIdOrder/${data.id}`).then((res) => {
      setDataModal(res.data.data);
      showModal();
    });
  };

  let ListStatus = [
    "Đã Thanh Toán",
    "Đang chờ xác nhận đơn hàng",
    "Đang Giao Hàng",
  ];
  const [dataPay, setDataPay] = useState([]);
  const [status, setStatus] = useState("");
  const [dataModal, setDataModal] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [flagRender, setFlagrender] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      nav("/login");
    } else {
      Axios.get("/order").then((res) => {
        setDataPay(res.data.data);
      });
    }
  }, [flagRender]);
  useEffect(() => {
    if (isCreate) {
      console.log("in are creating");
    }
    console.log("data - modal :", dataModal);
    // console.log("data - gếtver :",JSON?.parse(dataPay[5]?.infor_local))
    console.log("data - gếtver :", dataPay);
  });
  const handleDelete = (data) => {
    console.log(data);
    Axios.delete(`/order/${data.id}`).then((res) => {
      if (res.data.code == 200) {
        noti(toast.success(res.data.message));
        setFlagrender((pre) => !pre);
      }
    });
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setDataModal([]);
  };
  const handleSearch = (value) => {
    Axios.get(`/orderSearch?search=${value}`).then((res) => {
      setDataPay(res.data.data);
    });
  };
  return (
    <div className="account_manage">
      <div className="addRequest">
        <div className="search_manage">
          <Search
            placeholder="input search text"
            onSearch={handleSearch}
            enterButton
          />
        </div>
        {/* <Button
          type="primary"
          onClick={() => {
            setDataModal({});
            showModal();
            setIsCreate(true);
          }}
        >
          Add New Order
        </Button> */}
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataPay}
        pagination={false}
      />
      <Modal
        title="Danh mục"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          {dataModal &&
            dataModal?.map((item) => {
              return <CartManage key={item.id_product} dataManage={item} />;
            })}
        </div>
      </Modal>
    </div>
  );
}

export default OderManage;
