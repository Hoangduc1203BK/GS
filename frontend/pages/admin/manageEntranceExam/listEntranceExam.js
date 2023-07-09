"use client";

import { getListClassRoom, getListExam, getListUser, updateExam } from "@/api/address";
import { disabledDate } from "@/common/util";
import LayoutAdmin from "@/components/LayoutAdmin";
import { CalendarOutlined, DeleteOutlined, EditOutlined, SnippetsOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Space, Table, TimePicker, Tooltip, message } from "antd";
import { Tabs } from 'antd';
import dayjs from "dayjs";
import { useEffect, useState } from "react";
const ListEntranceExam = () => {
  const [formSearch] = Form.useForm()
  const [form] = Form.useForm()
  const [listRoom, setListRoom] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [recall, setRecall] = useState(false);
  const [listExam, setListExam] = useState([]);
  const [record, setRecord] = useState([]);
  const [modal, setModal] = useState({
    open: false,
    mode: 1 // mode: 1 - add / 2 - edit 
  });
  const [tableParams, setTableParams] = useState({
    page: 1,
    size: 10
  });

  const [idSelect, setIdSelect] = useState("");

  const columns = [
    {
      title: "Mã HS",
      render: (text, record) => {
        return <div>{record?.studentId}</div>;
      },
      align: "center",
    },
    {
      title: "Họ và tên",
      render: (text, record) => {
        return <div>{record?.studentName}</div>;
      },
      align: "center",
    },
    {
      title: "SĐT",
      render: (text, record) => {
        return <div>{record?.phoneNumber}</div>;
      },
      align: "center",
    },
    {
      title: "Lớp",
      render: (text, record) => {
        return <div>{record?.grade}</div>;
      },
      align: "center",
    },
    {
      title: "Môn",
      render: (text, record) => {
        return <div>{record?.subjects?.map(i => i.name)?.join(', ')}</div>;
      },
      align: "center",
    },
    {
      title: "Thời gian thi",
      render: (text, record) => {
        return <div >{record?.hour}</div>;
      },
      align: "center",
    },
    {
      title: "Ngày thi",
      render: (text, record) => {
        return <div >{record?.date}</div>;
      },
      align: "center",
    },
    {
      title: "Phòng",
      render: (text, record) => {
        return <div >{record?.room}</div>;
      },
      align: "center",
    },
    {
      title: "Giáo viên",
      render: (text, record) => {
        return <div >{record?.teacherName}</div>;
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
    {
      title: "Thao tác",
      render: (text, record) => {
        return <div >
          <Space size="small">
            {/* <Tooltip title="Chỉnh sửa">
              <EditOutlined style={{
                color: "#b9db84"
              }} className="text-base cursor-pointer" />
            </Tooltip> */}
            <DeleteOutlined style={{
              color: "#fc4a6c"
            }} className="text-base cursor-pointer" />
          </Space>
        </div>;
      },
      align: "center",
    },
  ]
  function openModal() {
    let option = {
      open: true,
      mode: 1
    }
    const selectedItem = listExam?.find(i => i.id === idSelect[0])
    if (selectedItem?.hour && selectedItem?.date && selectedItem?.roomId && selectedItem?.teacherId) {
      option.mode = 2
      form.setFieldsValue({
        hour: dayjs(selectedItem?.hour, 'HH:mm'),
        date: dayjs(selectedItem?.date),
        roomId: selectedItem?.roomId,
        teacherId: selectedItem?.teacherId
      })
    }
    setModal(option)
  }


  async function handleFinish(values) {
    values.hour = `${dayjs(values.hour).hour().toString().padStart(2, '0')}:${dayjs(values.hour).minute().toString().padStart(2, '0')}`
    values.date = dayjs(values.date).format("YYYY-MM-DD")
    console.log(values, 'valuess');
    updateExam(idSelect[0], values).then(
      res => {
        if (res?.data?.id) {
          message.success("Xếp lịch thi thành công!")
          setRecall(!recall)
          setModal({
            open: false,
            mode: 1
          })
          form.resetFields()
        } else message.error("Xếp lịch thi thất bại!")
      }
    ).catch(err => message.error("Thất bại! " + err))
  }


  useEffect(() => {
    getListClassRoom().then(
      res => {
        setListRoom(res?.data)
      }
    ).catch(err => message.error("Lấy dữ liệu thất bại!"))

    getListUser({ role: 'teacher', page: 1, size: 999 }).then(
      res => {
        setListUser(res?.data?.result);
      }
    ).catch(err => message.error("Lấy dữ liệu thất bại!"))
  }, []);

  useEffect(() => {
    getListExam(tableParams).then(
      res => {
        setListExam(res?.data?.result)
      }
    ).catch(err => message.error("Lấy dữ liệu thất bại!"))
  }, [recall]);

  return (
    <>
      <Modal
        open={modal.open}
        title="Xếp lịch thi"
        onCancel={() => {
          setModal({
            open: false,
            mode: 1
          })
          form.resetFields()
        }}
        footer={null}
      >
        <Form
          form={form}
          labelAlign="left"
          labelCol={{ span: 6 }}
          onFinish={handleFinish}
        >
          <Form.Item name="hour" label="Thời gian" rules={[{ required: true, message: "Đây là trường dữ liệu bắt buộc!" }]}>
            <TimePicker placeholder="--:--" format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="date" label="Ngày" rules={[{ required: true, message: "Đây là trường dữ liệu bắt buộc!" }]}>
            <DatePicker disabledDate={disabledDate} format="DD-MM-YYYY" placeholder="Chọn ngày" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="roomId" label="Phòng" rules={[{ required: true, message: "Đây là trường dữ liệu bắt buộc!" }]}>
            <Select
              placeholder="-- Chọn --"
            >
              {
                listRoom?.map(room => (<>
                  <Select.Option value={room.id} key={room.id}>{room.name}</Select.Option>
                </>))
              }
            </Select>
          </Form.Item>
          <Form.Item name="teacherId" label="Giáo viên" rules={[{ required: true, message: "Đây là trường dữ liệu bắt buộc!" }]}>
            <Select
              placeholder="-- Chọn --"
            >
              {
                listUser?.map(user => (<>
                  <Select.Option value={user.id} key={user.id}>{user.name}</Select.Option>
                </>))
              }
            </Select>
          </Form.Item>
          <Row gutter={[8, 8]} justify="center">
            <Col>
              <Button onClick={() => {
                setModal({
                  open: false,
                  mode: 1
                })
                form.resetFields()
              }}>Đóng</Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">Xác nhận</Button>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Tabs
        defaultActiveKey="1"
        centered
        items={[
          {
            label: (
              <span>
                <SnippetsOutlined />
                Xếp lịch thi
              </span>
            ),
            key: '1',
            children:
              <>
                <p className="font-semibold mb-2">Danh sách thi thử</p>
                <Form
                  form={formSearch}
                >
                  <Row gutter={[8, 8]}>
                    <Col xs={12} lg={8}>
                      <Form.Item name="q">
                        <Input placeholder="Tìm kiếm..." />
                      </Form.Item>
                    </Col>
                    <Col xs={12} lg={8}>
                      <Row gutter={[8, 8]}>
                        <Col>
                          <Button>Đặt lại</Button>
                        </Col>
                        <Col>
                          <Button type="primary">Tìm kiếm</Button>
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={24} lg={8}>
                      <Row gutter={[8, 8]} justify="end">
                        <Col>
                          <Button
                            type="primary"
                            onClick={openModal}
                            disabled={idSelect.length !== 1 || record[0]?.date}
                          >Xếp lịch thi</Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>
                <Table
                  // locale={{
                  //                     emptyText: <div style={{ marginTop: '20px' }}>{loading ? null : listResult.length === 0 ? "Sinh viên chưa đăng ký HP nào trong kỳ này!" : null}</div>,
                  //                 }}
                  rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: idSelect,
                    onChange: (selectedRowKeys, selectedRows) => {
                      setIdSelect(selectedRowKeys)
                      setRecord(selectedRows)
                    }
                  }}
                  size="middle"
                  style={{
                    width: '100%'
                  }}
                  dataSource={listExam?.map(i => ({ ...i, key: i?.id }))}
                  columns={columns}
                  bordered
                  scroll={{ x: 1000 }}
                  pagination={{
                    locale: { items_per_page: "/ trang" },
                    total: listExam?.length,
                    showTotal: (total, range) => (
                      <span>{`${range[0]} - ${range[1]} / ${total}`}</span>
                    ),
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    defaultPageSize: 10,
                    position: ["bottomRight"],
                  }}
                />
              </>,
          }
        ]}
      />

    </>
  )
}

ListEntranceExam.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default ListEntranceExam 