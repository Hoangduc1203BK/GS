import { getListClass } from '@/api/address';
import LayoutAdmin from '@/components/LayoutAdmin';
import { RetweetOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Row, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react'

function ReportGeneral() {

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
        return <div> {record?.name} </div>;
      },
      align: "center",
    },
    {
      title: "Sỹ số",
      render: (text, record) => {
        return <div> {null} </div>;
      },
      align: "center",
    },
    {
      title: "Số buổi đã học",
      render: (text, record) => {
        return <div> {null} </div>;
      },
      align: "center",
    },
    {
      title: "Ngày bắt đầu",
      render: (text, record) => {
        return <div> {null} </div>;
      },
      align: "center",
    },
    {
      title: "Ngày kết thúc",
      render: (text, record) => {
        return <div> {null} </div>;
      },
      align: "center",
    },
    {
      title: "Tổng học phí",
      render: (text, record) => {
        return <div> {null} </div>;
      },
      align: "center",
    },
    {
      title: "Học phí đã đóng",
      render: (text, record) => {
        return <div> {null} </div>;
      },
      align: "center",
    },
    {
      title: "Lương giáo viên",
      render: (text, record) => {
        return <div> {null} </div>;
      },
      align: "center",
    },
    // {
    //   title: "Thao tác",
    //   render: (text, record) => {
    //     return <div >
    //       <Space size="small">
    //         <Tooltip title="Chi tiết">
    //           <ProfileOutlined style={{
    //             color: "red"
    //           }} className="text-base cursor-pointer"
    //             onClick={() => handleOpenForm(true, true, record)}
    //           />
    //         </Tooltip>
    //         <Tooltip title="Nộp học phí">
    //           <RedEnvelopeOutlined
    //             style={{
    //               color: "green"
    //             }}
    //             className="text-base cursor-pointer"
    //             onClick={() => fee(record)}
    //           />
    //         </Tooltip>
    //       </Space>
    //     </div>;
    //   },
    //   align: "center",
    // },
  ]

  const [listClass, setListClass] = useState([]);
  useEffect(() => {
    getListClass().then(
      res => {
        setListClass(res?.data?.map(i => ({ ...i, key: i?.id, label: i?.name, value: i?.id })));

      }
    ).catch(err => console.log('get list class err' + err))
  }, []);

  return (
    <div>
      <p className='font-semibold text-lg'>Báo cáo tổng quát lớp học</p>
      <Divider />
      <Row gutter={[8, 8]}>
        <Col xs={24} md={12}>
          <Select
            placeholder="-- Chọn --"
            options={listClass}
            className='w-full'
          >
          </Select>
        </Col>
        <Col xs={24} md={12} className='flex gap-3'>
          <Button icon={<RetweetOutlined />}>Hủy</Button>
          <Button icon={<SearchOutlined />} type='primary' >Tìm kiếm</Button>
        </Col>
      </Row>
      <Table
        // locale={{
        //   emptyText: <div style={{ marginTop: '20px' }}>{listStudent?.length === 0 ? <Empty description="Không có dữ liệu!" /> : null}</div>,
        // }}
        // title={titleTable}
        size="middle"
        style={{
          margin: '20px 0px',
          width: '100%'
        }}
        dataSource={[]}
        columns={columns}
        bordered
        // onChange={handleChangeTable}
        pagination={{
          hideOnSinglePage: true,
          locale: { items_per_page: "/ trang" },
          // total: total,
          showTotal: (total, range) => (
            <span>{`${range[0]} - ${range[1]} / ${total}`}</span>
          ),
          // current: tableParams?.page,
          // pageSize: tableParams.size,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          defaultPageSize: 10,
          position: ["bottomRight"],
        }}
      />
    </div>
  )
}


ReportGeneral.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default ReportGeneral