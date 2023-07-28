import { getFee, getListDepartment, getListUser } from "@/api/address";
import { COLORS, GRADE } from "@/common/const";
import { formatVND } from "@/common/util";
import AddEditTs from "@/components/AddEditTS";
import LayoutAdmin from "@/components/LayoutAdmin";
import { CheckCircleOutlined, PlusCircleOutlined, ProfileOutlined, RedEnvelopeOutlined, RetweetOutlined, SearchOutlined, TeamOutlined } from "@ant-design/icons";
import { Badge, Button, Col, Empty, Form, Input, Modal, Row, Select, Space, Table, Tooltip, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const ManageStudent = () => {
  const [modal, setModal] = useState({
    open: false
  });
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
        return <div> {record?.name} </div>;
      },
      align: "center",
    },
    {
      title: "Giới tính",
      render: (text, record) => {
        return <div> {record?.gender == 'female' ? "Nữ" : "Nam"} </div>;
      },
      align: "center",
    },
    {
      title: "Ngày sinh",
      render: (text, record) => {
        return <div> {dayjs(record?.birthDay).format('DD-MM-YYYY')} </div>;
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
      title: "SĐT",
      render: (text, record) => {
        return <div> {record?.parentPhoneNumber || record?.phoneNumber} </div>;
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
      title: "Trường",
      render: (text, record) => {
        return <div> {record?.studentSchool} </div>;
      },
      align: "center",
    },
    {
      title: "Thao tác",
      render: (text, record) => {
        return <div >
          <Space size="small">
            <Tooltip title="Chi tiết">
              <ProfileOutlined style={{
                color: "red"
              }} className="text-base cursor-pointer"
                onClick={() => handleOpenForm(true, true, record)}
              />
            </Tooltip>
            <Tooltip title="Nộp học phí">
              <RedEnvelopeOutlined
                style={{
                  color: "green"
                }}
                className="text-base cursor-pointer"
                onClick={() => fee(record)}
              />
            </Tooltip>
          </Space>
        </div>;
      },
      align: "center",
    },
  ]

  const columnsFee = [
    // {
    //   title: "STT",
    //   render: (text, record, index) => {
    //     return <div>{index + 1}</div>;
    //   },
    // },
    {
      title: "Tên lớp",
      render: (text, record, index) => {
        return <div>{record?.className}</div>;
      },
    },
    {
      title: "Khối",
      render: (text, record, index) => {
        return <div>{GRADE.find(el => el.value == record?.grade).label}</div>;
      },
    },
    {
      title: "Môn học",
      render: (text, record, index) => {
        return <div>{record.subject}</div>;
      },
    },

    {
      title: "Buổi học",
      render: (text, record, index) => {
        return <div>{record.numberOfStudy}</div>;
      },
    },
    {
      title: "Học phí",
      render: (text, record, index) => {
        return <div>{formatVND(record?.fee)}</div>;
      },
    }, {
      title: "Tổng tiền",
      render: (text, record, index) => {
        return <div>{formatVND(record?.total)}</div>;
      },
    },
  ];

  const [recall, setRecall] = useState(false);
  const [tableParams, setTableParams] = useState({
    page: 1,
    size: 10,
  });

  const [total, setTotal] = useState('');

  const [listStudent, setListStudent] = useState([]);

  const [check, setCheck] = useState({
    open: false,
    checkEdit: false
  });
  const [dataEdit, setDataEdit] = useState({});

  const [dataFee, setDataFee] = useState({});

  async function fee(record) {
    getFee(record.id).then(
      res => {
        console.log(res, 'resss');
        if (res?.data?.id) {
          setDataFee(res?.data)
          setModal({
            open: true
          })
        }
      }
    ).catch(err => message.error("Có lỗi xảy ra! Vui lòng kiểm tra lại." + err))
  }

  function handleOpenForm(open, edit, record) {
    setCheck({
      open: open,
      checkEdit: edit
    })
    if (!open) {
      setRecall(!recall)
    }
    if (edit) setDataEdit(record)
  }

  function handleChangeTable(pag) {
    setTableParams({
      page: pag.current,
      size: pag.pageSize
    })
  }

  useEffect(() => {
    getListUser({ role: 'user', ...tableParams }).then(
      res => {
        setListStudent(res?.data?.result);
        setTotal(res?.data?.total * res?.data?.maxPages)
      }
    ).catch(err => message.error("Lấy dữ liệu thất bại!"))
  }, [tableParams, recall]);

  const [form] = Form.useForm()

  function submitSearch(values) {
    setTableParams({
      page: 1,
      size: 10,
      ...values
    })
  }

  const [idSelect, setIdSelect] = useState([]);

  async function confirm() {
    console.log(idSelect, 'iddd');
  }

  return (
    <>
      <Modal
        open={modal.open}
        title={dataFee?.name}
        width={"70%"}
        onCancel={() => {
          setModal({
            open: false
          })
          setDataFee({})
        }}
        footer={null}
      >
        <div className="text-2xl font-bold mt-1 mb-5">
          <TeamOutlined /> Danh sách học phí theo lớp học
        </div>
        <Table
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: idSelect,
            onChange: (selectedRowKeys, selectedRows) => {
              setIdSelect(selectedRowKeys)
            }
          }}
          size="middle"
          dataSource={dataFee?.classes?.map(i => ({ ...i, key: i?.classId }))}
          columns={columnsFee}
          bordered
          scroll={{ x: 700 }}
          pagination={false}
        />
        <Row gutter={[8, 8]} justify="end" className="mt-5">
          <Col>
            <Button disabled={idSelect.length !== 1} icon={<CheckCircleOutlined />} type="primary"
              onClick={confirm}
            >Xác nhận</Button>
          </Col>
          <Col>
            <Button onClick={() => {
              setModal({
                open: false
              })
              setDataFee({})
            }}>Hủy</Button>
          </Col>
        </Row>
      </Modal>
      {
        check.open ? <AddEditTs dataEdit={dataEdit} checkEdit={check.checkEdit} mode={2} handleOpenForm={handleOpenForm} />
          :
          <>
            <p className="font-medium text-lg mb-4">Danh sách học sinh</p>
            <Form
              form={form}
              onFinish={submitSearch}
              layout="horizontal"
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} md={9}>
                  <Form.Item name="name" label="Tên HS">
                    <Input placeholder="Nhập tên HS" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={9}>
                  <Form.Item name="grade" label="Khối">
                    <Select
                      placeholder="-- Chọn --"
                      options={GRADE}
                    >
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={6} className="flex justify-end gap-2">
                  <Button
                    icon={<RetweetOutlined />}
                    onClick={() => {
                      form.resetFields()
                      setTableParams({
                        page: 1,
                        size: 10
                      })
                    }} >Hủy</Button>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Tìm kiếm</Button>
                </Col>
              </Row>
            </Form>
            <div className="text-right">
              <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => handleOpenForm(true, false)}>Thêm mới</Button>
            </div>
            <Table
              locale={{
                emptyText: <div style={{ marginTop: '20px' }}>{listStudent?.length === 0 ? <Empty description="Không có dữ liệu!" /> : null}</div>,
              }}
              // title={titleTable}
              size="middle"
              style={{
                margin: '20px 0px',
                width: '100%'
              }}
              dataSource={listStudent?.map(i => ({ ...i, key: i?.id }))}
              columns={columns}
              bordered
              onChange={handleChangeTable}
              pagination={{
                hideOnSinglePage: true,
                locale: { items_per_page: "/ trang" },
                total: total,
                showTotal: (total, range) => (
                  <span>{`${range[0]} - ${range[1]} / ${total}`}</span>
                ),
                current: tableParams?.page,
                pageSize: tableParams.size,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
                defaultPageSize: 10,
                position: ["bottomRight"],
              }}
            />
          </>
      }
    </>
  )
}

ManageStudent.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default ManageStudent