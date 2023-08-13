import { getListClass, getStatistic } from '@/api/address';
import { MONTH } from '@/common/const';
import { formatVND, removeVietnameseTones } from '@/common/util';
import LayoutAdmin from '@/components/LayoutAdmin';
import { RetweetOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Empty, Input, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
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
      title: "Số buổi đã học",
      render: (text, record) => {
        return <div> {record?.numberOfStudy} </div>;
      },
      align: "center",
    },
    {
      title: "Ngày kết thúc",
      render: (text, record) => {
        return <div> {record?.endDate && dayjs(record?.endDate).format("DD/MM/YYYY")} </div>;
      },
      align: "center",
    },
    {
      title: "Tổng học phí",
      render: (text, record) => {
        return <div> {formatVND(+record?.totalFee)}</div>;
      },
      align: "center",
    },
    {
      title: "Học phí đã đóng",
      render: (text, record) => {
        return <div> {formatVND(+record?.totalDone)} </div>;
      },
      align: "center",
    },
    {
      title: "Lương giáo viên",
      render: (text, record) => {
        return <div> {formatVND(+record?.teacherSalary)} </div>;
      },
      align: "center",
    },
  ]

  const [listStatistics, setListStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterClass, setFilterClass] = useState("");
  const [valueMonth, setValueMonth] = useState((dayjs().month() + 1).toString().padStart(2, '0'));

  useEffect(() => {
    setLoading(true)
    getStatistic({ month: valueMonth }).then(
      res => {
        setListStatistics(res?.data)
        setLoading(false)
      }
    ).catch(err => console.log('get list statistic err' + err))
  }, [valueMonth]);

  function handleChangeInput(e) {
    setFilterClass(e.target.value)
  }

  return (
    <div>
      <p className='font-semibold text-lg'>Báo cáo tổng quát lớp học</p>
      <Divider />
      <Row gutter={[8, 8]}>
        <Col xs={24} md={8}>
          <Select
            className='!w-full'
            placeholder="-- Chọn tháng --"
            value={valueMonth}
            onChange={(value) => {
              console.log(value, 'valueee')
              setValueMonth(value)
            }}
          >
            {
              MONTH?.map(el => (
                <>
                  <Select.Option disabled={+el.key > +dayjs().month().toString().padStart(2, '0')} value={el.value.toString().padStart(2, '0')} key={el.key}>{el.label}</Select.Option>
                </>
              ))
            }
          </Select>
        </Col>
        <Col xs={24} md={8}>
          <Input
            placeholder="-- Nhập tên lớp--"
            className='w-full'
            onChange={handleChangeInput}
            disabled={listStatistics?.length === 0}
          />
        </Col>
      </Row>
      <Table
        locale={{
          emptyText: <div style={{ marginTop: '20px' }}>{listStatistics?.length === 0 ? <Empty description="Không có dữ liệu!" /> : null}</div>,
        }}
        loading={loading}
        size="middle"
        style={{
          margin: '20px 0px',
          width: '100%'
        }}
        dataSource={listStatistics?.filter(e => removeVietnameseTones(e?.name?.toLowerCase()).includes(removeVietnameseTones(filterClass?.toLowerCase())))?.map(i => ({ ...i, key: i?.id }))}
        columns={columns}
        bordered
        pagination={{
          hideOnSinglePage: true,
          locale: { items_per_page: "/ trang" },
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
  )
}


ReportGeneral.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default ReportGeneral