"use client"

import LayoutAdmin from "@/components/LayoutAdmin";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Table, Tooltip } from "antd";

const ResultExam = () => {

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
        return <div>{null}</div>;
      },
      align: "center",
    },
    {
      title: "Họ và tên",
      render: (text, record) => {
        return <div>{null}</div>;
      },
      align: "center",
    },
    {
      title: "SĐT",
      render: (text, record) => {
        return <div>{null}</div>;
      },
      align: "center",
    },
    {
      title: "Lớp",
      render: (text, record) => {
        return <div>{null}</div>;
      },
      align: "center",
    },
    {
      title: "Môn",
      render: (text, record) => {
        return <div>{null}</div>;
      },
      align: "center",
    },
    {
      title: "Điểm thi",
      render: (text, record) => {
        return <div >{record?.note}</div>;
      },
      align: "center",
    },
    {
      title: "Thao tác",
      render: (text, record) => {
        return <div >
          <Space size="small">
            <Tooltip title="Chỉnh sửa">
              {/* <EditOutlined style={{
                color: "#b9db84"
              }} className="text-base cursor-pointer" /> */}
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

  return (
    <>
      <p className="font-bold mb-2">Danh sách kết quả thi đầu vào</p>
      <Row gutter={[8, 8]}>
        <Col xs={24} lg={12}></Col>
        <Col xs={24} lg={12} className="text-right">
          <Button type="primary" className="mr-2" style={{
            backgroundColor: '#F59A23'
          }}>Chuyển</Button>
          <Button type="primary">Cập nhật điểm thi</Button>
        </Col>
      </Row>

      <Table
        // locale={{
        //                     emptyText: <div style={{ marginTop: '20px' }}>{loading ? null : listResult.length === 0 ? "Sinh viên chưa đăng ký HP nào trong kỳ này!" : null}</div>,
        //                 }}
        // rowSelection={{
        //     type: 'checkbox',
        //     selectedRowKeys: idSelect,
        //     onChange: (selectedRowKeys, selectedRows) => {
        //         setIdSelect(selectedRowKeys)
        //         // setRecordSelect(selectedRows)
        //     }
        // }}
        size="middle"
        style={{
          marginTop: '10px',
          width: '100%'
        }}
        dataSource={[{}]}
        columns={columns}
        bordered
        // scroll={{ x: 700 }}
        pagination={{
          locale: { items_per_page: "/ trang" },
          // total: data?.subject?.length,
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



ResultExam.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default ResultExam