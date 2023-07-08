"use client";

import { createExam, createTestLearning, createUser, getListExam, getListSubject } from "@/api/address";
import { GRADE } from "@/common/const";
import { disabledDate } from "@/common/util";
import LayoutAdmin from "@/components/LayoutAdmin";
import { Button, Col, DatePicker, Form, Input, Row, Select, Table, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const { Option } = Select

const RegisTestLearning = () => {

  const [formRegis] = Form.useForm()

  const [data, setData] = useState({});
  const [listSubject, setListSubject] = useState([]);
  const [listStudent, setListStudent] = useState([]);
  const [recall, setRecall] = useState(false);

  const columns = [
    {
      title: "Môn",
      render: (text, record, index) => {
        return <div>{listSubject?.find(i => i.subjectId === record?.subjectId)?.name}</div>;
      },
      align: "center",
    },
    {
      title: "Ngày mong muốn",
      render: (text, record) => {
        return <div>{record?.desiredDate}</div>;
      },
      align: "center",
    },
    {
      title: "Ghi chú",
      render: (text, record) => {
        return <div >{record?.description}</div>;
      },
      align: "center",
    },
  ]

  async function regisLearning() {
    const param = {
      studentId: data?.studentId,
      subjects: data.subjects
    }
    console.log(param, 'paramss');
    await createTestLearning(param).then(
      res => {
        if (res?.data) {
          message.success("Đăng ký học thử thành công!")
          formRegis.resetFields()
          setData({})
          setRecall(!recall)
        } else message.error("Đăng ký học thử thất bại!")
      }
    ).catch(err => message.error("Có lỗi xảy ra!" + err))
  }

  const submitRegis = (values) => {
    const dataSubject = {
      subjectId: values?.subjectId,
      desiredDate: dayjs(values.desiredDate).format("YYYY-MM-DD"),
      description: values.description
    }
    if (Array.isArray(data?.subjects) && data?.subjects?.length > 0) {
      values.subjects = [
        ...data.subjects,
        dataSubject
      ]

    } else {
      values.subjects = [
        dataSubject
      ]

    }
    delete values.subjectId
    delete values.desiredDate
    delete values.description
    setData(values)
    formRegis.resetFields(["subjectId", "desiredDate", "description"])
  }

  const cancelRegis = () => {
    formRegis.resetFields()
    setData({})
  }

  function handleSelectStudent(values) {
    const student = listStudent?.find(item => item.studentId === values)
    if (student) {
      formRegis.setFieldsValue({
        phoneNumber: student?.phoneNumber,
        grade: student.grade
      })
      setListSubject(student.subjects)
    }
  }

  useEffect(() => {
    getListExam({ page: 1, size: 999, result: "pass_exam" }).then(
      res => {
        setListStudent(res?.data?.result);
      }
    ).catch(err => console.log(err, 'errr get list student!'))
  }, [recall]);
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8} className="border-[1px] !p-0">
          <p className="mb-0 bg-[#4777d6] text-white p-2 w-full">Đăng ký học thử</p>
          <Form
            form={formRegis}
            className="mx-2 my-5"
            onFinish={submitRegis}
          >
            <Form.Item
              name="studentId"
              rules={[
                { required: true, message: "Đây là trường thông tin bắt buộc!" },
              ]}
            >
              <Select
                placeholder="-- Chọn HS --"

                onSelect={handleSelectStudent}
              >
                {
                  listStudent?.map(item => (
                    <Select.Option value={item.studentId} key={item.studentId}>{item?.studentName}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              rules={[
                { required: true, message: "Đây là trường thông tin bắt buộc!" }
              ]}
            >
              <Input placeholder="SĐT" />
            </Form.Item>
            <Form.Item
              name="grade"
              rules={[
                { required: true, message: "Đây là trường thông tin bắt buộc!" }
              ]}>
              <Select
                placeholder="-- Chọn khối --"
                disabled
                options={GRADE}
              />
            </Form.Item>
            <Form.Item
              name="subjectId"
              rules={[
                { required: true, message: "Đây là trường thông tin bắt buộc!" }
              ]}>
              <Select
                placeholder="-- Chọn môn --"
              >
                {
                  listSubject?.filter(item => !data?.subjects?.map(el => el.subjectId)?.includes(item?.subjectId))?.map(item => (<>
                    <Select.Option value={item?.subjectId} key={item?.subjectId}>{item?.name}</Select.Option>
                  </>))
                }
              </Select>
            </Form.Item>
            <Form.Item name="desiredDate"
              rules={[
                { required: true, message: "Đây là trường thông tin bắt buộc!" }
              ]}
            >
              <DatePicker disabledDate={disabledDate} format="DD-MM-YYYY" placeholder="Chọn ngày mong muốn" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="description">
              <Input placeholder="Ghi chú" />
            </Form.Item>
            <Row justify="center">
              <Col>
                <Button type="primary" htmlType="submit" >Xác nhận</Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col xs={24} lg={16} className="border-[1px] !p-0">
          <p className="mb-4 bg-[#4777d6] text-white p-2 w-full">Thông tin đăng ký học thử</p>
          <Row gutter={[16, 16]} className="px-14 my-5">
            <Col xs={12} className="border-[1px] border-r-0">
              <div className="flex">
                <div className="w-1/4 py-2 font-semibold border-r-[1px]">Mã</div>
                <div className="w-3/4 p-2">{data?.studentId}</div>
              </div>
            </Col>
            <Col xs={12} className="border-[1px]">
              <div className="flex">
                <div className="w-1/4 py-2  font-semibold border-r-[1px]">SĐT</div>
                <div className="w-2/4 p-2 ">{data?.phoneNumber}</div>
              </div>
            </Col>
            <Col xs={12} className="border-[1px] border-r-0">
              <div className="flex">
                <div className="w-1/4 py-2 font-semibold border-r-[1px]">Họ và tên</div>
                <div className="w-3/4 p-2">{listStudent?.find(item => item.studentId === data?.studentId)?.studentName}</div>
              </div>
            </Col>
            <Col xs={12} className="border-[1px]">
              <div className="flex ">
                <div className="w-1/4 py-2  font-semibold border-r-[1px]">Khối</div>
                <div className="w-2/4 p-2 ">{data?.grade}</div>
              </div>
            </Col>
            <Table
              size="middle"
              style={{
                width: '100%'
              }}
              dataSource={data?.subjects?.map(item => ({ ...item, key: item.subjectId }))}
              columns={columns}
              bordered
              pagination={{
                locale: { items_per_page: "/ trang" },
                total: data?.subjects?.length,
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
                <Button onClick={cancelRegis} disabled={!data?.studentId}>Hủy bỏ</Button>
              </Col>
              <Col>
                <Button type="primary" disabled={!data?.studentId} onClick={regisLearning}>Xác nhận</Button>
              </Col>
            </Row>
          </Row>
        </Col>
      </Row>
    </>
  )
}

RegisTestLearning.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default RegisTestLearning 