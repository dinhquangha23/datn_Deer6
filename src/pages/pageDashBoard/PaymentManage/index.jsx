import { Button, Modal, Space, Table } from "antd";
import Axios from "../../../util/axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function PaymentManage({ noti }) {
  const columns = [
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "fullName",
      render: (text) => <a>{text}</a>,
      onCell: () => ({
        style: { width: 260 },
      }),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      onCell: () => ({
        style: { width: 560 },
      }),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      onCell: () => ({
        style: { width: 560 },
      }),
    },
    {
      title: "Transaction ID",
      dataIndex: "transaction_id",
      key: "address",
      onCell: () => ({
        style: { width: 560 },
      }),
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      key: "address",
      onCell: () => ({
        style: { width: 560 },
      }),
    },
  ];

  const [dataPayment, setDataPayment] = useState([]);
  const [dataModal, setDataModal] = useState({});

  const [isCreate, setIsCreate] = useState(false);
  const [flagRender, setFlagrender] = useState(false);

  useEffect(() => {
    console.log("flagRender", flagRender);
    Axios.get("/payment").then((res) => {
      setDataPayment(res.data.data);
    });
  }, [flagRender]);
  useEffect(() => {
    if (isCreate) {
      console.log("in are creating");
    }
    console.log("data - modal :", dataModal);
    console.log("data - gếtver :", dataPayment);
  });

  console.log("prop của categoryManage", { noti });
  return (
    <div className="account_manage">
      <div className="addRequest">
        <Button
          type="primary"
          onClick={() => {
            setDataModal({});
            showModal();
            setIsCreate(true);
          }}
        >
          Add New Color
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataPayment}
        pagination={false}
      />
      {/* <Modal
        title="QUẢN LÝ SIZE"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <span>Color Name</span>
          <input
            className="modal_input_update"
            value={dataModal.color ? dataModal.color : ""}
            spellCheck="false"
            type="text"
            placeholder="Color Name"
            onChange={handleCategoryNameChange}
          />{" "}
        </div>
      </Modal> */}
    </div>
  );
}
