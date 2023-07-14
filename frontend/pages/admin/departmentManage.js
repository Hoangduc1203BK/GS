import { createDepartment, createSubject, getListDepartment, getListSubject, getListUser, updateDepartment, updateSubject } from "@/api/address";
import { GRADE } from "@/common/const";
import { validatePhone } from "@/common/util";
import LayoutAdmin from "@/components/LayoutAdmin";
import { EditOutlined, GroupOutlined } from "@ant-design/icons";
import { Button, Col, Empty, Form, Input, InputNumber, Modal, Row, Select, Space, Table, Tooltip, message } from "antd";
import { useEffect, useState } from "react";

const DepartmentManage = () => {

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
      title: "Tên",
      render: (text, record) => {
        return <div> {record?.name} </div>;
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
      title: "Trưởng bộ môn",
      render: (text, record) => {
        return <div> {fullListTeacher?.find(i => i.id === record?.leader)?.name} </div>;
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
      title: "Thao tác",
      render: (text, record) => {
        return <div >
          <Space size="small">
            <Tooltip title="Chỉnh sửa">
              <GroupOutlined style={{
                color: "#b9db84"
              }} className="text-base cursor-pointer"
                onClick={() => showModal(0, true, true, record)}
              />
            </Tooltip>
          </Space>
        </div>;
      },
      align: "center",
    },
  ]

  const expandedRowRender = () => {
    const columnsSubjects = [
      {
        title: 'STT',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: 'Tên môn học',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Khối',
        dataIndex: 'grade',
        key: 'grade',
        render: (text, record) => <div>Khối {record?.grade}</div>,
      },
      {
        title: 'Mô tả',
        key: 'description',
        dataIndex: 'description',
      },
      {
        title: 'Thao tác',
        dataIndex: 'action',
        key: 'action',
        render: (text, item) => (
          <Space size="middle">
            <Tooltip title="Chỉnh sửa">
              <EditOutlined style={{
                fontSize: '18px',
                color: 'red',
                cursor: 'pointer'
              }}
                onClick={() => showModal(1, true, true, item)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ];
    return <Table columns={columnsSubjects} dataSource={subjects} pagination={false}
      locale={{
        emptyText: <div style={{ marginTop: '20px' }}>{subjects?.length === 0 ? <Empty description="Không có môn học nào!" /> : null}</div>,
      }}
      loading={loadingExpand}
    />;
  };


  const titleTable = () => (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={12}>
          <p className="font-medium text-lg mb-4">Danh sách bộ môn</p>
        </Col>
        <Col xs={12} className="w-full flex gap-2 justify-end !text-right">
          <Button type="primary" style={{
            backgroundColor: 'purple'
          }}
            onClick={() => showModal(0, false, true)}
          >Tạo bộ môn</Button>
          <Button type="primary" onClick={() => showModal(1, false, true)} >Tạo môn học</Button>
        </Col>
      </Row>
    </>
  )

  const [form] = Form.useForm()
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loadingExpand, setLoadingExpand] = useState(false);
  const [recall, setRecall] = useState(false);
  const [expandedKey, setExpandedKey] = useState([]);
  const [listTeacher, setListTeacher] = useState([]);
  const [fullListTeacher, setFullListTeacher] = useState([]);

  const [tableParams, setTableParams] = useState({
    page: 1,
    size: 10,
    maxPages: 1
  });
  const [modal, setModal] = useState({
    mode: 0, // 0 - department | 1 - subject,
    checkEdit: false,
    open: false
  });
  const [idUpdate, setIdUpdate] = useState('');
  const [fullDepartment, setFullDepartment] = useState([]);

  function showModal(mode, option, open, record) {
    setModal({
      open: open,
      checkEdit: option,
      mode: mode
    })
    setIdUpdate(record?.id || null)
    if (open) {
      if (mode == 0) {
        if (option) {
          getListUser({ role: 'teacher', page: 1, size: 999, departmentId: record?.id }).then(
            res => {
              setListTeacher(res?.data?.result);
            }
          ).catch(err => message.error("Lấy dữ liệu thất bại!"))
          form.setFieldsValue({
            name: record?.name,
            email: record?.email,
            phoneNumber: record?.phoneNumber,
            leader: record?.leader || undefined,
            description: record?.description
          })
        }
      } else {
        if (option) {
          form.setFieldsValue({
            name: record?.name,
            grade: record?.grade,
            departmentId: record?.departmentId,
            description: record?.description
          })
        }
      }
    }
  }

  async function expandTable(expanded, record) {
    setLoadingExpand(true)
    if (!expanded) {
      setExpandedKey([])
      setSubjects([])
      setLoadingExpand(false)
    }
    else if (expanded) {
      setExpandedKey([record?.id])
      await getListSubject({ page: 1, size: 9999, departmentId: record?.id }).then(
        res => {
          setSubjects(res?.data?.result?.map((i, index) => ({ ...i, key: i?.id, number: index + 1 })))
          setLoadingExpand(false)
        }
      ).catch(err => message.error("Lấy dữ liệu môn học thất bại!"))
    }
  }

  useEffect(() => {
    getListDepartment({ page: tableParams?.page, size: tableParams?.size }).then(
      res => {
        setTableParams({
          maxPages: res?.data?.maxPages,
          ...tableParams
        })
        setDepartments(res?.data?.result)
      }
    ).catch(err => console.log(err, 'errr'))
  }, [tableParams?.page, tableParams.size, recall]);

  useEffect(() => {
    getListUser({ role: 'teacher', page: 1, size: 999 }).then(
      res => {
        setFullListTeacher(res?.data?.result);
      }
    ).catch(err => message.error("Lấy dữ liệu thất bại!"))
    getListDepartment({ page: 1, size: 99999 }).then(
      res => {
        setFullDepartment(res?.data?.result)
      }
    ).catch(err => console.log(err, 'errr'))
  }, []);

  async function handleFinish(values) {
    if (modal.mode == 0) {
      if (modal.checkEdit) {
        updateDepartment(idUpdate, values).then(
          res => {
            if (res?.data?.id) {
              message.success("Cập nhật bộ môn thành công!")
              form.resetFields()
              setModal({
                open: false,
                mode: 0,
                checkEdit: false
              })
              setRecall(!recall)
              setTableParams({
                page: 1,
                size: 10,
                maxPages: 1
              })
            } else {
              message.error("Cập nhật bộ môn thất bại!")
            }
          }
        ).catch(err => message.error("Cập nhật bộ môn thất bại! " + err))
      } else {
        createDepartment(values).then(
          res => {
            if (res?.data?.id) {
              message.success("Tạo bộ môn thành công!")
              form.resetFields()
              setModal({
                open: false,
                mode: 0,
                checkEdit: false
              })
              setRecall(!recall)
              setTableParams({
                page: 1,
                size: 10,
                maxPages: 1
              })
            } else {
              message.error("Tạo bộ môn thất bại!")
            }
          }
        ).catch(err => message.error("Tạo bộ môn thất bại! " + err))
      }
    }
    else {
      if (modal.checkEdit) {
        updateSubject(idUpdate, values).then(
          res => {
            if (res?.data?.id) {
              message.success("Cập nhật môn học thành công!")
              form.resetFields()
              setModal({
                open: false,
                mode: 0,
                checkEdit: false
              })
              expandTable(true, { id: values?.departmentId })
            } else {
              message.error("Cập nhật môn học thất bại!")
            }
          }
        ).catch(err => message.error("Cập nhật môn học thất bại! " + err))
      } else {
        createSubject(values).then(
          res => {
            if (res?.data?.id) {
              message.success("Tạo môn học thành công!")
              form.resetFields()
              setModal({
                open: false,
                mode: 0,
                checkEdit: false
              })
              // setExpandedKey(values.departmentId)
              expandTable(true, { id: values?.departmentId })

            } else {
              message.error("Tạo môn học thất bại!")
            }
          }
        ).catch(err => message.error("Tạo môn học thất bại! " + err))
      }
    }
  }
  return (
    <>
      <Modal
        open={modal.open}
        title={modal.mode == 0 ? "Thông tin bộ môn" : "Thông tin môn học"}
        footer={null}
        onCancel={() => {
          setModal({
            open: false,
            checkEdit: false,
            mode: 0
          })
          form.resetFields()
        }}
      >
        <Form
          form={form}
          labelWrap="wrap"
          labelCol={{
            span: 6
          }}
          onFinish={handleFinish}
        >
          {
            modal?.mode === 0 ?
              <>
                <Form.Item name="name" label="Tên bộ môn"
                  rules={[
                    { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
                  ]}
                >
                  <Input placeholder="Nhập tên bộ môn" />
                </Form.Item>
                <Form.Item name="email" label="Email"
                  rules={[
                    { required: true, message: "Đây là trường dữ liệu bắt buộc!" },
                    { type: 'email', message: "Không đúng định dạng email!" }
                  ]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
                <Form.Item name="phoneNumber" label="SĐT"
                  rules={[
                    { required: true, message: "Đây là trường dữ liệu bắt buộc!" },
                    () => ({
                      validator(rule, value) {
                        if (!value || validatePhone(value)) {
                          return Promise.resolve()
                        }
                        return Promise.reject("Số điện thoại không đúng định dạng!")
                      },
                    })
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" className="w-full" />
                </Form.Item>
                {
                  modal.mode == 0 && modal.checkEdit &&
                  <Form.Item name="leader" label="Trưởng bộ môn"
                  >
                    <Select
                      placeholder="-- Chọn --"
                      allowClear
                    >
                      {
                        listTeacher?.map(user => (<>
                          <Select.Option value={user.id} key={user.id}>{user.name}</Select.Option>
                        </>))
                      }
                    </Select>
                  </Form.Item>
                }
                <Form.Item name="description" label="Mô tả"
                  rules={[
                    { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
                  ]}
                >
                  <Input placeholder="Nhập mô tả" />
                </Form.Item>
              </>
              :
              <>
                <Form.Item name="name" label="Tên môn học"
                  rules={[
                    { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
                  ]}
                >
                  <Input placeholder="Nhập tên môn học" />
                </Form.Item>
                <Form.Item name="grade" label="Chọn khối"
                  rules={[
                    { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
                  ]}
                >
                  <Select
                    placeholder="-- Chọn --"
                  >
                    {GRADE?.map((grade) => (
                      <>
                        <Select.Option value={grade.value} key={grade.key}>
                          {grade.label}
                        </Select.Option>
                      </>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="departmentId" label="Chọn bộ môn"
                  rules={[
                    { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
                  ]}
                >
                  <Select
                    placeholder="-- Chọn --"
                    allowClear
                  >
                    {fullDepartment?.map((item) => (
                      <>
                        <Select.Option value={item.id} key={item.id}>
                          {item?.name}
                        </Select.Option>
                      </>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="description" label="Mô tả"
                  rules={[
                    { required: true, message: "Đây là trường dữ liệu bắt buộc!" }
                  ]}
                >
                  <Input placeholder="Nhập mô tả" />
                </Form.Item>
              </>
          }
          <Row gutter={[8, 8]} justify="center">
            <Col>
              <Button type="primary" htmlType="submit">Xác nhận</Button>
            </Col>
            <Col>
              <Button onClick={() => {
                setModal({
                  open: false,
                  checkEdit: false,
                  mode: 0
                })
                form.resetFields()
              }} >Hủy</Button>
            </Col>
          </Row>
        </Form>

      </Modal>
      <Table
        locale={{
          emptyText: <div style={{ marginTop: '20px' }}>{departments?.length === 0 ? <Empty description="Không có dữ liệu!" /> : null}</div>,
        }}
        title={titleTable}
        size="middle"
        style={{
          margin: '20px 0px',
          width: '100%'
        }}
        dataSource={departments?.map(i => ({ ...i, key: i?.id }))}
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
          total: departments?.length,
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
  )
}

DepartmentManage.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default DepartmentManage