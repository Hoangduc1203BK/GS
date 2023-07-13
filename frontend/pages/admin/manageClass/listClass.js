
import { getAttendance, getListAttendance, getListClass, getListSubject, getListUser, getListUserInClass } from "@/api/address";
import LayoutAdmin from "@/components/LayoutAdmin";
import { CheckCircleFilled, CloseCircleFilled, DeleteOutlined, EditOutlined, EyeOutlined, HistoryOutlined, ProfileOutlined, SnippetsOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Empty, Input, List, Modal, Row, Select, Space, Table, Tabs, Tooltip, Tour, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

const ListClass = () => {

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
        return <div>Khối {record?.grade}</div>;
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
            {/* <Tooltip title="Chi tiết">
              <EyeOutlined style={{
                color: "#b9db84"
              }} className="text-base cursor-pointer" />
            </Tooltip> */}
            <Tooltip title="Lịch sử điểm danh">
              <SnippetsOutlined
                onClick={() => watchHistory(record)}
                style={{
                  color: "#fc4a6c"
                }} className="text-base cursor-pointer" />
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
        return <div><Button type="primary" style={{ backgroundColor: 'aqua', color: 'black', fontWeight: '500' }} onClick={() => detailAttendance(record)} className="hover:-translate-y-0.5 duration-300 hover:scale-105">Chi tiết</Button></div>;
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
      {
        title: 'Nhận xét',
        dataIndex: 'comment',
        key: 'comment',
      },
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
    console.log(record, 'recorddd')
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
  }, []);
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
              <p className="font-medium mb-2">Thông tin lớp học</p>
              <Row gutter={[8, 8]}>
                <Col xs={24} md={12} className="grid grid-cols-4 ">
                  <p className="flex items-center">Chọn môn:</p>
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
                </Col>
              </Row>
              <Table
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