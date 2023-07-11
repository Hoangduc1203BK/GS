import { getListClass } from "@/api/address";
import LayoutAdmin from "@/components/LayoutAdmin";
import { DeleteOutlined, EditOutlined, EyeOutlined, HistoryOutlined, ProfileOutlined } from "@ant-design/icons";
import { Button, Col, Empty, Input, Row, Space, Table, Tabs, Tooltip } from "antd";
import { useEffect, useState } from "react";

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
        return <div>{record?.teacher}</div>;
      },
      align: "center",
    },
    {
      title: "Môn",
      render: (text, record) => {
        return <div>{record?.subject_id}</div>;
      },
      align: "center",
    },
    {
      title: "Khối",
      render: (text, record) => {
        return <div>{record?.grade}</div>;
      },
      align: "center",
    },
    {
      title: "Lịch học",
      render: (text, record) => {
        return <div className="text-left">{record?.time_tables?.map(item => (`Thứ ${item?.date} ( ${item?.start} : ${item?.end} ) - ${item?.room_name}`))}</div>;
      },
      align: "center",
    },
    {
      title: "Sỹ số",
      render: (text, record) => {
        return <div>{record?.number_student}</div>;
      },
      align: "center",
    },
    {
      title: "Thao tác",
      render: (text, record) => {
        return <div >
          <Space size="small">
            <Tooltip title="Chi tiết">
              <EyeOutlined style={{
                color: "#b9db84"
              }} className="text-base cursor-pointer" />
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

  const [listClass, setListClass] = useState([]);
  const [recall, setRecall] = useState(false);

  useEffect(() => {
    getListClass().then(
      res => {
        setListClass(res?.data);
      }
    ).catch(err => console.log('get list class err' + err))
  }, [recall]);

  return (
    <>
      <Tabs
        // onChange={handleChangeTab}
        defaultActiveKey="1"
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
              <p className="font-medium">Thông tin lớp học</p>
              <Row gutter={[8, 8]}>
                <Col xs={24} md={12}>
                  <Input placeholder="Nhập tên lớp" />
                </Col>
                <Col xs={24} md={12} className="flex gap-2">
                  <Button type="primary">Tìm kiếm</Button>
                  <Button>Đặt lại</Button>
                </Col>
              </Row>
              <Table
                locale={{
                  emptyText: <div style={{ marginTop: '20px' }}>{listClass?.length === 0 ? <Empty description="Không có dữ liệu!" /> : null}</div>,
                }}
                size="middle"
                style={{
                  margin: '20px 0px',
                  width: '100%'
                }}
                dataSource={listClass?.map(i => ({ ...i, key: i?.id }))}
                columns={columns}
                bordered
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
            children: <>tab 2</>
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