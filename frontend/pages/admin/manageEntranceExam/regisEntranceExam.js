"use client";

import { createExam, createUser, getListSubject } from "@/api/address";
import { GRADE } from "@/common/const";
import { validatePhone } from "@/common/util";
import LayoutAdmin from "@/components/LayoutAdmin";
import { Button, Col, Form, Input, Row, Select, Table, message } from "antd";
import { useState } from "react";

const { Option } = Select

const RegisEntranceExam = () => {

  const [formRegis] = Form.useForm()

  const [data, setData] = useState({});
  const [listSubject, setListSubject] = useState([]);

  const columns = [
    {
      title: "Môn",
      render: (text, record, index) => {
        return <div>{listSubject?.find(i => i.id === record?.subject)?.name}</div>;
      },
      align: "center",
      width: 200
    },
    {
      title: "Ghi chú",
      render: (text, record) => {
        return <div >{record?.note}</div>;
      },
      align: "center",
    },
  ]

  async function regisExam() {
    const paramUser = {
      name: data?.name,
      phoneNumber: data?.phoneNumber,
      email: data?.email,
      role: 'user',
      grade: data?.grade,
    }
    await createUser(paramUser).then(
      res => {
        if (res?.data?.id) {
          const paramExam = {
            studentId: res?.data?.id,
            subjects: data?.subject?.map(item => ({ id: item })),
            description: data?.note
          }
          createExam(paramExam).then(
            res => {
              if (res?.data?.id) {
                message.success("Đăng ký thi thử thành công!")
                setData({})
                formRegis.resetFields()
              } else message.error("Đăng ký thi thử thất bại!")
            }
          ).catch(err => message.error("Đăng ký thi thử thất bại!" + err))
        }
      }
    ).catch(err => message.error("Tạo học sinh thất bại!" + err))
  }

  async function handleSelectGrade(value) {
    getListSubject({ grade: value, page: 1, size: 999 }).then(
      res => {
        setListSubject(res?.data?.result);
      }
    ).catch(err => message.error("Lấy dữ liệu môn thất bại!"))
  }
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
              name="name"
              rules={[
                { required: true, message: "Đây là trường thông tin bắt buộc!" }
              ]}
            >
              <Input placeholder="Tên HS" disabled={data?.name} />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              rules={[
                { required: true, message: "Đây là trường thông tin bắt buộc!" },
                () => ({
                  validator(rule, value) {
                    if (!value || validatePhone(value)) {
                      return Promise.resolve()
                    }
                    return Promise.reject("Số điện thoại không đúng định dạng!")
                  },
                }),
              ]}
            >
              <Input placeholder="SĐT" disabled={data?.name} />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Đây là trường thông tin bắt buộc!" },
                { type: 'email', message: 'Không đúng định dạng!' }
              ]}
            >
              <Input placeholder="Nhập email" disabled={data?.name} />
            </Form.Item>
            <Form.Item
              name="grade"
              rules={[
                { required: true, message: "Đây là trường thông tin bắt buộc!" }
              ]}>
              <Select
                placeholder="-- Chọn khối --"
                disabled={data?.name}
                options={GRADE}
                onSelect={handleSelectGrade}
              />
            </Form.Item>
            <Form.Item
              name="subject"
              rules={[
                { required: true, message: "Đây là trường thông tin bắt buộc!" }
              ]}>
              <Select
                placeholder="-- Chọn môn --"
                mode="multiple"
                disabled={data?.name}
              >
                {
                  listSubject?.map(item => (<>
                    <Select.Option value={item?.id} key={item?.id}>{item?.name}</Select.Option>
                  </>))
                }
              </Select>
            </Form.Item>
            <Form.Item name="note">
              <Input placeholder="Ghi chú" disabled={data?.name} />
            </Form.Item>
            <Row justify="center">
              <Col>
                <Button type="primary" htmlType="submit" disabled={data?.name}>Xác nhận</Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col xs={24} lg={16} className="border-[1px] !p-0">
          <p className="mb-4 bg-[#4777d6] text-white p-2 w-full">Thông tin đăng ký thi thử</p>
          <Row gutter={[16, 16]} className="px-14 my-5">
            <Col xs={12} className="border-[1px] border-r-0">
              <div className="flex">
                <div className="w-1/4 py-2 font-semibold border-r-[1px]">Họ và tên</div>
                <div className="w-3/4 p-2">{data?.name}</div>
              </div>
            </Col>
            <Col xs={12} className="border-[1px]">
              <div className="flex">
                <div className="w-1/4 py-2  font-semibold border-r-[1px]">SĐT</div>
                <div className="w-2/4 p-2 ">{data?.phoneNumber}</div>
              </div>
            </Col>
            <Col xs={12} className="border-[1px] border-r-0">
              <div className="flex ">
                <div className="w-1/4 py-2  font-semibold border-r-[1px]">Email</div>
                <div className="w-2/4 p-2 ">{data?.email}</div>
              </div>
            </Col>
            <Col xs={12} className="border-[1px]">
              <div className="flex ">
                <div className="w-1/4 py-2  font-semibold border-r-[1px]">Lớp</div>
                <div className="w-2/4 p-2 ">{data?.grade}</div>
              </div>
            </Col>
            <Table
              size="middle"
              style={{
                width: '100%'
              }}
              dataSource={data?.subject?.length > 0 && data?.subject?.map((x, i) => ({ key: i, subject: x, note: data?.note }))}
              columns={columns}
              bordered
              pagination={{
                locale: { items_per_page: "/ trang" },
                total: data?.subject?.length,
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
                <Button onClick={cancelRegis} disabled={!data?.name}>Hủy bỏ</Button>
              </Col>
              <Col>
                <Button type="primary" disabled={!data?.name} onClick={regisExam}>Xác nhận</Button>
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