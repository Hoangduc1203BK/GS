import { createBill, getBill, getFee, getListDepartment, getListUser, updateBill } from "@/api/address";
import { COLORS, GRADE } from "@/common/const";
import { formatVND } from "@/common/util";
import AddEditTs from "@/components/AddEditTS";
import LayoutAdmin from "@/components/LayoutAdmin";
import { CheckCircleOutlined, CloseCircleOutlined, DollarOutlined, PlusCircleOutlined, ProfileOutlined, RedEnvelopeOutlined, RetweetOutlined, SearchOutlined, SyncOutlined, TeamOutlined } from "@ant-design/icons";
import { Badge, Button, Col, DatePicker, Empty, Form, Input, Modal, Popconfirm, Row, Select, Space, Table, Tag, Tooltip, Tour, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

const ManageStudent = () => {
  const [modal, setModal] = useState({
    open: false,
    check: true, // true = co | false = khong
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
    {
      title: "Trạng thái",
      render: (text, record) => {
        return <div>{<Tag color={idSelect?.includes(record.classId) ? "green" : "blue"} icon={idSelect?.includes(record.classId) ? <CheckCircleOutlined /> : <SyncOutlined spin />}>{idSelect?.includes(record.classId) ? "Đã thanh toán" : "Chờ thanh toán"}</Tag>}</div>;
      },
    },
    {
      title: "Tên lớp",
      render: (text, record, index) => {
        return <div>{record?.className}</div>;
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
        return <div>{formatVND(+record?.fee)}</div>;
      },
    }, {
      title: "Tổng tiền",
      render: (text, record, index) => {
        return <div>{formatVND(+record?.total)}</div>;
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
    setDataFee({})
    await getBill(record.id).then(
      res => {
        if (res?.data?.id) {
          setDataFee(res?.data)
          const selectedId = res?.data?.subBills?.filter(i => i?.status)
          setIdSelect(selectedId?.map(i => i?.classId))
          setModal({
            open: true,
            check: true
          })
          setTimeout(() => {
            setOpenTour(true)
          }, 500)
        } else {
          getFee(record.id).then(
            res => {
              if (res?.data?.id) {
                setDataFee(res?.data)
                setIdSelect([])
                setModal({
                  open: true,
                  check: false
                })
                setTimeout(() => {
                  setOpenTour(true)
                }, 500)
              }
            }
          ).catch(err => message.error("Có lỗi xảy ra! Vui lòng kiểm tra lại." + err))
        }

      }
    ).catch(err => {
      console.log(err, 'errr gets');
    })
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

  const [formFee] = Form.useForm()
  const [loadingButton, setLoadingButton] = useState(false);
  const [openPop, setOpenPop] = useState(false);
  function handleOpenPop() {
    setOpenPop(true)
    if (modal.check) {
      formFee.setFieldsValue({
        type: dataFee?.type,
        description: dataFee?.description,
        day: dayjs(dataFee?.day)
      })
    } else {
      formFee.resetFields()
    }
  }

  async function confirm() {
    setLoadingButton(true)
    const params = {
      day: dayjs(formFee.getFieldValue("day")).format('YYYY-MM-DD'),
      type: formFee.getFieldValue("type"),
      description: formFee.getFieldValue("description"),
    }
    if (modal.check) {
      const bills = dataFee?.subBills?.map(i => ({
        classId: i?.classId,
        numberStudy: i?.numberOfStudy,
        total: +i?.total,
        status: idSelect?.includes(i?.classId)
      }))
      params.subBills = bills
      setOpenPop(false)
      await updateBill(params, dataFee?.id).then(
        res => {
          if (res?.data?.id) {
            message.success("Cập nhật thông tin thanh toán thành công!")
            setModal({
              open: false,
              check: true
            })
            setLoadingButton(false)
          } else {
            message.error("Cập nhật thông tin thanh toán thất bại!")
          }
        }
      ).catch(err => message.error("Có lỗi xảy ra! Vui lòng kiểm tra lại." + err))
    } else {
      params.userId = dataFee.id
      const bills = dataFee?.classes?.map(i => ({
        classId: i?.classId,
        numberStudy: i?.numberOfStudy,
        total: +i?.total,
        status: idSelect?.includes(i?.classId)
      }))
      params.subBills = bills
      setOpenPop(false)
      await createBill(params).then(
        res => {
          if (res?.data?.id) {
            message.success("Cập nhật thông tin thanh toán thành công!")
            setModal({
              open: false,
              check: true
            })
            setLoadingButton(false)
          } else {
            message.error("Cập nhật thông tin thanh toán thất bại!")
          }
        }
      ).catch(err => message.error("Có lỗi xảy ra! Vui lòng kiểm tra lại." + err))
    }
  }

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const [openTour, setOpenTour] = useState(false);
  const steps = [
    {
      title: 'DANH SÁCH THÔNG TIN HỌC PHÍ',
      description: <>
        <p>Đây là danh sách học phí. </p>
        <p className="text-red-500 text-lg font-semibold">VUI LÒNG CHỌN LỚP ĐỂ CẬP NHẬT TRẠNG THÁI ĐÓNG HỌC PHÍ ( TICK CHỌN: ĐÓNG HỌC PHÍ, KHÔNG TICK CHỌN: CHƯA ĐÓNG HỌC PHÍ )!</p>
      </>,
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
      target: () => ref1.current,
    },
    {
      title: 'XÁC NHẬN',
      description: 'Sau khi lựa chọn lớp, vui lòng bấm xác nhận và điền đầy đủ thông tin yêu cầu.',
      target: () => ref2.current,
    },
  ];
  return (
    <>
      <Tour open={openTour} onClose={() => {
        setOpenTour(false)
      }} steps={steps} />
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
        <div ref={ref1}>
          <Table
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys: idSelect,
              onChange: (selectedRowKeys, selectedRows) => {
                setIdSelect(selectedRowKeys)
              }
            }}
            size="middle"
            dataSource={modal.check ? dataFee?.subBills?.map(i => ({ ...i, key: i?.classId })) : dataFee?.classes?.map(i => ({ ...i, key: i?.classId }))}
            columns={columnsFee}
            bordered
            scroll={{ x: 700 }}
            pagination={false}
          />
        </div>
        <Row gutter={[8, 8]} justify="end" className="mt-5">
          <Col>
            <Popconfirm
              title="Thanh toán học phí"
              placement="topRight"
              okButtonProps={{
                className: '!hidden'
              }}
              open={openPop}
              cancelButtonProps={{
                className: '!hidden'
              }}
              // onOpenChange={handleOpenPop}
              onCancel={() => {
                setOpenPop(false)
                formFee.resetFields()
              }}
              description={
                <Form
                  form={formFee}
                  labelCol={{
                    span: 8
                  }}
                  onFinish={confirm}
                >
                  <Form.Item name="day" label="Ngày" rules={[
                    { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
                  ]}>
                    <DatePicker placeholder="--Chọn ngày--" className="w-full" />
                  </Form.Item>
                  <Form.Item name="type" label="Loại thanh toán"
                    rules={[
                      { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
                    ]}
                  >
                    <Select
                      placeholder="--Chọn--"
                    >
                      <Select.Option value="in-cash">Tiền mặt</Select.Option>
                      <Select.Option value="bank">Chuyển khoản</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Ghi chú" name="description"
                  // rules={[
                  //   { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
                  // ]}
                  >
                    <Input placeholder="Nhập ghi chú" />
                  </Form.Item>
                  <Row gutter={[8, 8]} justify="end">
                    <Col>
                      <Button loading={loadingButton} htmlType="submit" type="primary" icon={<DollarOutlined />}>Thanh toán</Button>
                    </Col>
                  </Row>
                </Form>
              }
            >
              <Button ref={ref2} icon={<CheckCircleOutlined />} onClick={handleOpenPop} loading={loadingButton} type="primary">Xác nhận</Button>
            </Popconfirm>
          </Col>
          <Col>
            <Button onClick={() => {
              setModal({
                open: false
              })
              setDataFee({})

            }}
              loading={loadingButton} icon={<CloseCircleOutlined />}>Hủy</Button>
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