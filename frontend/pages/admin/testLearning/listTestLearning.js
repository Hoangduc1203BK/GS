import { getListClass, getListTestLearning, updateTestLearning } from "@/api/address";
import { disabledDate } from "@/common/util";
import LayoutAdmin from "@/components/LayoutAdmin";
import { ClockCircleOutlined, ContainerOutlined, DeleteOutlined, DeliveredProcedureOutlined, EditOutlined, SnippetsOutlined, SolutionOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Divider, Form, Input, Modal, Row, Select, Space, Steps, Table, Tabs, Tooltip, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const ListTestLearning = () => {

  const [form] = Form.useForm()

  const columns = [
    {
      title: "STT",
      render: (text, record, index) => {
        return <div>{index + 1}</div>;
      },
      align: "center",
    },
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
        return <div>{record?.student}</div>;
      },
      align: "center",
    },
    {
      title: "Số điện thoại",
      render: (text, record) => {
        return <div>{record?.phoneNumber}</div>;
      },
      align: "center",
    },
    {
      title: "Ngày mong muốn ",
      render: (text, record) => {
        return <div>{record?.desiredDate}</div>;
      },
      align: "center",
    },
    {
      title: "Khối",
      render: (text, record) => {
        return <div>Khối {record?.grade}</div>;
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
      title: "Ghi chú",
      render: (text, record) => {
        return <div>{record?.description}</div>;
      },
      align: "center",
    },
    {
      title: "Thao tác",
      render: (text, record) => {
        return <div >
          <Space size="small">
            <Tooltip title="Chỉnh sửa">
              <EditOutlined
                style={{
                  color: "#b9db84"
                }}
                className="text-base cursor-pointer"
                onClick={() => handleEdit(record)}
              />
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
  const columnsLearned = [
    {
      title: "STT",
      render: (text, record, index) => {
        return <div>{index + 1}</div>;
      },
      align: "center",
    },
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
        return <div>{record?.student}</div>;
      },
      align: "center",
    },
    {
      title: "Số điện thoại",
      render: (text, record) => {
        return <div>{record?.phoneNumber}</div>;
      },
      align: "center",
    },
    {
      title: "Khối",
      render: (text, record) => {
        return <div>Khối {record?.grade}</div>;
      },
      align: "center",
    },
    {
      title: "Môn đăng ký",
      render: (text, record) => {
        return <div>{record?.subject}</div>;
      },
      align: "center",
    },
    {
      title: "Lớp học thử",
      render: (text, record) => {
        return <div>{record?.class}</div>;
      },
      align: "center",
    },
    {
      title: "Lớp học thử",
      render: (text, record) => {
        return <div>{record?.class}</div>;
      },
      align: "center",
    },
    {
      title: "Lịch học thử",
      render: (text, record) => {
        return <div>Thứ {record?.timeTable?.date} ( {record?.timeTable?.start} : {record?.timeTable?.end} )</div>;
      },
      align: "center",
    },
    {
      title: "Ghi chú",
      render: (text, record) => {
        return <div>{record?.description}</div>;
      },
      align: "center",
    }
  ]
  const [tableParams, setTableParams] = useState({
    page: 1,
    size: 10,
    status: 'pending'
  });

  const [tableParamsLearned, setTableParamsLearned] = useState({
    page: 1,
    size: 10,
    status: 'active'
  });

  const [listPendingLearn, setListPendingLearn] = useState({});
  const [listLearned, setListLearned] = useState({});
  const [listClass, setListClass] = useState([]);
  const [timeTables, setTimeTables] = useState([]);
  const [recall, setRecall] = useState(false);

  const [modal, setModal] = useState({
    open: false,
    mode: 1,
    id: null
  });

  function handleChangeTab(key) {
    if (key === '2') {
      getListTestLearning({ ...tableParamsLearned }).then(
        res => {
          setListLearned(res?.data);
        }
      )
    }
  }

  async function handleEdit(record) {
    setModal({
      open: true,
      mode: 1,
      id: record?.id
    })
    form.setFieldsValue({
      studentId: record?.studentId,
      student: record?.student,
      phoneNumber: record?.phoneNumber,
      grade: "Khối " + record?.grade
    })
    await getListClass({ subjectId: record?.subjectId }).then(
      res => {
        setListClass(res?.data);
      }
    ).catch(err => message.error('Lấy dữ liệu lớp thất bại!'))
  }

  function handleChangeTable(pagination) {
    setTableParams({
      ...tableParams,
      page: pagination.current,
      size: pagination.pageSize,
      status: 'pending'
    })
  }

  function handleChangeTableLearned(pagination) {
    setTableParamsLearned({
      ...tableParamsLearned,
      page: pagination.current,
      size: pagination.pageSize,
      status: 'active'
    })
  }

  function handleSelectClass(value) {
    const data = listClass?.find(i => i.id === value)
    setTimeTables(data?.time_tables?.map(i => ({
      key: i?.id,
      value: i?.id,
      label: `Thứ ${i?.date} ( ${i?.start} : ${i?.end} )`,
      room: i?.room_name
    })))
  }

  function handleSelectTime(value) {
    const data = timeTables?.find(i => i.value === value)
    form.setFieldsValue({
      room: data?.room
    })
  }

  async function handleFinish(values) {
    const params = {
      day: dayjs(values?.date).format('YYYY-MM-DD'),
      timeTableId: values.time,
      status: 'active',
      description: values?.description
    }
    await updateTestLearning(modal?.id, params).then(res => {
      if (res?.data?.id) {
        message.success('Xếp lịch học thử thành công!')
        setModal({
          open: false,
          mode: 1,
          id: null
        })
        form.resetFields()
        setListClass([])
        setTimeTables([])
        setRecall(!recall)
        setTableParams({
          page: 1,
          size: 10,
          status: 'pending'
        })
      }
    }).catch(err => message.error("Xếp lịch thất bại! " + err))
  }

  useEffect(() => {
    getListTestLearning({ ...tableParams }).then(
      res => {
        setListPendingLearn(res?.data);
      }
    )
  }, [tableParams, recall]);

  useEffect(() => {
    getListTestLearning({ ...tableParamsLearned }).then(
      res => {
        setListLearned(res?.data);
      }
    )
  }, [tableParamsLearned]);

  return (
    <>
      <Modal
        open={modal.open}
        title="Xếp lịch học thử"
        footer={null}
        onCancel={() => {
          setModal({
            open: false,
            mode: 1
          })
          form.resetFields()
        }}
      >
        <Form
          form={form}
          labelAlign="left"
          labelCol={{
            span: 6
          }}
          onFinish={handleFinish}
        >
          <Form.Item name="studentId" label="Mã HS">
            <Input disabled />
          </Form.Item>
          <Form.Item name="student" label="Họ và tên">
            <Input disabled />
          </Form.Item>
          <Form.Item name="phoneNumber" label="SĐT">
            <Input disabled />
          </Form.Item>
          <Form.Item name="grade" label="Khối">
            <Input disabled />
          </Form.Item>
          <Form.Item name="class" label="Lớp">
            <Select
              placeholder="-- Chọn lớp -- "
              onSelect={handleSelectClass}
            >
              {
                listClass?.map(item => (
                  <Select.Option key={item?.id} value={item?.id}>{item?.name}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item name="time" label="Lịch học thử">
            <Select
              placeholder="-- Chọn lịch -- "
              onSelect={handleSelectTime}
              options={timeTables}
            >
            </Select>
          </Form.Item>
          <Form.Item name="room" label="Phòng học">
            <Input disabled />
          </Form.Item>
          <Form.Item name="date" label="Chọn ngày">
            <DatePicker placeholder="-- Chọn ngày --" disabledDate={disabledDate} style={{
              width: '100%'
            }} />
          </Form.Item>
          <Form.Item name="description" label="Ghi chú">
            <Input placeholder="Nhập ghi chú" />
          </Form.Item>
          <Row gutter={[8, 8]} justify="center">
            <Col>
              <Button htmlType="submit" type="primary">Xác nhận</Button>
            </Col>
            <Col>
              <Button onClick={() => {
                setModal({
                  open: false,
                  mode: 1
                })
                form.resetFields()
              }
              }>Hủy</Button>
            </Col>
          </Row>
        </Form>

      </Modal>
      <Tabs
        onChange={handleChangeTab}
        defaultActiveKey="1"
        centered
        items={[
          {
            label: (
              <span>
                <ClockCircleOutlined />
                Danh sách chờ học thử
              </span>
            ),
            key: '1',
            children: <>
              <Row gutter={[8, 8]}>
                <Col xs={24} md={12}>
                  <Input placeholder="Nhập mã học sinh, họ tên" />
                </Col>
                <Col xs={24} md={12}>
                  <Button type="primary">Tìm kiếm</Button>
                </Col>
              </Row>
              <Table
                locale={{
                  emptyText: <div style={{ marginTop: '20px' }}>{listPendingLearn?.result?.length === 0 ? "Không có dữ liệu!" : null}</div>,
                }}
                size="middle"
                style={{
                  marginTop: '10px',
                  width: '100%'
                }}
                dataSource={listPendingLearn?.result?.map(el => ({ ...el, key: el?.id }))}
                columns={columns}
                bordered
                // scroll={{ x: 700 }}
                onChange={handleChangeTable}
                pagination={{
                  locale: { items_per_page: "/ trang" },
                  total: listPendingLearn?.total,
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
                <SolutionOutlined />
                Danh sách đã học thử
              </span>
            ),
            key: '2',
            children: <>
              <Row gutter={[8, 8]}>
                <Col xs={24} md={12}>
                  <Input placeholder="Nhập mã học sinh, họ tên" />
                </Col>
                <Col xs={24} md={12}>
                  <Button type="primary">Tìm kiếm</Button>
                </Col>
              </Row>
              <Table
                locale={{
                  emptyText: <div style={{ marginTop: '20px' }}>{listLearned?.result?.length === 0 ? "Không có dữ liệu!" : null}</div>,
                }}
                size="middle"
                style={{
                  marginTop: '10px',
                  width: '100%'
                }}
                dataSource={listLearned?.result?.map(el => ({ ...el, key: el?.id }))}
                columns={columnsLearned}
                bordered
                // scroll={{ x: 700 }}
                onChange={handleChangeTableLearned}
                pagination={{
                  locale: { items_per_page: "/ trang" },
                  total: listPendingLearn?.total,
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
          }
        ]}
      />
    </>
  )
}

ListTestLearning.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default ListTestLearning 