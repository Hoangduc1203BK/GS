import { getBills, getOneBill } from '@/api/address';
import { formatVND } from '@/common/util';
import { CheckCircleOutlined, DollarOutlined, SyncOutlined } from '@ant-design/icons';
import { Table, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'

function HistoryBill({ info }) {
  const [listBills, setListBills] = useState([]);
  useEffect(() => {
    if (info.id) {
      getBills(info.id).then(
        res => {
          setListBills(res?.data)
        }
      ).catch(err => console.log(err, 'errrr'))
    }
  }, [info]);
  const [loadingExpand, setLoadingExpand] = useState(false);

  const expandedRowRender = () => {
    const columnsFee = [
      {
        title: "Trạng thái",
        render: (text, record) => {
          return <div>{<Tag color={record.status ? "green" : "blue"} icon={record.status ? <CheckCircleOutlined /> : <SyncOutlined spin />}>{record.status ? "Đã thanh toán" : "Chờ thanh toán"}</Tag>}</div>;
        },
      },
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
        title: "Buổi học",
        render: (text, record, index) => {
          return <div>{record.numberOfStudy}</div>;
        },
      },
      {
        title: "Học phí",
        render: (text, record, index) => {
          return <div>{formatVND(+record?.fee)}</div>;
        },
      }, {
        title: "Tổng tiền",
        render: (text, record, index) => {
          return <div>{formatVND(+record?.total)}</div>;
        },
      },
    ];

    return (
      <Table
        columns={columnsFee}
        dataSource={dataBill}
        pagination={false}
        loading={loadingExpand}
      />
    );
  };

  const columns = [
    {
      title: "STT",
      render: (text, record, index) => {
        return <div>{index + 1}</div>;
      },
    },
    {
      title: "Mã thanh toán",
      render: (text, record, index) => {
        return <div>{record.id}</div>;
      },
    },
    {
      title: "Ngày thanh toán",
      render: (text, record, index) => {
        return <div>{record.day && dayjs(record.day).format('DD/MM/YYYY')}</div>;
      },
    },
    {
      title: "Tổng học phí đã thanh toán",
      render: (text, record, index) => {
        return <div>{formatVND(record?.total)}</div>;
      },
    },
    {
      title: "Ghi chú",
      render: (text, record, index) => {
        return <div>{record.description}</div>;
      },
    },
  ];
  const [expandedKey, setExpandedKey] = useState([]);
  const [dataBill, setDataBill] = useState([]);
  async function expandTable(expanded, record) {
    setLoadingExpand(true)
    if (!expanded) {
      setExpandedKey([])
      setDataBill([])
      setLoadingExpand(false)
    }
    else if (expanded && expandedKey != record.id) {
      setExpandedKey([record?.key])
      const params = {
        userId: record?.userId,
        month: (dayjs(record?.day).month() + 1).toString().padStart(2, '0')
      }
      await getOneBill(params).then(
        res => {
          setDataBill(res?.data?.subBills?.map(el => ({ ...el, key: el?.id })))
          setLoadingExpand(false)
        }
      ).catch(err => message.error("Lấy dữ liệu học phí thất bại!"))
    }
  }
  return (
    <div>
      <div className="text-2xl font-bold mt-1 mb-5">
        <DollarOutlined style={{ color: "gold" }} /> Danh sách học phí
      </div>
      <Table
        size="middle"
        dataSource={listBills?.map((x) => ({ ...x, key: x.id }))}
        columns={columns}
        expandable={{
          expandedRowKeys: expandedKey,
          expandedRowRender,
          onExpand: expandTable,
        }}
        bordered
        scroll={{ x: 1000 }}
        pagination={false}
      // loading={isFetchClass}
      />
    </div>
  )
}

export default HistoryBill