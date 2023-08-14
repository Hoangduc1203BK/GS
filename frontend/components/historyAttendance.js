import { getAttendance } from "@/api/address";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Avatar, Button, Col, Empty, List, Modal, Row, Table } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

const HistoryAttendance = ({ dataAttendance, listTeacher }) => {
  const [detailAttend, setDetailAttend] = useState([]);
  const [modal, setModal] = useState(false);

  async function detailAttendance(record) {
    await getAttendance({ classId: record?.class_id, date: record?.date, day: record?.day }).then(
      res => {
        setDetailAttend(res?.data?.students)
        setModal(true)
      }
    ).catch(err => message.error('Lấy dữ liệu chi tiết điểm danh không thành công!'))
  }

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
  )
}

export default HistoryAttendance