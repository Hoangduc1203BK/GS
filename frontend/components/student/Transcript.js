import { DatabaseFilled } from "@ant-design/icons";
import { Table } from "antd";

export default function Transcript({}) {
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "Tháng",
      render: (text, record, index) => {
        return <div>{index + 1}</div>;
      },
    },
    {
      title: "Toán",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Văn",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Anh",
      dataIndex: "address",
      key: "address",
    },
  ];

  return (
    <div>
      <div className="text-2xl font-bold mt-1 mb-5">
        <DatabaseFilled /> Bài tập
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
