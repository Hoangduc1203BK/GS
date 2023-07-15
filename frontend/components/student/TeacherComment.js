import { FORMAT_DATE } from "@/common/const";
import { MessageOutlined } from "@ant-design/icons";
import { Table } from "antd";
import dayjs from "dayjs";

export default function TeacherComment({}) {

  const columns = [
    {
      title: "STT",
      render: (text, record, index) => {
        return <div>{index + 1}</div>;
      },
      align: "center",
    },
    {
      title: "Tên lớp",
      dataIndex: "className",
      key: "className",
    },
    {
      title: "Người gửi",
      dataIndex: "fromUser",
      key: "fromUser",
    },
    {
      title: "Ngày",
      render: (text, record, index) => {
        return <div>{dayjs(record?.createAt).format(FORMAT_DATE.ddmmyyyy)}</div>;
      },
    },
    {
      title: "Nội dung",
      dataIndex: "feedback",
      key: "feedback",
    },
  ];

  return (
    <div>
      <div className="text-2xl font-bold mt-1 mb-5">
        <MessageOutlined /> Nhận xét của giáo viên
      </div>
      <Table
        size="middle"
        dataSource={dataSource?.map((x) => ({ ...x, key: x?.classroom }))}
        columns={columns}
        bordered
        scroll={{ x: 1000 }}
        pagination={{
          locale: { items_per_page: "/ trang" },
          // total: listResult?.length,
          showTotal: (total, range) => (
            <span>{`${range[0]} - ${range[1]} / ${total}`}</span>
          ),
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          defaultPageSize: 10,
          position: ["bottomRight"],
        }}
      />
      ;
    </div>
  );
}
