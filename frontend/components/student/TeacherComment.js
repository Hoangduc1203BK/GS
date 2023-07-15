import { ApiClassOfStudent, ApiGetFeedbacks } from "@/api/student";
import { FORMAT_DATE } from "@/common/const";
import { MessageOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Select, Table, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function TeacherComment({info}) {
  const [form] = Form.useForm();

  const [feedbacks, setFeedback] = useState([])
  const [classes, setClasses] = useState([])
  const [isFetching, setFetching] = useState(false)


  useEffect(()=>{
    fetchFeedbacks();
    fetchListClass()
  },[])

  const fetchListClass = async () => {
    const res = await  ApiClassOfStudent(info?.id);
    setClasses([...res.data])
    console.log(res.data);
  }

  const fetchFeedbacks = async (classId) => {
    try {
      setFetching(true)
      const params = {
        to: info?.id,
        classId
      }
      const res = await ApiGetFeedbacks(params);
      setFeedback(res.data);
      setFetching(false)

    } catch (error) {
      message.error("Xem lịch sử nhận xét thất bại! Vui lòng thử lại");
      setFetching(false)
    }
  }

  const submitSearch = (values) => {
    fetchFeedbacks(values.classId);
  };


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
      <Form form={form} onFinish={submitSearch}>
        <Row>
          <Col xs={24} lg={16} className="flex gap-5">
            <Form.Item name="classId" label="Loại đề xuất" className="w-full">
              <Select placeholder="-- Chọn --">
                  <Select.Option value="">
                    -- Chọn --
                  </Select.Option>
                {classes.map((info, index) => (
                  <Select.Option value={info?.classId} key={index}>
                    {info?.classes.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Button type="primary" className="ml-5" htmlType="submit">
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Form>
      <Table
        size="middle"
        dataSource={feedbacks?.map((x) => ({ ...x, key: x?.classroom }))}
        columns={columns}
        bordered
        scroll={{ x: 1000 }}
        pagination={null}
        loading={isFetching}
      />
      ;
    </div>
  );
}
