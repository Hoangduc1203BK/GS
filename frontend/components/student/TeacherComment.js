import { MessageOutlined } from "@ant-design/icons";
import { Table } from "antd";

export default function TeacherComment({}) {
  const dataSource = [
    {
      subject: "Toán",
      comment: "Có tuy duy tốt về hình học, cần phát huy thêm",
      teacher: "Lê Văn t",
    },
    {
      subject: "Văn",
      comment: "Có tuy duy tốt về hình học, cần phát huy thêm",
      teacher: "Lê Văn t",
    },
  ];

  const columns = [
    {
      title: "Môn",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Người nhận xét",
      dataIndex: "teacher",
      key: "teacher",
    },
    {
      title: "Nhận xét của giáo viên",
      dataIndex: "comment",
      key: "comment",
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
