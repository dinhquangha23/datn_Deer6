import React, { useEffect, useState } from "react";
import { Button, Flex, Modal, Select, Space, Table, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import Axios from "../../../util/axios";
import { use } from "react";

export default function Productmanage({ noti }) {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "Name",
      render: (text) => <a>{text}</a>,
      onCell: () => ({
        style: { width: 460 },
      }),
    },
    {
      title: "First Image",
      dataIndex: "first_image",
      key: "firstimage",
      // render: (text) => <a>{text}</a>,
      render: (text) => (
        <img
          style={{ width: "60px", height: "60px", objectFit: "cover" }}
          src={`${import.meta.env.VITE_HOST_API}${text}`}
        />
      ),
      onCell: () => ({
        style: { width: 150 },
      }),
    },
    {
      title: "Second Image",
      dataIndex: "second_image",
      key: "second Image",
      render: (text) => (
        <img
          style={{ width: "60px", height: "60px", objectFit: "cover" }}
          src={`${import.meta.env.VITE_HOST_API}${text}`}
        />
      ),
      onCell: () => ({
        style: { width: 150 },
      }),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price--1",
      onCell: () => ({
        style: { width: 100 },
      }),
    },
    {
      title: "Category",
      dataIndex: "category_name",
      key: "category",
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
          <Button
            type="primary"
            onClick={() => {
              handleGetDataVariant(record);
            }}
            // danger
          >
            Add Varriant
          </Button>
        </Space>
      ),
    },
  ];

  const props_upload = {
    // action: "//jsonplaceholder.typicode.com/posts/",
    listType: "picture",
    maxCount: 1,
    previewFile(file) {
      // console.log("Your upload file:", file);
      return Promise.resolve(URL.createObjectURL(file));
    },
    // beforeUpload(file) {
    //   // console.log(file);
    //   return false;
    // },
  };

  const [fileList1, setFileList1] = useState([]);
  const [fileList2, setFileList2] = useState([]);

  const handleChange1 = ({ fileList }) => setFileList1(fileList);
  const handleChange2 = ({ fileList }) => setFileList2(fileList);

  const [dataProduct, setDataProduct] = useState([]);
  const [dataModal, setDataModal] = useState({
    name: "",
    first_image: null,
    second_image: null,
    price: "",
    category_id: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [flagRender, setFlagrender] = useState(false);
  const [categoryValue, setCategoryValue] = useState([]);
  // const [selectedValue,setSelectValue]= useState(2)

  useEffect(() => {
    Axios.get("/getAllProduct").then((res) => {
      // console.log(res.data.data);
      setDataProduct(res.data.data);
    });
  }, [flagRender]);
  useEffect(() => {
    // let url = `${import.meta.env.VITE_APP_API}category`;
    // fetch(url)
    //   .then((Response) => Response.json())
    //   .then((response) => setCategoryValue(response));
    Axios.get("/category").then((res) => {
      setCategoryValue(res.data.data);
    });
  }, []);
  useEffect(() => {
    if (isCreate) {
      console.log("in are creating");
    }
    console.log("data - modal :", dataModal);
  });
  const handleDelete = (data) => {
    console.log(data.id);
    Axios.delete(`/product/${data.id}`).then((res) => {
      if (res.data.code == 200) {
        noti(toast.success(res.data.message));
        setFlagrender((pre) => !pre);
      } else {
        noti(toast.error(res.data.message));
      }
    });
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    if (isCreate) {
      let NullExist = Object.values(dataModal).some((value) => value === null);
      console.log("dữ liệu gửi đi", dataModal);
      if (NullExist) {
        noti(toast.warning("Có trường dữ liệu bị trống"));
      } else {
        const formData = new FormData();
        for (const key in dataModal) {
          formData.append(key, dataModal[key]);
        }
        // for (let [key, value] of formData.entries()) {
        //   console.log(`${key}:`, value);
        // }
        Axios.post("/product", formData).then((res) => {
          if (res.data.code == 201) {
            noti(toast.success(res.data.message));
            handleCancel();
            setFlagrender((pre) => !pre);
          } else {
            res.data.code != 201 && noti(toast.error(res.data.message));
          }
        });
      }
    } else {
      console.log("dữ liệu update  gửi đi ", dataModal);
      const formData = new FormData();
      for (const key in dataModal) {
        formData.append(key, dataModal[key]);
      }
      Axios.put("/product", formData).then((res) => {
        if (res.data.code == 200) {
          noti(toast.success(res.data.message));
          handleCancel();
          setFlagrender((pre) => !pre);
        } else {
          res.data.code != 200 && noti(toast.error(res.data.message));
        }
      });
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setDataModal({
      name: "",
      first_image: null,
      second_image: null,
      price: "",
      category_id: null,
    });
    setFileList1([]);
    setFileList2([]);
  };
  const handleTitleChange = (e) => {
    console.log(1);
    setDataModal((pre) => {
      return { ...pre, name: e.target.value };
    });
  };
  const handleFirstImageChange = (file) => {
    setDataModal((pre) => {
      return { ...pre, first_image: file };
    });
    return false;
  };
  const handleSecondImageChange = (file) => {
    setDataModal((pre) => {
      return { ...pre, second_image: file };
    });
    return false;
  };
  const handlePriceChange = (e) => {
    setDataModal((pre) => {
      return { ...pre, price: parseInt(e.target.value) };
    });
  };
  const handleSelectCategoryChange = (value) => {
    console.log("value categorychange", parseInt(value));
    setDataModal((pre) => {
      return { ...pre, category_id: parseInt(value) };
    });
  };

  // phần modal variant====================================
  const [dataVariant, setDataVariant] = useState({
    id_size: null,
    id_product: null,
    id_color: null,
  });
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [sizeModal, setSizeModal] = useState();
  const [ListSize, setListSize] = useState([]); // ["s","m","l","xl"]
  const [colorModal, setColorModal] = useState();
  const [hasColor, setHasColor] = useState();
  const handleSelectSizeChange = (value) => {
    console.log("value categorychange", parseInt(value));
    setDataVariant((pre) => {
      return { ...pre, id_size: parseInt(value) };
    });
    Axios.post("/listColorBySize", {
      id_size: value,
      id_product: dataVariant.id_product,
    }).then((res) => {
      console.log(res.data.data);
      setHasColor(res.data.data);
    });
  };
  const handleSelectcolorChange = (value) => {
    console.log("value categorychange", parseInt(value));
    setDataVariant((pre) => {
      return { ...pre, id_color: parseInt(value) };
    });
  };
  const handleGetDataVariant = (data) => {
    setDataVariant((pre) => {
      return { ...pre, id_product: parseInt(data.id), name: data.name };
    });
    setVariantModalOpen("true");
    // lấy dữ liệu đổ vào modal
    console.log(data);
    Axios.get("/size").then((res) => {
      setSizeModal(res.data.data);
      Axios.get("/color").then((res) => {
        setColorModal(res.data.data);
      });
    });
    Axios.get("sizeList").then((res) => {
      // console.log(res.data.data);
      setListSize(res.data.data);
    });
  };
  const handleCreateVariant = () => {
    console.log(dataVariant);
    let NullExist = Object.values(dataVariant).some(
      (value) => value === null || value === ""
    );
    if (!NullExist) {
      Axios.post("addVariant", dataVariant).then((res) => {
        console.log(res.data.data);
        setDataVariant({
          id_size: null,
          id_product: null,
          id_color: null,
        });
        setSizeModal(null);
        setColorModal(null);
        setVariantModalOpen(false);
        res.data.code == 201 && noti(toast.success(res.data.message));
      });
    }
  };
  return (
    <div className="account_manage">
      <div className="addRequest">
        <Button
          type="primary"
          onClick={() => {
            showModal();
            setDataModal({
              name: "",
              first_image: null,
              second_image: null,
              price: "",
              category_id: null,
            });
            setIsCreate(true);
          }}
        >
          Add New Product
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataProduct}
        pagination={false}
      />
      <Modal
        title={isCreate ? "THÊM SẢN PHẦM" : "SỬA SẢN PHẨM"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <span>Name</span>
          <input
            className="modal_input_update"
            value={dataModal?.name || ""}
            spellCheck="false"
            type="text"
            placeholder="Product Name"
            onChange={handleTitleChange}
          />{" "}
        </div>
        <div>
          <span style={{ display: "block" }}>First Image</span>

          <Upload
            {...props_upload}
            beforeUpload={handleFirstImageChange}
            fileList={fileList1}
            onChange={handleChange1}
            onRemove={(file) => {
              setDataModal((pre) => {
                return { ...pre, first_image: null };
              });
            }}
          >
            <Button icon={<UploadOutlined />}>Upload FIRST IMAGE </Button>
          </Upload>
        </div>
        <div>
          <span style={{ display: "block" }}>Second Image</span>

          <Upload
            {...props_upload}
            beforeUpload={handleSecondImageChange}
            fileList={fileList2}
            onChange={handleChange2}
            onRemove={(file) => {
              setDataModal((pre) => {
                return { ...pre, second_image: null };
              });
            }}
          >
            <Button icon={<UploadOutlined />}>Upload FIRST IMAGE</Button>
          </Upload>
        </div>
        <div>
          <span>Price</span>
          <input
            className="modal_input_update"
            value={dataModal?.price || ""}
            spellCheck="false"
            type="number"
            placeholder="Price"
            onChange={handlePriceChange}
          />{" "}
        </div>
        <div className="categoryOption">
          <span>Category</span>
          <Select
            value={dataModal.category_id}
            onChange={handleSelectCategoryChange}
            style={{ width: 200 }}
            placeholder="Select Category Name"
          >
            {categoryValue.map((value) => (
              <Select.Option key={value.id} value={value.id}>
                {value.name
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")}
              </Select.Option>
            ))}
          </Select>{" "}
        </div>
      </Modal>
      {/* modal variant */}
      <Modal
        title={"THÊM BIẾN THỂ MÀU SẮC VÀ SIZE"}
        open={variantModalOpen}
        onOk={handleCreateVariant}
        onCancel={() => {
          setVariantModalOpen(false);
          setDataVariant({
            id_size: null,
            id_product: null,
            id_color: null,
          });
          setSizeModal(null);
          setColorModal(null);
        }}
      >
        <div>
          <span>Name</span>
          <input
            className="modal_input_update"
            value={dataVariant?.name || ""}
            spellCheck="false"
            type="text"
            placeholder="Product Name"
            disabled={true}
            onChange={() => {}}
          />{" "}
        </div>

        <div className="categoryOption">
          <span>SIZE</span>
          <Select
            value={dataVariant?.id_size}
            onChange={handleSelectSizeChange}
            // style={{ width: 200 }}
            placeholder="Choise Size Variant"
          >
            {sizeModal &&
              sizeModal.map((value) => (
                <Select.Option key={value.id} value={value.id}>
                  {value.size}
                </Select.Option>
              ))}
          </Select>{" "}
        </div>
        <div className="categoryOption">
          <span>COLOR</span>
          <Select
            value={dataVariant.id_color}
            onChange={handleSelectcolorChange}
            // style={{ width: 200 }}
            placeholder="Choise Color Variant"
          >
            {colorModal &&
              colorModal.map((value) => (
                <Select.Option
                  key={value.id}
                  value={value.id}
                  disabled={hasColor?.includes(value.color)}
                >
                  {value.color}
                </Select.Option>
              ))}
          </Select>{" "}
        </div>
      </Modal>
    </div>
  );
}
