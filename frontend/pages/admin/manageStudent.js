import { getListDepartment, getListUser } from "@/api/address";
import AddEditTs from "@/components/AddEditTS";
import LayoutAdmin from "@/components/LayoutAdmin";
import { PlusCircleOutlined, ProfileOutlined } from "@ant-design/icons";
import { Button, Empty, Space, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const ManageStudent = () => {

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
        return <div>Khối {record?.grade || "..."} </div>;
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
          </Space>
        </div>;
      },
      align: "center",
    },
  ]
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
    getListUser({ role: 'user', page: tableParams.page, size: tableParams.size }).then(
      res => {
        setListStudent(res?.data?.result);
        setTotal(res?.data?.perPage * res?.data?.maxPages)
      }
    ).catch(err => message.error("Lấy dữ liệu thất bại!"))
  }, [tableParams, recall]);

  return (
    <>
      {
        check.open ? <AddEditTs dataEdit={dataEdit} checkEdit={check.checkEdit} mode={2} handleOpenForm={handleOpenForm} />
          :
          <>
            <p className="font-medium text-lg mb-4">Danh sách học sinh</p>
            <div className="text-right">
              <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => handleOpenForm(true, false)}>Thêm mới học sinh</Button>
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