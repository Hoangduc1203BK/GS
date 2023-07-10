import LayoutAdmin from "@/components/LayoutAdmin";
import PopupStudentSuggest from "@/components/popup/popupSuggest";

import { Button, Col, Form, Input, Row, Table } from "antd";
import { useState } from "react";

const SutdentSuggest = ({user}) => {
  const [form] = Form.useForm();

  const [idSelect, setIdSelect] = useState('10');
  const [pageSize, setPageSize] = useState('');
  const [openSuggest, setOpenSuggest] = useState(false)
  const [page, setPage] = useState([]);

  const submitSearch = (values) => {
    console.log(user, "valuesss");
  };
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
        title: "STT",
        render: (text, record, index) => {
          return <div>{index + 1}</div>;
        },
      },
    {
      title: "Mã học sinh",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Môn đề xuất",
      dataIndex: "suggest",
      key: "suggest",
    },
    {
      title: "nội dung",
      dataIndex: "content",
      key: "content",
    },
    {
        title: "Loại đề xuất",
        dataIndex: "suggestType",
        key: "suggestType",
      },
      {
        title: "Phản hồi ",
        dataIndex: "feedback",
        key: "feedback",
      },
  ];

  return (
    <div>
      <PopupStudentSuggest open={openSuggest} setOpen={setOpenSuggest} info={user} />
      <Form form={form} onFinish={submitSearch}>
        <Row>
          <Col xs={24} lg={8}>
            <Form.Item name="name">
              <Input placeholder="Tìm kiếm theo tên..." />
            </Form.Item>
          </Col>
          <Col xs={24} lg={16} >
            <Button type="primary" className="ml-10" htmlType="submit">
              Tìm kiếm
            </Button>

            <Button type="primary" onClick={()=> setOpenSuggest(true)} className="ml-10" htmlType="submit">
              Thêm đề xuất
            </Button>
          </Col>
        </Row>
      </Form>
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
          // onChange:(page, pageSize)=>{
          //   setPageSize(pageSize),
          //   setPage(page)
          // },
          // total:100,
          // showSizeChanger: true,
          
          pageSize:pageSize,
          pageSizeOptions: ["10", "20", "50"],
          defaultPageSize: 10,
          position: ["bottomRight"],
        }}
      />
      ;
    </div>
  );
};

SutdentSuggest.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default SutdentSuggest;
