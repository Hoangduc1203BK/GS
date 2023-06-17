"use client";

import LayoutAdmin from "@/components/LayoutAdmin";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Space, Table } from "antd";

const ClassroomManagement = () => {
  const [form] = Form.useForm()
  const submitSearch = (values) => {
    console.log(values, 'valuesss');
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
      title: "Trung tâm",
      render: (text, record) => {
        return <div >{record?.name}</div>;
      },
      align: "center",
    },
    {
      title: "Phòng học",
      render: (text, record) => {
        return <div >{record?.classroom}</div>;
      },
      align: "center",
    },
    {
      title: "Mô tả",
      render: (text, record) => {
        return <div >{""}</div>;
      },
      align: "center",
    },
    {
      title: "Địa chỉ",
      render: (text, record) => {
        return <div >{""}</div>;
      },
      align: "center",
    },
    {
      title: "Thao tác",
      render: (text, record) => {
        return <div >
          <Space size="small">
            <EditOutlined style={{
              color: "#b9db84"
            }} className="text-base cursor-pointer" />
            <DeleteOutlined style={{
              color: "#fc4a6c"
            }} className="text-base cursor-pointer" />
          </Space>
        </div>;
      },
      align: "center",
    },
  ]
  const dataSource = [
    {
      name: "Trung tâm 1",
      classroom: "101"
    },
    {
      name: "Trung tâm 2",
      classroom: "102"
    }
  ]
  return (
    <>
      <p>Danh sách phòng học</p>
      <Form
        form={form}
        onFinish={submitSearch}
      >
        <Row>
          <Col xs={24} lg={8}>
            <Form.Item name="name">
              <Input placeholder="Tìm kiếm theo tên..." />
            </Form.Item>
          </Col>
          <Col xs={24} lg={16}>
            <Row justify="end" gutter={[8, 8]}>
              <Col>
                <Button>Lọc</Button>
              </Col>
              <Col>
                <Button type="primary" htmlType="submit">Tìm kiếm</Button>
              </Col>
              <Col>
                <Button type="primary">Thêm mới</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
      <Table
        // locale={{
        //                     emptyText: <div style={{ marginTop: '20px' }}>{loading ? null : listResult.length === 0 ? "Sinh viên chưa đăng ký HP nào trong kỳ này!" : null}</div>,
        //                 }}
        // rowSelection={{
        //     type: 'checkbox',
        //     selectedRowKeys: idSelect,
        //     onChange: (selectedRowKeys, selectedRows) => {
        //         setIdSelect(selectedRowKeys)
        //         // setRecordSelect(selectedRows)
        //     }
        // }}
        size="middle"
        dataSource={dataSource?.map(x => ({ ...x, key: x?.classroom }))}
        columns={columns}
        bordered
        scroll={{ x: 1000 }}
        pagination={{
          locale: { items_per_page: "/ trang" },
          // total: listResult?.length,
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