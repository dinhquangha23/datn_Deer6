import { Button, Input, Modal, Space, Table } from "antd";
import Axios from "../../../util/axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
const { Search } = Input;
export default function CategoryManage({ noti }) {
  const columns = [
    {
      title: "Category Id",
      dataIndex: "id",
      key: "CategoryId",
      render: (text) => <a>{text}</a>,
      onCell: () => ({
        style: { width: 260 },
      }),
    },
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
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

  const [dataCategory, setDataCategory] = useState([]);
  const [dataModal, setDataModal] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [flagRender, setFlagrender] = useState(false);

  useEffect(() => {
    console.log("flagRender", flagRender);
    Axios.get("/category").then((res) => {
      setDataCategory(res.data.data);
    });
  }, [flagRender]);
  useEffect(() => {
    if (isCreate) {
      console.log("in are creating");
    }
    console.log("data - modal :", dataModal);
    console.log("data - gếtver :", dataCategory);
  });
  const handleDelete = (data) => {
    // let url = `${import.meta.env.VITE_APP_API}category`;
    // let option = {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // };
    // fetch(url, option)
    //   .then((Response) => Response.json())
    //   .then((response) => {
    //     console.log(response);
    //     setFlagrender((pre) => !pre);
    //     noti(toast("xóa danh mục thành công"));
    //   });

    Axios.delete(`/category/${data.id}`).then((res) => {
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
      Axios.post("/category", { name: dataModal.name }).then((res) => {
        if (res.data.code == 201) {
          setFlagrender((pre) => !pre);
          noti(toast.success(res.data.message));
        } else {
          setFlagrender((pre) => !pre);
          noti(toast.warning(res.data.message));
        }
      });
    } else {
      Axios.put("/category", dataModal).then((res) => {
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
      return { ...pre, name: e.target.value };
    });
  };
  console.log("prop của categoryManage", { noti });
  const handleSearch = (value) => {
    Axios.get(`/categorySearch?search=${value}`).then((res) => {
      setDataCategory(res.data.data);
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
          Add New Category
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataCategory}
        pagination={false}
      />
      <Modal
        title="Danh mục"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <span>Category Name</span>
          <input
            className="modal_input_update"
            value={dataModal.name ? dataModal.name : ""}
            spellCheck="false"
            type="text"
            placeholder="Category Name"
            onChange={handleCategoryNameChange}
          />{" "}
        </div>
      </Modal>
    </div>
  );
}
