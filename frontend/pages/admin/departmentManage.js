import { getListDepartment, getListSubject } from "@/api/address";
import LayoutAdmin from "@/components/LayoutAdmin";
import { EditOutlined } from "@ant-design/icons";
import { Button, Col, Empty, Modal, Row, Space, Table, Tooltip, message } from "antd";
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
        return <div> {record?.leader} </div>;
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
            {/* <Tooltip title="Chi tiết">
              <EyeOutlined style={{
                color: "#b9db84"
              }} className="text-base cursor-pointer" />
            </Tooltip> */}
            <Tooltip title="Lịch sử điểm danh">
              {/* <SnippetsOutlined
                onClick={() => watchHistory(record)}
                style={{
                  color: "#fc4a6c"
                }} className="text-base cursor-pointer" /> */}
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
        render: (record) => <div>Khối {record?.grade}</div>,
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
        render: () => (
          <Space size="middle">
            <Tooltip title="Chỉnh sửa">
              <EditOutlined style={{
                fontSize: '18px',
                color: 'red',
                cursor: 'pointer'
              }} />
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

  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loadingExpand, setLoadingExpand] = useState(false);
  const [expandedKey, setExpandedKey] = useState([]);
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

  function showModal(mode, option, open) {
    setModal({
      open: open,
      checkEdit: option,
      mode: mode
    })
  }

  async function expandTable(expanded, record) {
    setLoadingExpand(true)
    if (!expanded) {
      setExpandedKey([])
      setSubjects([])
      setLoadingExpand(false)
    }
    else if (expanded && expandedKey != record.id) {
      setExpandedKey([record?.key])
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
  }, [tableParams?.page, tableParams.size]);


  const titleTable = () => (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={12}>
          <p className="font-medium text-lg mb-4">Danh sách bộ môn</p>
        </Col>
        <Col xs={12} className="w-full flex gap-2 justify-end !text-right">
          <Button type="primary" style={{
            backgroundColor: 'purple'
          }}>Tạo bộ môn</Button>
          <Button type="primary" onClick={() => showModal(0, false, true)}>Tạo môn học</Button>
        </Col>
      </Row>
    </>
  )

  return (
    <>
      <Modal
        open={modal.open}
        title={modal.mode}
      ></Modal>
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