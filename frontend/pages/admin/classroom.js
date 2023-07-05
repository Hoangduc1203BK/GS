"use client";

import { createClassRoom, getListClassRoom, updateClassRoom } from "@/api/address";
import LayoutAdmin from "@/components/LayoutAdmin";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Space, Table, Tooltip, message } from "antd";
import { useEffect, useState } from "react";

const ClassroomManagement = ({ user }) => {
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState([]);
  const [recall, setRecall] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    mode: 1, // mode 1: add / 2: edit,
    id: "" // have when edit
  });

  useEffect(() => {
    getListClassRoom().then(
      res => {
        setDataSource(res?.data)
      }
    ).catch(err => message.error("Lấy dữ liệu thất bại!"))
  }, [recall]);

  const handleModal = (open, option, record) => {
    setModal({
      open: open,
      mode: option,
      id: record?.id || ""
    })
    if (option == 2) {
      form.setFieldsValue({
        name: record?.name,
        description: record?.description
      })
    }
    else {
      form.resetFields()
    }
  }


  const columns = [
    {
      title: "STT",
      render: (text, record, index) => {
        return <div>{index + 1}</div>;
      },
      align: "center",
      width: 50,
    },
    {
      title: "Phòng học",
      render: (text, record) => {
        return <div >{record?.name}</div>;
      },
      align: "center",
    },
    {
      title: "Mô tả",
      render: (text, record) => {
        return <div >{record?.description}</div>;
      },
      align: "center",
    },
    {
      title: "Thao tác",
      render: (text, record) => {
        return <div >
          <Space size="small">
            <Tooltip title="Chỉnh sửa">
              <EditOutlined onClick={() => handleModal(true, 2, record)} style={{
                color: "#b9db84"
              }} className="text-base cursor-pointer" />
            </Tooltip>
            <DeleteOutlined style={{
              color: "#fc4a6c"
            }} className="text-base cursor-pointer" />
          </Space>
        </div>;
      },
      align: "center",
    },
  ]


  const defaultTitle = () => <>
    <Row gutter={[8, 8]}>
      <Col xs={12}>
        <p className="font-bold mb-2">Danh sách phòng học</p>
      </Col>
      <Col xs={12} className="text-right">
        <Button onClick={() => handleModal(true, 1)} type="primary">Thêm mới</Button>
      </Col>
    </Row>
  </>;

  const submit = (values) => {
    if (modal.mode == 1) {
      createClassRoom(values).then(
        res => {
          if (res?.data?.id) {
            message.success("Tạo phòng học thành công!")
            setModal({
              open: false,
              mode: 1
            })
            setRecall(!recall)
          }
        }
      ).catch(err => message.error(err))
    }
    else {
      updateClassRoom(modal.id, values).then(
        res => {
          if (res?.data?.id) {
            message.success("Cập nhật thông tin phòng học thành công!")
            setModal({
              open: false,
              mode: 1
            })
            setRecall(!recall)
          }
        }
      ).catch(err => message.error(err))
    }
  }

  return (
    <>
      <Modal
        open={modal.open}
        title={modal.mode == 1 ? "Thêm phòng học" : "Sửa thông tin"}
        footer={null}
        onCancel={() => setModal({ open: false, mode: 1 })}
      >
        <Form
          form={form}
          labelCol={{ span: 5 }}
          onFinish={submit}
        >
          <Form.Item label="Tên phòng" name="name"
            rules={[
              { required: true, message: "Đây là dữ liệu bắt buộc!" }
            ]}
          >
            <Input placeholder="Nhập tên phòng" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={4} placeholder="Nhập mô tả" />
          </Form.Item>
          <Row gutter={[8, 8]} justify="center">
            <Col>
              <Button type="primary" htmlType="submit">Lưu</Button>
            </Col>
            <Col>
              <Button onClick={() => setModal({ open: false, mode: 1 })}>Hủy</Button>
            </Col>
          </Row>
        </Form>
      </Modal >
      <Table
        title={defaultTitle}
        locale={{
          emptyText: <div style={{ marginTop: '20px' }}>{dataSource.length === 0 ? "Không có dữ liệu!" : null}</div>,
        }}
        size="middle"
        dataSource={dataSource?.map(x => ({ ...x, key: x?.classroom }))}
        columns={columns}
        bordered
        scroll={{ x: 1000 }}
        pagination={{
          locale: { items_per_page: "/ trang" },
          total: dataSource?.length,
          showTotal: (total, range) => (
            <span>{`${range[0]} - ${range[1]} / ${total}`}</span>
          ),
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          defaultPageSize: 10,
          position: ["bottomRight"],
        }}


      />


    </>
  )
}


ClassroomManagement.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default ClassroomManagement