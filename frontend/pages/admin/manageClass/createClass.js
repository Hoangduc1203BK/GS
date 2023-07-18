"use client";

import { getListClassRoom, getListSubject, getListUser, createClass } from "@/api/address";
import { disabledDate } from "@/common/util";
import LayoutAdmin from "@/components/LayoutAdmin";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Divider, Empty, Form, Input, InputNumber, Row, Select, Space, Table, TimePicker, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const CreateClass = () => {
  const [form] = Form.useForm()
  const [listSubject, setListSubject] = useState([]);
  const [listTeacher, setListTeacher] = useState([]);
  const [listClassRoom, setListClassRoom] = useState([]);
  const [dataAdd, setDataAdd] = useState({});
  const [submitPreview, setSubmitPreview] = useState(false);
  const [disableDate, setDisableDate] = useState(false);

  const columns = [
    {
      title: "STT",
      render: (text, record, index) => {
        return <div>{index + 1}</div>;
      },
      align: "center",
      witdh: 40
    },
    {
      title: "Thứ",
      render: (text, record) => {
        return <div>Thứ {+record?.date > 0 ? +record?.date + 1 : 8}</div>;
      },
      align: "center",
    },
    {
      title: "Phòng học",
      render: (text, record) => {
        return <div>{listClassRoom?.find(item => item.id === record?.roomId)?.name || ""}</div>;
      },
      align: "center",
    },
    {
      title: "Thời gian buổi học",
      render: (text, record) => {
        return <div>{`${record?.start} : ${record?.end}`}</div>;
      },
      align: "center",
    },
  ]

  function addTimeClass(values) {
    values.start = `${dayjs(values.start).hour().toString().padStart(2, '0')}:${dayjs(values.start).minute().toString().padStart(2, '0')}`
    values.end = `${dayjs(values.end).hour().toString().padStart(2, '0')}:${dayjs(values.end).minute().toString().padStart(2, '0')}`

    values.startDate = dayjs(values.startDate).format('YYYY-MM-DD')
    const schedule = {
      date: values.date,
      start: values.start,
      end: values.end,
      roomId: values.roomId
    }
    if (Array.isArray(dataAdd?.schedules) && dataAdd?.schedules?.length > 0) {
      if (!dayjs(values.startDate).isSame(dayjs(dataAdd.startDate), 'day')) {
        dataAdd.schedules.splice(0, 1, schedule)
        values.schedules = dataAdd.schedules
      } else {
        values.schedules = [
          ...dataAdd.schedules,
          schedule
        ]
      }
    }
    else {
      values.schedules = [schedule]
    }
    delete values.date
    delete values.start
    delete values.end
    delete values.roomId
    console.log(values, 'valuesss');
    setDataAdd(values)
    message.success("Tạo thành công! Nhấn hoàn thành để lưu thông tin lớp!")
    form.resetFields(["date", "start", "end", "roomId"])
    setDisableDate(false)
  }

  function handleChangeDayStart(date, dateString) {
    const dayOfWeek = date.day()
    form.setFieldsValue({
      date: dayOfWeek > 0 ? dayOfWeek + "" : "7"
    })
    setDisableDate(true)
  }

  async function createClassFinal() {
    console.log(dataAdd, 'dataaa');
    createClass(dataAdd).then(
      res => {
        console.log(res?.data);
        if (res?.data?.id) {
          message.success(`Tạo thành công lớp ${dataAdd?.name}!`)
          setDataAdd({})
          setDisableDate(false)
          form.resetFields()
        } else {
          message.error('Tạo lớp thất bại!')
        }
      }
    ).catch(err => message.error("Có lỗi xảy ra!" + err))
  }

  useEffect(() => {
    getListSubject({ page: 1, size: 999 }).then(
      res => {
        setListSubject(res?.data?.result);
      }
    ).catch(err => message.error("Lấy dữ liệu môn thất bại!"))
    getListUser({ role: 'teacher', page: 1, size: 999 }).then(
      res => {
        setListTeacher(res?.data?.result);
      }
    ).catch(err => message.error("Lấy dữ liệu thất bại!"))
    getListClassRoom().then(
      res => {
        setListClassRoom(res?.data)
      }
    ).catch(err => message.error("Lấy dữ liệu thất bại!"))
  }, []);
  return (
    <>
      <div className="border-2 h-full">
        <p className="!bg-blue-700 p-2 text-white font-medium">
          Thêm mới lớp học
        </p>
        <Row className="px-4 pt-4">
          <Col xs={12} className="px-2">
            <div className="border-2 py-2 px-4 font-semibold">
              Thông tin lớp học
            </div>
          </Col>
          <Col xs={12} className="px-2">
            <p className="border-2 py-2 px-4 font-semibold">
              Lớp học mới
            </p>
          </Col>
        </Row>
        <Row className="px-4 pb-4">
          <Col xs={12} className="px-2">
            <div className="border-2 border-t-0 py-2 px-4">
              <Form
                name="validateOnly"
                form={form}
                layout="vertical"
                onFinish={addTimeClass}
                autoComplete="off"
              >
                <Form.Item
                  label="Môn"
                  name="subjectId"
                  rules={[
                    { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
                  ]}
                >
                  <Select placeholder="-- Chọn --">
                    {
                      listSubject?.map(item => (<>
                        <Select.Option value={item?.id} key={item?.id}>{item?.name}</Select.Option>
                      </>))
                    }
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Lớp"
                  name="name"
                  rules={[
                    { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
                  ]}
                >
                  <Input placeholder="Nhập tên lớp" />
                </Form.Item>
                <Form.Item
                  label="Giáo viên dạy"
                  name="teacher"
                >
                  <Select placeholder="-- Chọn --">
                    {
                      listTeacher?.map(user => (<>
                        <Select.Option value={user.id} key={user.id}>{user.name}</Select.Option>
                      </>))
                    }
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Sỹ số"
                  name="numberStudent"
                  rules={[
                    { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
                  ]}
                >
                  <InputNumber min={1} style={{
                    width: '100%'
                  }} />
                </Form.Item>
                <Form.Item
                  label="Học phí / buổi"
                  name="fee"
                  rules={[
                    { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
                  ]}
                >
                  <InputNumber
                    placeholder="-- Nhập --"
                    min={1}
                    style={{
                      width: '100%'
                    }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={value => value.replace(/\$\s?|(,*)/g, "")}
                    addonAfter="VNĐ" />
                </Form.Item>
                <Form.Item
                  label="Chiết khấu"
                  name="teacherRate"
                  rules={[
                    { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
                  ]}
                >
                  <InputNumber
                    placeholder="-- Nhập --"
                    min={0}
                    style={{
                      width: '100%'
                    }}
                    addonAfter="%" />
                </Form.Item>
                <Form.Item
                  label="Ngày bắt đầu học"
                  name="startDate"
                  rules={[
                    { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
                  ]}
                >
                  <DatePicker placeholder="-- Chọn --"
                    style={{
                      width: '100%'
                    }}
                    format="DD-MM-YYYY"
                    disabledDate={disabledDate}
                    onChange={handleChangeDayStart}
                  />
                </Form.Item>
                <Form.Item name="date" label="Thứ"
                  rules={[
                    { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
                  ]}
                >
                  <Select
                    placeholder="-- Chọn --"
                    disabled={disableDate}
                  >
                    <Select.Option value="1">Thứ 2</Select.Option>
                    <Select.Option value="2">Thứ 3</Select.Option>
                    <Select.Option value="3">Thứ 4</Select.Option>
                    <Select.Option value="4">Thứ 5</Select.Option>
                    <Select.Option value="5">Thứ 6</Select.Option>
                    <Select.Option value="6">Thứ 7</Select.Option>
                    <Select.Option value="7">Chủ nhật</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Phòng học"
                  name="roomId"
                  rules={[
                    { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
                  ]}
                >
                  <Select placeholder="-- Chọn --">
                    {
                      listClassRoom?.map(item => (
                        <Select.Option value={item.id} key={item.id} >{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Thời gian bắt đầu buổi học"
                  name="start"
                  rules={[
                    { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
                  ]}
                >
                  <TimePicker
                    format="HH:mm"
                    placeholder="--:--"
                    style={{
                      width: '100%'
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Thời gian kết thúc buổi học"
                  name="end"
                  rules={[
                    { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
                  ]}
                >
                  <TimePicker
                    format="HH:mm"
                    placeholder="--:--"
                    style={{
                      width: '100%'
                    }}
                  />
                </Form.Item>
                <Row gutter={[8, 8]} justify="center">

                  <Col>
                    <Button className="!w-[110px]" type="primary"
                      style={{
                        backgroundColor: '#70B603'
                      }}
                      htmlType="submit"
                    >Tạo</Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
          <Col xs={12} className="px-2">
            <div className="border-2 border-t-0 py-2 px-4 h-full">
              <Row className="border-2">
                <Col xs={6} className="text-right bg-[#d7d7d7] py-2 px-4 border-r-2">
                  <p className="font-semibold">Lớp</p>
                </Col>
                <Col xs={18} className="px-4 flex items-center">
                  <p>{dataAdd?.name}</p>
                </Col>
              </Row>
              <Row className="border-2 border-t-0">
                <Col xs={6} className="text-right bg-[#d7d7d7] py-2 px-4 border-r-2">
                  <p className="font-semibold">Môn</p>
                </Col>
                <Col xs={18} className="px-4 flex items-center">
                  <p>
                    {
                      listSubject?.find(item => item.id === dataAdd.subjectId)?.name
                    }
                  </p>
                </Col>
              </Row>
              <Row className="border-2 border-t-0">
                <Col xs={6} className="text-right bg-[#d7d7d7] py-2 px-4 border-r-2">
                  <p className="font-semibold">Giáo viên dạy</p>
                </Col>
                <Col xs={18} className="px-4 flex items-center">
                  <p>
                    {
                      listTeacher?.find(item => item.id === dataAdd.teacher)?.name
                    }
                  </p>
                </Col>
              </Row>
              <Row className="border-2 border-t-0">
                <Col xs={6} className="text-right bg-[#d7d7d7] py-2 px-4 border-r-2">
                  <p className="font-semibold">Sỹ số</p>
                </Col>
                <Col xs={18} className="px-4 flex items-center">
                  <p>{dataAdd?.numberStudent}</p>
                </Col>
              </Row>
              <Row className="border-2 border-t-0">
                <Col xs={6} className="text-right bg-[#d7d7d7] py-2 px-4 border-r-2">
                  <p className="font-semibold">Học phí</p>
                </Col>
                <Col xs={18} className="px-4 flex items-center">
                  <p>{dataAdd?.fee}</p>
                </Col>
              </Row>
              <Row className="border-2 border-t-0">
                <Col xs={6} className="text-right bg-[#d7d7d7] py-2 px-4 border-r-2">
                  <p className="font-semibold">Ngày học</p>
                </Col>
                <Col xs={18} className="px-4 flex items-center">
                  <p>{dataAdd?.startDate}</p>
                </Col>
              </Row>
              <Table
                locale={{
                  emptyText: <div style={{ marginTop: '20px' }}>{dataAdd?.schedules?.length === 0 ? <Empty description="Không có dữ liệu!" /> : null}</div>,
                }}
                size="middle"
                style={{
                  margin: '20px 0px',
                  width: '100%'
                }}
                dataSource={dataAdd?.schedules && dataAdd?.schedules?.map((item, index) => ({ ...item, key: index }))}
                columns={columns}
                bordered
                pagination={{
                  hideOnSinglePage: true,
                  locale: { items_per_page: "/ trang" },
                  total: dataAdd?.schedules?.length,
                  showTotal: (total, range) => (
                    <span>{`${range[0]} - ${range[1]} / ${total}`}</span>
                  ),
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50"],
                  defaultPageSize: 10,
                  position: ["bottomRight"],
                }}
              />
              <div className="text-right">
                <Button type="primary" onClick={createClassFinal}>Hoàn thành</Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}


CreateClass.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default CreateClass