"use client";

import LayoutAdmin from "@/components/LayoutAdmin";
import { Button, Col, Form, Input, Row, Select, Table } from "antd";
import { useState } from "react";

const { Option } = Select

const RegisEntranceExam = () => {

  const [formRegis] = Form.useForm()

  const [data, setData] = useState({});

  const columns = [
    {
      title: "Môn",
      render: (text, record, index) => {
        return <div>{record?.subject}</div>;
      },
      align: "center",
    },
    {
      title: "Ghi chú",
      render: (text, record) => {
        return <div >{record?.note}</div>;
      },
      align: "center",
    },
  ]

  const submitRegis = (values) => {
    setData({ ...values })
  }

  const cancelRegis = () => {
    formRegis.resetFields()
    setData({})
  }
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8} className="border-[1px] !p-0">
          <p className="mb-0 bg-[#4777d6] text-white p-2 w-full">Đăng ký thi thử</p>
          <Form
            form={formRegis}
            className="mx-2 my-5"
            onFinish={submitRegis}
          >
            <Form.Item
              name="code"
              rules={[
                { required: true, message: "Đây là trường thông tin bắt buộc!" }
              ]}
            >
              <Input placeholder="Tạo mã HS" disabled={data?.code} />
            </Form.Item>
            <Form.Item
              name="fullname"
              rules={[
                { required: true, message: "Đây là trường thông tin bắt buộc!" }
              ]}
            >
              <Input placeholder="Tên HS" disabled={data?.code} />
            </Form.Item>
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: "Đây là trường thông tin bắt buộc!" }
              ]}
            >
              <Input placeholder="SĐT" disabled={data?.code} />
            </Form.Item>
            <Form.Item
              name="class"
              rules={[
                { required: true, message: "Đây là trường thông tin bắt buộc!" }
              ]}>
              <Select
                placeholder="-- Chọn lớp --"
                disabled={data?.code}
              >
                <Option value="1">Lớp 1</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="subject"
              rules={[
                { required: true, message: "Đây là trường thông tin bắt buộc!" }
              ]}>
              <Select
                placeholder="-- Chọn môn --"
                mode="multiple"
                disabled={data?.code}
              >
                <Option value="Môn Văn">Môn Văn</Option>
                <Option value="Môn Toán">Môn Toán</Option>
              </Select>
            </Form.Item>
            <Form.Item name="note">
              <Input placeholder="Ghi chú" disabled={data?.code} />
            </Form.Item>
            <Row justify="center">
              <Col>
                <Button type="primary" htmlType="submit" disabled={data?.code}>Xác nhận</Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col xs={24} lg={16} className="border-[1px] !p-0">
          <p className="mb-4 bg-[#4777d6] text-white p-2 w-full">Thông tin đăng ký thi thử</p>
          <Row gutter={[16, 16]} className="px-14 my-5">
            <Col xs={12} className="border-[1px] border-r-0">
              <div className="flex">
                <div className="w-1/4 py-2 font-semibold border-r-[1px]">Mã số</div>
                <div className="w-3/4 py-2">{data?.code}</div>
              </div>
            </Col>
            <Col xs={12} className="border-[1px]">
              <div className="flex">
                <div className="w-1/4 py-2  font-semibold border-r-[1px]">SĐT</div>
                <div className="w-2/4 py-2 ">{data?.phone}</div>
              </div>
            </Col>
            <Col xs={12} className="border-[1px] border-r-0">
              <div className="flex ">
                <div className="w-1/4 py-2  font-semibold border-r-[1px]">Họ và tên</div>
                <div className="w-2/4 py-2 ">{data?.fullname}</div>
              </div>
            </Col>
            <Col xs={12} className="border-[1px]">
              <div className="flex ">
                <div className="w-1/4 py-2  font-semibold border-r-[1px]">Lớp</div>
                <div className="w-2/4 py-2 ">{data?.class}</div>
              </div>
            </Col>
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
              dataSource={data?.subject?.length > 0 && data?.subject?.map((x, i) => ({ key: i, subject: x, note: data?.note }))}
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
            <Row gutter={[8, 8]} justify="center" className="w-full">
              <Col>
                <Button onClick={cancelRegis} disabled={!data?.code}>Hủy bỏ</Button>
              </Col>
              <Col>
                <Button type="primary" disabled={!data?.code}>Xác nhận</Button>
              </Col>
            </Row>
          </Row>
        </Col>
      </Row>
    </>
  )
}

RegisEntranceExam.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default RegisEntranceExam 