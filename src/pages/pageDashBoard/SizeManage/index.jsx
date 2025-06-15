import { Button, Input, Modal, Space, Table } from "antd";
import Axios from "../../../util/axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
const { Search } = Input;
export default function SizeManage({ noti }) {
  const columns = [
    {
      title: "Size Id",
      dataIndex: "id",
      key: "CategoryId",
      render: (text) => <a>{text}</a>,
      onCell: () => ({
        style: { width: 260 },
      }),
    },
    {
      title: "Size Name",
      dataIndex: "size",
      key: "size",
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

  const [dataSize, setDataSize] = useState([]);
  const [dataModal, setDataModal] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [flagRender, setFlagrender] = useState(false);

  useEffect(() => {
    console.log("flagRender", flagRender);
    Axios.get("/size").then((res) => {
      setDataSize(res.data.data);
    });
  }, [flagRender]);
  useEffect(() => {
    if (isCreate) {
      console.log("in are creating");
    }
    console.log("data - modal :", dataModal);
    console.log("data - gếtver :", dataSize);
  });
  const handleDelete = (data) => {
    Axios.delete(`/size/${data.id}`).then((res) => {
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
      Axios.post("/size", { size: dataModal.size }).then((res) => {
        if (res.data.code == 201) {
          setFlagrender((pre) => !pre);
          noti(toast.success(res.data.message));
        } else {
          setFlagrender((pre) => !pre);
          noti(toast.warning(res.data.message));
        }
      });
    } else {
      Axios.put("/size", dataModal).then((res) => {
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
      return { ...pre, size: e.target.value.toUpperCase() };
    });
  };
  const handleSearch = (value) => {
    Axios.get(`/sizeSearch?search=${value}`).then((res) => {
      setDataSize(res.data.data);
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
          Add New Size
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataSize}
        pagination={false}
      />
      <Modal
        title="QUẢN LÝ SIZE"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <span>Size Name</span>
          <input
            className="modal_input_update"
            value={dataModal.size ? dataModal.size : ""}
            spellCheck="false"
            type="text"
            placeholder="Size Name"
            onChange={handleCategoryNameChange}
          />{" "}
        </div>
      </Modal>
    </div>
  );
}
