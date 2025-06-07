import React, { useEffect, useState } from "react";
import { Button, Space, Table, Modal, Select } from "antd";
import "./AccountManage.css";
import { toast } from "react-toastify";
import Axios from "../../../util/axios";

export default function AccountManage({ noti }) {
  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <a>{text}</a>,
      onCell: () => ({
        style: { width: 260 },
      }),
    },
    {
      title: "Name",
      dataIndex: "full_name",
      key: "full_name",
      render: (text) => <a>{text}</a>,
      onCell: () => ({
        style: { width: 180 },
      }),
    },

    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      onCell: () => ({
        style: { width: 389 },
      }),
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <a>{text && `+${text}`}</a>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      onCell: () => ({
        style: { width: 120 },
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
              showModal(record);
              setDataModal(record);
              setIsCreate(false);
            }}
          >
            Update
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

  const [dataUser, setDataUser] = useState([]);
  const [dataModal, setDataModal] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [dataModalAdd, setDataModalAdd] = useState({});
  const [isCreate, setIsCreate] = useState(false);
  const [flagRender, setFlagrender] = useState(false);
  const [role, setRole] = useState();
  const [password, setPassword] = useState(null);

  useEffect(() => {
    Axios.get("/user").then((res) => {
      console.log(res.data.data);
      setDataUser(res.data.data);
      Axios.get("/role").then((res) => {
        console.log(res.data.data);
        setRole(res.data.data);
      });
    });
  }, [flagRender]);
  useEffect(() => {
    if (isCreate) {
      console.log("in are creating");
    }
    console.log("data - modal :", dataModal);
  });
  const handleDelete = (data) => {
    console.log(data);
    Axios.delete(`/deleteAccount/${data.id}`).then((res) => {
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
    if (isCreate) {
      // let url = `${import.meta.env.VITE_APP_API}user`;
      // let option = {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(dataModal),
      // };
      // fetch(url, option)
      //   .then((Response) => Response.json())
      //   .then((response) => {
      //     console.log(response);
      //     setFlagrender((pre) => !pre);
      //     noti(toast("Thêm tài khoản thành công"));
      //   });
    } else {
      Axios.put("user", {
        idUser: dataModal.id,
        fullName: dataModal.full_name,
        phoneNumber: dataModal.phone,
        address: dataModal.address,
        role: dataModal.role,
        password: password,
      }).then((res) => {
        setFlagrender((pre) => !pre);
        setPassword(null);
        noti(toast.success(res.data.message));
      });
    }
  };
  const handleCancel = () => {
    setPassword(null);
    setIsModalOpen(false);
    setModalAddOpen(false);
  };
  const handleEmailChange = (e) => {
    setDataModal((pre) => {
      return { ...pre, fullname: e.target.value };
    });
  };
  const handleAddEmailChange = (e) => {
    setDataModalAdd((pre) => {
      return { ...pre, email: e.target.value };
    });
  };
  const handleAddPasswordChange = (e) => {
    setDataModalAdd((pre) => {
      return { ...pre, password: e.target.value };
    });
  };
  const handleSelectAddRoleChange = (value) => {
    setDataModalAdd((pre) => {
      return { ...pre, role: parseInt(value) };
    });
  };
  const handleNameChange = (e) => {
    setDataModal((pre) => {
      return { ...pre, full_name: e.target.value };
    });
  };
  const handleSelectRoleChange = (value) => {
    setDataModal((pre) => {
      return { ...pre, role: parseInt(value) };
    });
  };
  const handleAddressChange = (e) => {
    setDataModal((pre) => {
      return { ...pre, address: e.target.value };
    });
  };
  const handlePhoneNumberChange = (e) => {
    setDataModal((pre) => {
      return { ...pre, phone: e.target.value };
    });
  };
  const handleChangePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleAddOk = () => {
    console.log(dataModalAdd);
    Axios.post("/addAccount", dataModalAdd).then((res) => {
      if (res.data.code == 402) {
        noti(toast.warning(res.data.message));
      } else {
        noti(toast.success(res.data.message));
        setFlagrender((pre) => !pre);
      }
    });
  };
  return (
    <div className="account_manage">
      <div className="addRequest">
        <Button
          type="primary"
          onClick={() => {
            setModalAddOpen(true);
            setDataModalAdd({});
            setIsCreate(true);
          }}
        >
          Add New Account
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataUser}
        pagination={false}
      />
      <Modal
        title="Update Account"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <span>Email </span>
          <input
            className="modal_input_update"
            value={dataModal?.email || ""}
            spellCheck="false"
            type="text"
            disabled={isCreate ? false : true}
            placeholder="Email or Fullname"
            onChange={handleEmailChange}
          />{" "}
        </div>
        <div>
          <span>Name</span>
          <input
            className="modal_input_update"
            value={dataModal?.full_name || ""}
            spellCheck="false"
            type="text"
            placeholder="Name"
            onChange={handleNameChange}
          />{" "}
        </div>
        <div>
          <span style={{ display: "block" }}>Role</span>
          <Select
            value={dataModal.role}
            onChange={handleSelectRoleChange}
            style={{ width: "100%" }}
            placeholder="Choise role"
          >
            {role &&
              role.map((value) => (
                <Select.Option key={value.id} value={value.id}>
                  {value.name}
                </Select.Option>
              ))}
          </Select>{" "}
        </div>
        <div>
          <span>Address</span>
          <input
            className="modal_input_update"
            value={dataModal?.address || ""}
            spellCheck="false"
            type="text"
            placeholder="Address"
            onChange={handleAddressChange}
          />{" "}
        </div>
        <div>
          <span>Phone Number</span>
          <input
            className="modal_input_update"
            value={dataModal?.phone || ""}
            spellCheck="false"
            type="text"
            placeholder="Phone Number"
            onChange={handlePhoneNumberChange}
          />{" "}
        </div>
        <div>
          <span>Password</span>
          <input
            className="modal_input_update"
            disabled={dataModal.password == null ? true : false}
            value={password || ""}
            spellCheck="false"
            type="text"
            placeholder="change password"
            onChange={handleChangePasswordChange}
          />{" "}
        </div>
      </Modal>
      {/* modal thêm tài khoản */}
      <Modal
        title="Add new Account"
        open={modalAddOpen}
        onOk={handleAddOk}
        onCancel={handleCancel}
      >
        <div>
          <span>Email </span>
          <input
            className="modal_input_update"
            value={dataModalAdd?.email || ""}
            spellCheck="false"
            type="text"
            disabled={isCreate ? false : true}
            placeholder="Email or Fullname"
            onChange={handleAddEmailChange}
          />{" "}
        </div>
        <div>
          <span>Pasword</span>
          <input
            className="modal_input_update"
            value={dataModalAdd?.password || ""}
            spellCheck="false"
            type="text"
            placeholder="Name"
            onChange={handleAddPasswordChange}
          />{" "}
        </div>
        <div>
          <span style={{ display: "block" }}>Role</span>
          <Select
            value={dataModalAdd.role}
            onChange={handleSelectAddRoleChange}
            style={{ width: "100%" }}
            placeholder="Choise role"
          >
            {role &&
              role.map((value) => (
                <Select.Option key={value.id} value={value.id}>
                  {value.name}
                </Select.Option>
              ))}
          </Select>{" "}
        </div>
      </Modal>
    </div>
  );
}
