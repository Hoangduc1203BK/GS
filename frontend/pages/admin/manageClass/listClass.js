
import { getAttendance, getListAttendance, getListClass, getListClassRoom, getListSubject, getListUser, getListUserInClass, updateInfoClass } from "@/api/address";
import { ApiGetFeedbacks } from "@/api/student";
import { COLORS } from "@/common/const";
import LayoutAdmin from "@/components/LayoutAdmin";
import { CheckCircleFilled, ClockCircleOutlined, CloseCircleFilled, CloseCircleOutlined, CommentOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined, EyeOutlined, HistoryOutlined, MessageOutlined, PlusCircleOutlined, ProfileOutlined, RetweetOutlined, SnippetsOutlined, TeamOutlined, WindowsOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Col, Empty, Form, Input, InputNumber, List, Modal, Row, Select, Space, Table, Tabs, TimePicker, Tooltip, Tour, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

const ListClass = () => {
  const [formUpdate] = Form.useForm()

  const [modalUpdateClass, setModalUpdateClass] = useState({
    open: false,
    record: null
  });

  const [teachersAccepted, setTeachersAccepted] = useState([]);

  function updateClass(record) {
    const teacher = listTeacher?.find(el => el.id === record.teacher)
    getListUser({ role: 'teacher', page: 1, size: 999, departmentId: teacher?.departmentId }).then(
      res => {
        setTeachersAccepted(res?.data?.result);
      }
    ).catch(err => message.error("Lấy dữ liệu thất bại!"))
    const newR = JSON.parse(JSON.stringify(record))
    formUpdate.setFieldsValue({
      name: newR?.name,
      teacher: newR?.teacher,
      numberStudent: newR?.number_student,
      fee: newR?.fee
    })
    newR.time_tables = newR?.time_tables?.map(el => ({ ...el, key: el.id }))
    setModalUpdateClass({
      open: true,
      record: newR
    })
  }

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
      title: "Tên lớp",
      render: (text, record) => {
        return <div>{record?.name}</div>;
      },
      align: "center",
    },
    {
      title: "Giáo viên",
      render: (text, record) => {
        return <div>{listTeacher?.find(i => i?.id === record?.teacher)?.name || "Chưa có"}</div>;
      },
      align: "center",
    },
    {
      title: "Môn",
      render: (text, record) => {
        return <div>{record?.subject}</div>;
      },
      align: "center",
    },
    {
      title: "Khối",
      render: (text, record) => {
        return <div><Badge key={COLORS[record?.grade]} color={COLORS[record?.grade]} text={`Khối ${record?.grade || "..."} `} /></div>;
      },
      align: "center",
    },
    {
      title: "Lịch học",
      render: (text, record) => {
        return <div className="text-left">{record?.time_tables?.map(item => (`Thứ ${+item?.date + 1} ( ${item?.start} : ${item?.end} ) - ${item?.room_name}`))?.join(", ")}</div>;
      },
      align: "center",
    },
    {
      title: "Sỹ số",
      render: (text, record) => {
        return <div>{record?.number}</div>;
      },
      align: "center",
    },
    {
      title: "Thao tác",
      render: (text, record) => {
        return <div >
          <Space size="small">
            <Tooltip title="Cập nhật thông tin lớp">
              <RetweetOutlined
                onClick={() => updateClass(record)}
                style={{
                  color: "orange"
                }} className="text-base cursor-pointer"
              />
            </Tooltip>
            <Tooltip title="Lịch sử điểm danh">
              <SnippetsOutlined
                onClick={() => watchHistory(record)}
                style={{
                  color: "#fc4a6c"
                }} className="text-base cursor-pointer" />
            </Tooltip>
            <Tooltip title="Góp ý">
              <MessageOutlined
                onClick={() => getFeedbacks(record)}
                style={{
                  color: "#b9db84"
                }}
                className="text-base cursor-pointer" />
            </Tooltip>
          </Space>
        </div>;
      },
      align: "center",
    },
  ]

  const columnHistory = [
    {
      title: "STT",
      render: (text, record, index) => {
        return <div>{index + 1}</div>;
      },
      align: "center",
      witdh: 40
    },
    {
      title: "Thời gian điểm danh",
      render: (text, record) => {
        return <div> {record?.date < 7 ? `Thứ ${+record?.date + 1}` : 'Chủ Nhật'} : {dayjs(record?.day).format("DD-MM-YYYY")} </div>;
      },
      align: "center",
    },
    {
      title: "Giáo viên",
      render: (text, record) => {
        return <div>{record?.teacher}</div>;
      },
      align: "center",
    },
    {
      title: "Số lượng điểm danh",
      render: (text, record) => {
        return <div>{record?.attend}</div>;
      },
      align: "center",
    },
    {
      title: "Thao tác",
      render: (text, record) => {
        return <div><Button icon={<TeamOutlined />} type="primary" style={{ backgroundColor: 'aqua', color: 'black', fontWeight: '500' }} onClick={() => detailAttendance(record)} className="hover:-translate-y-0.5 duration-300 hover:scale-105">Chi tiết</Button></div>;
      },
      align: "center",
    },
  ]

  const [listClass, setListClass] = useState([]);
  const [recall, setRecall] = useState(false);
  const [expandedKey, setExpandedKey] = useState([]);
  const [dataStudent, setDataStudent] = useState([]);
  const [dataAttendance, setDataAttendance] = useState({});
  const [activeTab, setActiveTab] = useState("1");
  const [listSubject, setListSubject] = useState([]);
  const [listTeacher, setListTeacher] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingExpand, setLoadingExpand] = useState(false);
  const [detailAttend, setDetailAttend] = useState([]);
  const [modal, setModal] = useState(false);

  //table student

  const expandedRowRender = () => {
    const columnsStudent = [
      {
        title: 'STT',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: 'Mã HS',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Họ và tên',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Ngày sinh',
        key: 'birthDay',
        dataIndex: 'birthDay',
        // render: () => <Badge status="success" text="Finished" />,
      },
      {
        title: 'Giới tính',
        dataIndex: 'gender',
        key: 'gender',
      },
      {
        title: 'SĐT',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
      },
      // {
      //   title: 'Nhận xét',
      //   dataIndex: 'comment',
      //   key: 'comment',
      // },
      // {
      //   title: 'Thao tác',
      //   dataIndex: 'action',
      //   key: 'action',
      //   render: () => (
      //     <Space size="middle">
      //       <a>Pause</a>
      //       <a>Stop</a>
      //     </Space>
      //   ),
      // },
    ];
    return <Table columns={columnsStudent} dataSource={dataStudent} pagination={false}
      locale={{
        emptyText: <div style={{ marginTop: '20px' }}>{dataStudent?.length === 0 ? <Empty description="Không có học sinh nào!" /> : null}</div>,
      }}
      loading={loadingExpand}
    />;
  };

  async function detailAttendance(record) {
    await getAttendance({ classId: record?.class_id, date: record?.date, day: record?.day }).then(
      res => {
        setDetailAttend(res?.data?.students)
        setModal(true)
      }
    ).catch(err => message.error('Lấy dữ liệu chi tiết điểm danh không thành công!'))
  }

  function handleChangeTab(key) {
    if (key === "2") {
      message.error("Vui lòng chọn lớp!")
    }
    setActiveTab("1")
  }

  async function expandTable(expanded, record) {
    setLoadingExpand(true)
    if (!expanded) {
      setExpandedKey([])
      setDataStudent([])
      setLoadingExpand(false)
    }
    else if (expanded && expandedKey != record.id) {
      setExpandedKey([record?.key])
      await getListUserInClass(record.id).then(
        res => {
          setDataStudent(res?.data?.map((i, index) => ({ ...i, key: i?.id, number: index + 1, gender: i?.gender == 'female' ? "Nữ" : "Nam" })))
          setLoadingExpand(false)
        }
      ).catch(err => message.error("Lấy dữ liệu học sinh thất bại!"))
    }
  }

  async function watchHistory(record) {
    const params = {
      classId: record?.id,
      teacher: record?.teacher
    }
    await getListAttendance(params).then(
      res => {
        if (res?.data?.length == 0) {
          message.error("Chưa có lịch sử điểm danh!")
        } else {
          setDataAttendance(
            {
              class: record,
              listAttendance: res?.data
            }
          )
          setActiveTab("2")
        }
      }
    ).catch(err => message.error('Có lỗi xảy ra! Không thế lấy lịch sử điểm danh! ' + err))
  }

  async function selectSubject(value) {
    setLoading(true)
    getListClass({ subjectId: value }).then(
      res => {
        setListClass(res?.data?.map(i => ({ ...i, key: i?.id, children: [] })));
        setLoading(false)

      }
    ).catch(err => console.log('get list class err' + err))
  }
  const [listFeedback, setListFeedback] = useState([]);
  async function getFeedbacks(record) {
    const params = {
      classId: record?.id,
      type: "student"
    }
    ApiGetFeedbacks(params).then(
      res => {
        if (res?.data?.length == 0) {
          message.error("Chưa có góp ý!")
        } else {
          setListFeedback(res?.data?.map((el, i) => ({
            ...el,
            avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`
          })))
          setActiveTab('3')
        }
      }
    ).catch(err => console.log(err, 'errr get feedback'))
  }
  const [listClassRoom, setListClassRoom] = useState([]);

  useEffect(() => {
    getListSubject({ page: 1, size: 9999 }).then(
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


  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const [open, setOpen] = useState(false);
  const steps = [
    {
      title: 'DANH SÁCH MÔN HỌC',
      description: 'Lựa chọn môn để hiển thị các lớp theo từng bộ môn!',
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
      target: () => ref1.current,
    },
    {
      title: 'DANH SÁCH LỚP',
      description: 'Sau khi lựa chọn môn, các lớp họp sẽ được thống kê ở đây.',
      target: () => ref2.current,
    },
    // {
    //   title: 'Other Actions',
    //   description: 'Click to see other actions.',
    //   target: () => ref3.current,
    // },
  ];

  useEffect(() => {
    if (listSubject?.length > 0) {
      setOpen(true)
    }
  }, [listSubject]);


  function deleteTime(item) {
    console.log(item, 'itemmm');
    const result = modalUpdateClass?.record?.time_tables?.filter(el => el?.key !== item?.key)
    modalUpdateClass.record.time_tables = result
    setModalUpdateClass({
      ...modalUpdateClass,
      record: modalUpdateClass.record
    })
  }
  function addTime() {
    const date = formUpdate.getFieldValue("date")
    const roomId = formUpdate.getFieldValue("roomId")
    const start = `${dayjs(formUpdate.getFieldValue("start")).hour().toString().padStart(2, '0')}:${dayjs(formUpdate.getFieldValue("start")).minute().toString().padStart(2, '0')}`
    const end = `${dayjs(formUpdate.getFieldValue("end")).hour().toString().padStart(2, '0')}:${dayjs(formUpdate.getFieldValue("end")).minute().toString().padStart(2, '0')}`
    if (!date || !roomId || !start || !end) {
      message.error("Vui lòng điền đầy đủ thông tin lịch học mới!")
    } else {
      const param = {
        date: date,
        roomId: roomId,
        start: start,
        end: end,
        key: Math.random(),
        room_name: listClassRoom?.find(el => el.id === roomId)?.name
      }
      modalUpdateClass?.record?.time_tables?.push(param)
      setModalUpdateClass({
        ...modalUpdateClass
      })
      formUpdate.setFieldsValue({
        date: undefined,
        roomId: undefined,
        start: undefined,
        end: undefined
      })
    }
  }

  async function handleUpdateClass(values) {
    Object.keys(values).forEach(key => (values[key] === undefined || !values[key]) && delete values[key])
    const schedules = modalUpdateClass?.record?.time_tables?.filter(el => !el.id).map(item => ({
      date: item?.date,
      roomId: item?.roomId,
      start: item?.start,
      end: item?.end
    }))
    const params = {
      ...values,
    }
    if (schedules.length > 0) {
      params.schedules = schedules
    }
    Object.keys(params).forEach(key => (params[key] === undefined || !params[key]) && delete params[key])
    await updateInfoClass(params, modalUpdateClass?.record?.id).then(res => {
      if (res?.data?.id) {
        message.success("Cập nhật thông tin lớp thành công!")
        selectSubject(res?.data?.subjectId)
        setModalUpdateClass({
          open: false,
          record: null
        })
        formUpdate.resetFields()
      } else {
        message.error("Cập nhật thông tin lớp không thành công!")
      }
    }).catch(err => {
      message.error('Có lỗi xảy ra! ' + err)
    })
  }

  return (
    <>
      <Modal
        open={modal}
        title="Chi tiết điểm danh"
        onCancel={() => {
          setModal(false)
          setDetailAttend([])
        }}
        okText="Xác nhận"
        cancelText="Đóng"
        onOk={() => {
          setModal(false)
          setDetailAttend([])
        }}
      >
        <List
          itemLayout="horizontal"
          dataSource={detailAttend}
          renderItem={(item, index) => (
            <List.Item
              key={item?.studentId}
              className="hover:scale-105 duration-500 group hover:shadow-xl !px-4"
              extra={
                item?.status ? <CheckCircleFilled style={{
                  color: 'green',
                  fontSize: '18px'
                }} />
                  : <CloseCircleFilled style={{
                    color: 'red',
                    fontSize: '18px'
                  }} />
              }
            >
              <List.Item.Meta
                avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                title={<p className="group-hover:font-bold duration-500">{item.name}</p>}
                description={<p className="group-hover:font-semibold">{item?.studentId}</p>}
              />
            </List.Item>
          )}
        />
      </Modal>
      <Modal
        width={"60%"}
        open={modalUpdateClass.open}
        title="Cập nhật thông tin lớp"
        footer={null}
        onCancel={() => {
          setModalUpdateClass({
            open: false,
            record: null
          })
        }}
      >
        <Form
          labelCol={{ span: '8' }}
          form={formUpdate}
          onFinish={handleUpdateClass}
        >
          <Form.Item label="Tên lớp" name="name" rules={[{
            required: true, message: "Đây là trường dữ liệu bắt buộc!"
          }]}>
            <Input placeholder="Nhập tên lớp" />
          </Form.Item>
          <Form.Item label="Giáo viên chủ nghiệm" name="teacher" rules={[{
            required: true, message: "Đây là trường dữ liệu bắt buộc!"
          }]}>
            <Select options={teachersAccepted?.map(el => ({
              ...el, value: el?.id, label: el.name
            }))} placeholder="Chọn giáo viên" />
          </Form.Item>
          <Form.Item label="Sỹ số" name="numberStudent" rules={[{
            required: true, message: "Đây là trường dữ liệu bắt buộc!"
          }]}>
            <InputNumber placeholder="Nhập sỹ số" style={{
              width: '100%'
            }} controls={false} />
          </Form.Item>
          <Form.Item label="Học phí" name="fee" rules={[{
            required: true, message: "Đây là trường dữ liệu bắt buộc!"
          }]}>
            <InputNumber placeholder="Nhập học phí" controls={false} min={1}
              style={{
                width: '100%'
              }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              addonAfter="VNĐ" />
          </Form.Item>
          <Form.Item name="date" label="Thứ"
          // rules={[
          //   { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
          // ]}
          >
            <Select
              placeholder="-- Chọn --"
            // disabled={disableDate}
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
          // rules={[
          //   { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
          // ]}
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
          // rules={[
          //   { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
          // ]}
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
          // rules={[
          //   { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
          // ]}
          >
            <TimePicker
              format="HH:mm"
              placeholder="--:--"
              style={{
                width: '100%'
              }}
            />
          </Form.Item>
          <div className="flex justify-end">
            <Button type="primary" icon={<PlusCircleOutlined />} onClick={addTime}>Thêm lịch học</Button>
          </div>
          {
            modalUpdateClass?.record?.time_tables?.map(el => (
              <div className="relative">
                <div className="absolute top-[-5%] right-0">
                  <CloseCircleOutlined className="cursor-pointer " onClick={() => deleteTime(el)} />
                </div>
                <div className="p-5 my-5 rounded-md text-center border-1 "
                  style={{
                    boxShadow: "5px 5px 10px 0px gray",
                  }}
                ><WindowsOutlined /> {el.room_name} - <ClockCircleOutlined /> {el.date == 7 ? "Chủ nhật" : `Thứ ${+el.date + 1}`} - {el?.start} - {el?.end}</div>
              </div>
            ))
          }
          <Row gutter={[8, 8]} justify="center">
            <Col>
              <Button type="primary" htmlType="submit">Lưu</Button>
            </Col>
            <Col>
              <Button onClick={() => {
                setModalUpdateClass({
                  open: false,
                  record: null
                })
              }}>Hủy</Button>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Tabs
        onChange={handleChangeTab}
        defaultActiveKey="1"
        activeKey={activeTab}
        centered
        items={[
          {
            label: (
              <span>
                <ProfileOutlined />
                Danh sách lớp
              </span>
            ),
            key: '1',
            children: <>
              <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
              <p className="font-medium mb-2 text-lg">Thông tin lớp học</p>
              <Row gutter={[8, 8]}>
                <Col xs={24} md={12} className="grid grid-cols-4 ">
                  <p className="flex items-center">Chọn môn:</p>
                  <div ref={ref1} className="w-full">
                    <Select
                      className="col-span-3"
                      placeholder="-- Chọn -- "
                      style={{
                        width: '100%'
                      }}
                      onSelect={selectSubject}
                    >
                      {
                        listSubject?.map(item => (<>
                          <Select.Option value={item?.id} key={item?.id}>{item?.name}</Select.Option>
                        </>))
                      }
                    </Select>
                  </div>
                </Col>
              </Row>
              <Table
                ref={ref2}
                locale={{
                  emptyText: <div style={{ marginTop: '20px' }}>{listClass?.length === 0 ? <Empty description="Chọn môn học để lọc dữ liệu lớp!" /> : null}</div>,
                }}
                loading={loading}
                size="middle"
                style={{
                  margin: '20px 0px',
                  width: '100%'
                }}
                dataSource={listClass}
                columns={columns}
                bordered
                expandable={{
                  expandedRowKeys: expandedKey,
                  expandedRowRender,
                  onExpand: expandTable,
                }}
                pagination={{
                  hideOnSinglePage: true,
                  locale: { items_per_page: "/ trang" },
                  total: listClass?.length,
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
          },
          {
            disabled: true,
            label: (
              <span>
                <HistoryOutlined />
                Lịch sử điểm danh
              </span>
            ),
            key: '2',
            children: <>
              <div className=" py-2 px-4 h-full">
                <Row gutter={[8, 8]}>
                  <Col xs={24} md={12}>
                    <Row className="border-2">
                      <Col xs={6} className="text-right bg-[#d7d7d7] py-2 px-4 border-r-2">
                        <p className="font-semibold">Lớp</p>
                      </Col>
                      <Col xs={18} className="px-4 !flex !items-center">
                        <p>{dataAttendance?.class?.name}</p>
                      </Col>
                    </Row>
                    <Row className="border-2 border-t-0">
                      <Col xs={6} className="text-right bg-[#d7d7d7] py-2 px-4 border-r-2">
                        <p className="font-semibold">GVCN</p>
                      </Col>
                      <Col xs={18} className="px-4 !flex !items-center">
                        <p>
                          {listTeacher?.find(i => i?.id === dataAttendance?.class?.teacher)?.name || "Chưa có"}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={24} md={12}>
                    <Row className="border-2">
                      <Col xs={6} className="text-right bg-[#d7d7d7] py-2 px-4 border-r-2">
                        <p className="font-semibold">Số lượng HS</p>
                      </Col>
                      <Col xs={18} className="px-4 !flex !items-center">
                        <p>{dataAttendance?.class?.number}</p>
                      </Col>
                    </Row>
                    <Row className="border-2 border-t-0">
                      <Col xs={6} className="text-right bg-[#d7d7d7] py-2 px-4 border-r-2">
                        <p className="font-semibold">Lịch học</p>
                      </Col>
                      <Col xs={18} className="px-4 !flex !items-center">
                        <p>
                          {dataAttendance?.class?.time_tables?.map(item => (`Thứ ${+item?.date + 1} ( ${item?.start} : ${item?.end} ) - ${item?.room_name}`))?.join(", ")}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Table
                  locale={{
                    emptyText: <div style={{ marginTop: '20px' }}>{dataAttendance?.listAttendance?.length === 0 ? <Empty description="Không có dữ liệu!" /> : null}</div>,
                  }}
                  // loading={loading}
                  size="middle"
                  style={{
                    margin: '20px 0px',
                    width: '100%'
                  }}
                  dataSource={dataAttendance?.listAttendance?.map(i => ({ ...i, key: i.id }))}
                  columns={columnHistory}
                  bordered
                  // rowSelection={{
                  //   onSelect: clickRow
                  // }}
                  pagination={{
                    hideOnSinglePage: true,
                    locale: { items_per_page: "/ trang" },
                    total: dataAttendance?.listAttendance?.length,
                    showTotal: (total, range) => (
                      <span>{`${range[0]} - ${range[1]} / ${total}`}</span>
                    ),
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    defaultPageSize: 10,
                    position: ["bottomRight"],
                  }}
                />
              </div>
            </>
          },
          {
            disabled: true,
            label: (
              <span>
                <CommentOutlined />
                Góp ý
              </span>
            ),
            key: '3',
            children: <>
              <List
                className="w-1/2 m-auto"
                itemLayout="vertical"
                size="small"
                // pagination={{
                //   onChange: (page) => {
                //     console.log(page);
                //   },
                //   pageSize: 3,
                // }}
                dataSource={listFeedback}
                footer={
                  <div>
                    Lớp: <b>{listFeedback.length > 0 && listFeedback[0].className}</b> - Giáo viên: <b>{listFeedback.length > 0 && listFeedback[0].toUser}</b>
                  </div>
                }
                renderItem={(item) => (
                  <List.Item
                    className="rounded-lg"
                    style={{
                      boxShadow: "5px 5px 10px 0px rgba(0, 157, 255, 0.5)",
                    }}
                    key={item?.id}
                  // actions={[
                  //   <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                  //   <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                  //   <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                  // ]}
                  // extra={
                  //   <img
                  //     width={272}
                  //     alt="logo"
                  //     src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                  //   />
                  // }
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.avatar} />}
                      title={item?.fromUser}
                      description={dayjs(item?.ctime).format("DD/MM/YYYY HH:mm")}
                    />
                    {item.feedback}
                  </List.Item>
                )}
              />
            </>
          }
        ]}
      />
    </>
  )
}

ListClass.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);
export default ListClass