import { getClass, getListClass, getListClassRoom, getListProposal, getListTeacherEmpty, getListUser, updateProposal } from "@/api/address";
import { FORMAT_DATE, PROPOSAL_STATUS_LIST, STUDENT_PROPOSAL_TYPE, TEACHER_PROPOSAL_TYPE } from "@/common/const";
import LayoutAdmin from "@/components/LayoutAdmin";
import { AliwangwangOutlined, BarcodeOutlined, BarsOutlined, ClockCircleOutlined, DiffOutlined, FileSearchOutlined, FileSyncOutlined, FlagOutlined, FormOutlined, RetweetOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Empty, Form, Modal, Row, Select, Space, Table, Tabs, Tag, Timeline, Tooltip, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
const RecommendManage = () => {

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
      title: "Họ và tên",
      render: (text, record) => {
        return <div> {record?.user} </div>;
      },
      align: "center",
    },
    {
      title: "Email",
      render: (text, record) => {
        return <div> {record?.email} </div>;
      },
      align: "center",
    },
    {
      title: "Loại đề xuất",
      render: (text, record) => {
        return <div> {STUDENT_PROPOSAL_TYPE.concat(TEACHER_PROPOSAL_TYPE).find(i => i.value === record?.type)?.label} </div>;
      },
      align: "center",
    },
    {
      title: "Ngày đề xuất",
      render: (text, record) => {
        return <div> {dayjs(record?.time).format('DD-MM-YYYY')} </div>;
      },
      align: "center",
    },
    {
      title: "Mô tả",
      render: (text, record) => {
        return <div> {record?.description} </div>;
      },
      align: "center",
    },
    {
      title: "Trạng thái",
      render: (text, record) => {
        const result = PROPOSAL_STATUS_LIST?.find(i => i?.value == record?.status)
        return <div className="font-medium">{<Tag color={result?.color} icon={result?.icon}>{result?.label}</Tag>}</div>;
      },
      align: "center",
    },
    {
      title: "Thao tác",
      render: (text, record) => {
        return <div >
          <Space size="small">
            <Tooltip title="Cập nhật trạng thái">
              <DiffOutlined style={{
                color: "red"
              }} className="text-base cursor-pointer"
                onClick={() => handleModal(true, record)}
              />
            </Tooltip>
          </Space>
        </div>;
      },
      align: "center",
    },
  ]
  const [form] = Form.useForm()
  const [recall, setRecall] = useState({
    teacher: false,
    student: false
  });
  const [dataTeacher, setDataTeacher] = useState([]);
  const [dataStudent, setDataStudent] = useState([]);
  const [listTeacher, setListTeacher] = useState([]);
  const [detailClass, setDetailClass] = useState({});
  const [modal, setModal] = useState({
    open: false,
    data: {}
  });

  async function handleModal(open, record) {
    if (open && record?.status !== 'pending') {
      message.error("Không thể cập nhật trạng thái do đề xuất này đã được xét duyệt!")
      return
    }
    setModal({
      open: open,
      data: open ? record : {}
    })
    if (open) {
      let resultClass
      await getClass(record?.sub_data?.classId).then(
        res => {
          setDetailClass(res?.data)
          resultClass = res?.data
        }
      ).catch(err => console.log(err, 'errrr'))
      const params = {
        schedules: resultClass?.time_tables?.map(i => ({
          date: i?.date,
          start: i?.start,
          end: i?.end,
          roomId: i?.roomId
        })),
        departmentId: record?.department_id
      }
      await getListTeacherEmpty(params).then(
        res => {
          setListTeacher(res?.data)
        }
      ).catch(err => console.log(err, 'errrr'))
    }
  }

  async function submit(values) {
    const params = {
      status: values?.status,
    }
    if (modal?.data?.type === 'teacher_take_break') params.subData = {
      teacherId: values?.teacherId
    }
    updateProposal(modal?.data?.id, params).then(
      res => {
        if (res?.data) {
          message.success("Cập nhật trạng thái thành công!")
          setModal({
            open: false,
            data: {}
          })
          form.resetFields()
          setRecall({
            teacher: !recall.teacher,
            student: !recall.student,
          })
        }
      }
    )
  }

  const [paramsSearch, setParamsSearch] = useState({});
  const [paramsSearchStudent, setParamsSearchStudent] = useState({});

  useEffect(() => {
    setDataTeacher([])
    const params = {
      role: 'teacher',
      ...paramsSearch
    }
    getListProposal({ ...params }).then(res => {
      setDataTeacher(res?.data)
    }).catch(err => console.log(err, 'errr'))
  }, [recall.teacher, paramsSearch]);

  useEffect(() => {
    setDataStudent([])
    const params = {
      role: 'user',
      ...paramsSearchStudent
    }
    getListProposal({ ...params }).then(res => {
      setDataStudent(res?.data)
    }).catch(err => console.log(err, 'errr'))
  }, [recall.student, paramsSearchStudent]);


  const [formSearch] = Form.useForm()
  const [formSearchStudent] = Form.useForm()

  function submitSearch(values) {
    if (values.date) {
      values.start = dayjs(values.date[0]).format("YYYY-MM-DD")
      values.end = dayjs(values.date[1]).format("YYYY-MM-DD")
      delete values.date
    }
    delete values.date
    setParamsSearch({
      ...values
    })
  }

  function submitSearchStudent(values) {
    console.log(values, 'valiess');
    if (values.date) {
      values.start = dayjs(values.date[0]).format("YYYY-MM-DD")
      values.end = dayjs(values.date[1]).format("YYYY-MM-DD")
      delete values.date
    }
    setParamsSearchStudent({
      ...values
    })
  }

  return (
    <>
      <Modal
        open={modal.open}
        title="Cập nhật trạng thái đề xuất"
        okText="Xác nhận"
        cancelText="Hủy"
        onCancel={() => handleModal(false)}
        footer={null}
      >
        <Timeline
          className="mt-10"
          mode="left"
          items={[
            {
              label: <p className="font-medium">Họ và tên</p>,
              children: modal?.data?.user,
              dot: <FileSearchOutlined />,
              color: 'green'
            },
            {
              label: <p className="font-medium">Loại đề xuất</p>,
              children: STUDENT_PROPOSAL_TYPE.concat(TEACHER_PROPOSAL_TYPE).find(i => i.value === modal?.data?.type)?.label,
              dot: <AliwangwangOutlined />,
              color: "red"
            },
            {
              label: <p className="font-medium">Thời gian</p>,
              children: dayjs(modal?.data?.time).format("DD-MM-YYYY"),
              dot: <ClockCircleOutlined />,
              color: "#00CCFF"
            },
            {
              label: <p className="font-medium">Mô tả</p>,
              children: modal?.data?.description,
              dot: <FormOutlined />
            },
            {
              label: <p className="font-medium">Lớp</p>,
              children: detailClass?.name,
              dot: <BarsOutlined />
            },
          ]}
        />
        <Form
          form={form}
          labelCol={{
            span: 8
          }}
          onFinish={submit}
          labelWrap="wrap"
        >
          {
            modal?.data?.type === 'teacher_take_break'
            &&
            <Form.Item name="teacherId" label="Giáo viên dạy thay"
              rules={[{ required: true, message: "Đây là trường dữ liệu bắt buộc!" }]}
            >
              <Select
                placeholder="-- Chọn --"
              >
                {
                  listTeacher?.filter(e => e?.id !== modal?.data?.user_id)?.map(i => (
                    <Select.Option key={i.id} value={i.id}>{i.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          }
          <Form.Item name="status" label="Trạng thái"
            rules={[{ required: true, message: "Đây là trường dữ liệu bắt buộc!" }]}
          >
            <Select placeholder="-- Chọn --">
              <Select.Option value="approved">Duyệt</Select.Option>
              <Select.Option value="rejected">Từ chối</Select.Option>
            </Select>
          </Form.Item>
          <Row gutter={[8, 8]} justify="end">
            <Col>
              <Button type="primary" htmlType="submit">Xác nhận</Button>
            </Col>
            <Col>
              <Button onClick={() => handleModal(false)}>Hủy</Button>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Tabs
        // onChange={handleChangeTab}
        defaultActiveKey="1"
        // activeKey={activeTab}
        centered
        items={[
          {
            label: (
              <span>
                <FileSyncOutlined />
                Đề xuất giáo viên
              </span>
            ),
            key: '1',
            children: <>
              <p className="font-medium mb-2">Thông tin đề xuất giáo viên</p>
              <Form
                form={formSearch}
                onFinish={submitSearch}
                layout="horizontal"
              >
                <Row gutter={[8, 8]}>
                  <Col xs={24} md={8}>
                    <Form.Item name="type">
                      <Select
                        placeholder="-- Chọn loại đề xuất --"
                        options={TEACHER_PROPOSAL_TYPE}
                      >
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item name="status">
                      <Select
                        placeholder="-- Chọn trạng thái --"
                        options={PROPOSAL_STATUS_LIST}
                      >
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item name="date">
                      <DatePicker.RangePicker
                        placeholder={["Từ ngày", "Đến ngày"]}
                        style={{
                          width: '100%'
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} className="flex justify-end gap-2">
                    <Button
                      icon={<RetweetOutlined />}
                      onClick={() => {
                        formSearch.resetFields()
                        setParamsSearch({})
                      }} >Hủy</Button>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Tìm kiếm</Button>
                  </Col>
                </Row>
              </Form>
              <Table
                locale={{
                  emptyText: <div style={{ marginTop: '20px' }}>{dataTeacher?.length === 0 ? <Empty description="Danh sách đề xuất đang trống!" /> : null}</div>,
                }}
                size="middle"
                style={{
                  margin: '20px 0px',
                  width: '100%'
                }}
                dataSource={dataTeacher?.map(i => ({ ...i, key: i.id }))}
                columns={columns}
                bordered
                scroll={{ x: 1000 }}
                pagination={{
                  hideOnSinglePage: true,
                  locale: { items_per_page: "/ trang" },
                  total: dataTeacher?.length,
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
            label: (
              <span>
                <FlagOutlined />
                Đề xuất học sinh
              </span>
            ),
            key: '2',
            children: <>
              <div>
                <p className="font-medium mb-2">Thông tin đề xuất học sinh</p>
                <Form
                  form={formSearchStudent}
                  onFinish={submitSearchStudent}
                  layout="horizontal"
                >
                  <Row gutter={[8, 8]}>
                    <Col xs={24} md={8}>
                      <Form.Item name="type">
                        <Select
                          placeholder="-- Chọn loại đề xuất --"
                          options={STUDENT_PROPOSAL_TYPE}
                        >
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item name="status">
                        <Select
                          placeholder="-- Chọn trạng thái --"
                          options={PROPOSAL_STATUS_LIST}
                        >
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item name="date">
                        <DatePicker.RangePicker
                          placeholder={["Từ ngày", "Đến ngày"]}
                          style={{
                            width: '100%'
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} className="flex justify-end gap-2">
                      <Button
                        icon={<RetweetOutlined />}
                        onClick={() => {
                          formSearchStudent.resetFields()
                          setParamsSearchStudent({})
                        }} >Hủy</Button>
                      <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Tìm kiếm</Button>
                    </Col>
                  </Row>
                </Form>
                <Table
                  locale={{
                    emptyText: <div style={{ marginTop: '20px' }}>{dataStudent?.length === 0 ? <Empty description="Danh sách đề xuất đang trống!" /> : null}</div>,
                  }}
                  size="middle"
                  style={{
                    margin: '20px 0px',
                    width: '100%'
                  }}
                  dataSource={dataStudent?.map(i => ({ ...i, key: i.id }))}
                  columns={columns}
                  bordered
                  scroll={{ x: 1000 }}
                  pagination={{
                    hideOnSinglePage: true,
                    locale: { items_per_page: "/ trang" },
                    total: dataStudent?.length,
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
          }
        ]}
      />
    </>
  )
}

RecommendManage.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);
export default RecommendManage