import { Button, Input, Modal, Space, Table } from "antd";
import Axios from "../../../util/axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
const { Search } = Input;

export default function ColorManage({ noti }) {
  const columns = [
    {
      title: "Color Id",
      dataIndex: "id",
      key: "colorId",
      render: (text) => <a>{text}</a>,
      onCell: () => ({
        style: { width: 260 },
      }),
    },
    {
      title: "Color Name",
      dataIndex: "color",
      key: "color",
      onCell: () => ({
        style: { width: 560 },
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

  const [dataColor, setDataColor] = useState([]);
  const [dataModal, setDataModal] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [flagRender, setFlagrender] = useState(false);

  useEffect(() => {
    console.log("flagRender", flagRender);
    Axios.get("/color").then((res) => {
      setDataColor(res.data.data);
    });
  }, [flagRender]);
  useEffect(() => {
    if (isCreate) {
      console.log("in are creating");
    }
    console.log("data - modal :", dataModal);
    console.log("data - gếtver :", dataColor);
  });
  const handleDelete = (data) => {
    Axios.delete(`/color/${data.id}`).then((res) => {
      if (res.data.code == 200) {
        setFlagrender((pre) => !pre);
        noti(toast.success(res.data.message));
      }
    });
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    if (isCreate) {
      Axios.post("/color", { color: dataModal.color }).then((res) => {
        if (res.data.code == 201) {
          setFlagrender((pre) => !pre);
          noti(toast.success(res.data.message));
        } else {
          setFlagrender((pre) => !pre);
          noti(toast.warning(res.data.message));
        }
      });
    } else {
      Axios.put("/color", dataModal).then((res) => {
        if (res.data.code == 200) {
          setFlagrender((pre) => !pre);
          noti(toast.success(res.data.message));
        }
      });
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setDataModal({});
  };
  const handleCategoryNameChange = (e) => {
    setDataModal((pre) => {
      return { ...pre, color: e.target.value };
    });
  };

  const handleSearch = (value) => {
    Axios.get(`/colorSearch?search=${value}`).then((res) => {
      setDataColor(res.data.data);
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
        dataSource={dataColor}
        pagination={false}
      />
      <Modal
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
      </Modal>
    </div>
  );
}
