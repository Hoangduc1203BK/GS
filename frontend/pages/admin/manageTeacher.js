import { getListDepartment, getListUser } from "@/api/address";
import AddEditTs from "@/components/AddEditTS";
import LayoutAdmin from "@/components/LayoutAdmin";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Empty, Space, Table, Tooltip } from "antd";
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
        return <div> {record?.birthDay} </div>;
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
        return <div> {record?.teacher_school} </div>;
      },
      align: "center",
    },
    {
      title: "Thao tác",
      render: (text, record) => {
        return <div >
          <Space size="small">
            <Tooltip title="Chỉnh sửa">
              {/* <GroupOutlined style={{
                color: "#b9db84"
              }} className="text-base cursor-pointer"
                onClick={() => showModal(0, true, true, record)}
              /> */}
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

  function handleChangeTable(pag) {
    setTableParams({
      page: pag.current,
      size: pag.pageSize
    })
  }

  useEffect(() => {
    getListUser({ role: 'teacher', page: tableParams.page, size: tableParams.size }).then(
      res => {
        setListTeacher(res?.data?.result);
        setTotal(res?.data?.perPage * res?.data?.maxPages)
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
  return (
    <>
      <p className="font-medium text-lg mb-4">Danh sách giáo viên</p>
      <div className="text-right">
        <Button type="primary" icon={<PlusCircleOutlined />}>Thêm mới giáo viên</Button>
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
      <AddEditTs dataMe={listTeacher[0]} />
    </>
  )
}

ManageTeacher.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default ManageTeacher