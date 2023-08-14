import { createBill, getAdminTimeKeeping, getBill, getListDepartment, getListUser, getOneBill } from "@/api/address";
import { formatVND } from "@/common/util";
import AddEditTs from "@/components/AddEditTS";
import LayoutAdmin from "@/components/LayoutAdmin";
import { CheckCircleOutlined, FundOutlined, PlusCircleOutlined, RetweetOutlined, ScheduleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Empty, Form, Input, Modal, Popconfirm, Row, Select, Space, Table, Tag, Tooltip, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const ManageTeacher = () => {

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
        return <div> {record?.phoneNumber} </div>;
      },
      align: "center",
    },
    {
      title: "Bộ môn",
      render: (text, record) => {
        return <div> {listDepartment?.find(i => i.id === record?.departmentId)?.name} </div>;
      },
      align: "center",
    },
    {
      title: "Trường",
      render: (text, record) => {
        return <div> {record?.teacherSchool} </div>;
      },
      align: "center",
    },
    {
      title: "Thao tác",
      render: (text, record) => {
        return <div >
          <Space size="small">
            <Tooltip title="Chi tiết">
              <ScheduleOutlined style={{
                color: "orange"
              }} className="text-base cursor-pointer"
                onClick={() => handleOpenForm(true, true, record)}
              />
            </Tooltip>
            <Tooltip title="Xác nhận chấm công">
              <FundOutlined 
                style={{
                  color: "red"
                }} 
                className="text-base cursor-pointer"
                onClick={() => handleModal(true, record)}
              />
            </Tooltip>
          </Space>
        </div>;
      },
      align: "center",
    },
  ]
  const [listDepartment, setListDepartment] = useState([]);
  const [recall, setRecall] = useState(false);
  const [tableParams, setTableParams] = useState({
    page: 1,
    size: 10,
  });

  const [total, setTotal] = useState('');

  const [listTeacher, setListTeacher] = useState([]);
  const [check, setCheck] = useState({
    open: false,
    checkEdit: false
  });

  const [modal, setModal] = useState({
    open: false,
    record: null,
    check: true // true = getBills have data || false = getTimeKeeping
  })
  const [data, setData] = useState({})

  
  const columnsFee = [
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
      title: "Số ngày công",
      render: (text, record, index) => {
        return <div>{record.numberOfStudy}</div>;
      },
    },
    {
      title: "Chiết khấu",
      render: (text, record, index) => {
        return <div>{record.teacher_rate}%</div>;
      },
    },
    {
      title: "Tiền công",
      render: (text, record, index) => {
        return <div>{formatVND(modal.check ? +record?.teacherFee : +record?.fee)}</div>;
      },
    }, 
    {
      title: "Tổng tiền",
      render: (text, record, index) => {
        return <div>{formatVND(+record?.total)}</div>;
      },
    },
    {
      title: "Trạng thái",
      render: (text, record) => {
        return <div>{<Tag color={"green"} icon={<CheckCircleOutlined />}>Đã xác nhận</Tag>}</div>;
      },
    },
  ];

  useEffect(() => {
    if(!modal.check){
      columnsFee.splice(6, 1)
    }
  }, [modal])

  async function handleModal(option, record) {
    if(option && record.id){
      await getOneBill({ userId: record?.id, month: (dayjs().month() + 1).toString().padStart(2, '0') }).then(
        res => {
          if(res?.data?.id) {
            setData(res?.data)
            setModal({
              open: option,
              record: record,
              check: true
            })
          } else {
            getAdminTimeKeeping({ userId: record.id }).then(
              res => {
                if(res?.data?.id){
                  setData(res?.data)
                  setModal({
                    open: option,
                    record: record,
                    check: false
                  })
                } else {
                  message.error("Vui lòng kiểm tra lại!")
                }
              }
            ).catch(err => message.error("Không thể lấy dữ liệu chấm công!"))
          }
        }
      ).catch(err => console.log(err ,'err get bill'))
    } else {
      setModal({
        open: false,
        record: null,
        check: true
      })
    }
  }
  const [dataEdit, setDataEdit] = useState({});
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
    getListUser({ role: 'teacher', ...tableParams }).then(
      res => {
        setListTeacher(res?.data?.result);
        setTotal(res?.data?.total * res?.data?.maxPages)
      }
    ).catch(err => message.error("Lấy dữ liệu thất bại!"))
  }, [tableParams, recall]);

  useEffect(() => {
    getListDepartment({ page: 1, size: 99999 }).then(
      res => {
        setListDepartment(res?.data?.result)
      }
    ).catch(err => console.log(err, 'errr'))
  }, []);

  const [form] = Form.useForm()

  function submitSearch(values) {
    console.log(values, 'valiess');
    setTableParams({
      page: 1,
      size: 10,
      ...values
    })
  }

  async function confirm() {
    const params = {
      userId: modal?.record?.id,
      type: "in-cash",
      description: "thanh toán học phí tháng " + (dayjs().month() + 1).toString().padStart(2, '0'),
      day: dayjs().format("YYYY-MM-DD"),
      billOf: "teacher",
      subBills: data?.classes?.map(el => ({
        classId: el?.classId,
        numberStudy: el?.numberOfStudy,
        total: +el?.total,
        status: true
      }))
    }
    createBill(params).then(
      res => {
        if (res?.data?.id) {
          message.success("Xác nhận chấm công thành công!")
          setModal({
            open: false,
            check: true,
            record: null
          })
          // setLoadingButton(false)
        } else {
          message.error("Xác nhận chấm công thất bại!")
        }
      }
    ).catch(err => message.error("Có lỗi xảy ra! Vui lòng kiểm tra lại." + err))
  }
  console.log(data, 'dataa');
  return (
    <>
      <Modal 
        open={modal.open}
        onCancel={() => handleModal(false, null)}
        title={"Bảng chấm công tháng " + (dayjs().month() + 1).toString().padStart(2, '0')}
        width={"70%"}
        footer={null}
      >
        <Table
            // rowSelection={{
            //   type: 'checkbox',
            //   selectedRowKeys: idSelect,
            //   onChange: (selectedRowKeys, selectedRows) => {
            //     setIdSelect(selectedRowKeys)
            //     setRecordSelected(selectedRows)
            //   }
            // }}
            locale={{
              emptyText: <div style={{ marginTop: '20px' }}>{data?.classes?.length === 0 ? <Empty description="Chưa có buổi học nào!" /> : null}</div>,
            }}
            size="middle"
            dataSource={modal?.check ? data?.subBills?.map(i => ({ ...i, key: i?.classId })) : data?.classes?.map(i => ({ ...i, key: i?.classId })) }
            columns={columnsFee}
            bordered
            scroll={{ x: 700 }}
            pagination={false}
          />
        <Row gutter={[8, 8]} justify='end' className="!mt-4">
          <Col>
            <Popconfirm
              title="Xác nhận bảng chấm công?"
              placement="topRight"
              onConfirm={confirm}
              okText="Lưu"
              cancelText="Hủy"
              disabled={modal.check}
            >
              <Button disabled={modal.check} type="primary">Xác nhận</Button>
            </Popconfirm>
          </Col>
          <Col>
            <Button onClick={() => handleModal(false, null)}>Hủy</Button>
          </Col>
        </Row>
      </Modal>
      {
        check.open ? <AddEditTs dataEdit={dataEdit} checkEdit={check.checkEdit} mode={1} handleOpenForm={handleOpenForm} />
          :
          <>
            <p className="font-medium text-lg mb-4">Danh sách giáo viên</p>
            <Form
              form={form}
              onFinish={submitSearch}
              layout="horizontal"
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} md={9}>
                  <Form.Item name="name" label="Tên GV">
                    <Input placeholder="Nhập tên GV" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={9}>
                  <Form.Item name="departmentId" label="Bộ môn">
                    <Select
                      placeholder="-- Chọn --"
                    >
                      {
                        listDepartment?.map(i => (
                          <Select.Option key={i.id} value={i.id}>{i?.name}</Select.Option>
                        ))
                      }
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
                emptyText: <div style={{ marginTop: '20px' }}>{listTeacher?.length === 0 ? <Empty description="Không có dữ liệu!" /> : null}</div>,
              }}
              // title={titleTable}
              size="middle"
              style={{
                margin: '20px 0px',
                width: '100%'
              }}
              dataSource={listTeacher?.map(i => ({ ...i, key: i?.id }))}
              columns={columns}
              bordered
              onChange={handleChangeTable}
              pagination={{
                // hideOnSinglePage: true,
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

ManageTeacher.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default ManageTeacher