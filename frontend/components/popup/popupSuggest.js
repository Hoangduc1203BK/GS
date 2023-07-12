import {
  Button,
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Select,
  TimePicker,
  message,
} from "antd";
import { Input } from "antd";
import { useState } from "react";
import { SUTDENT_PROPOSAL_TYPE, GRADE, FORMAT_DATE } from "@/common/const";
import {
  ApiCreateSuggest,
  ApiGetListClassEmpty,
  ApiGetListSubject,
} from "@/api/student";
import dayjs from "dayjs";

const { TextArea } = Input;
export default function PopupStudentSuggest({ open, setOpen, info }) {
  const [form] = Form.useForm();
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classInfo, setClassInfo] = useState({
    start: "",
    end: "",
    room: "",
  });

  const handleOk = () => {
    setOpen(!open);
  };

  const handleCancel = () => {
    setOpen(!open);
  };

  const getListSubject = async (value) => {
    const response = await ApiGetListSubject({ grade: value });
    setSubjects([...response.data?.result]);
  };

  const getListClass = async (value) => {
    console.log(value);
    const response = await ApiGetListClassEmpty({
      subjectId: value,
    });
    console.log(response);
    setClasses([...response.data]);
  };

  const changeInfoClass = (value) => {
    const timeTables = classes.find((el) => el.id === value)?.time_tables;
    const info = {
      room: timeTables[0]?.room_name,
    };
    setClassInfo(info);
    form.setFieldsValue({
      ...form.getFieldValue,
      room: info.room,
    });
  };
  const handleFinish = async (values) => {
    console.log(dayjs(new Date()).format(FORMAT_DATE.YYYYMMDD));
    const payload = {
      userId: info?.id,
      description: values.note,
      type: values.suggestType,
      time: dayjs(new Date()).format(FORMAT_DATE.YYYYMMDD),
      subData: {
        classId: values.class,
      },
    };
    try {
      await ApiCreateSuggest(payload);
      message.success("Tạo đề xuất thành công!");
      setOpen(!open);
    } catch (error) {
      message.error("Tạo đề xuất Thất bại!");
    }
  };

  return (
    <>
      <Modal
        title="Học phí"
        open={open}
        width={800}
        footer={null}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          labelAlign="left"
          labelCol={{ span: 6 }}
          onFinish={handleFinish}
        >
          <Form.Item
            initialValue={info?.id}
            name="id"
            label="Mã học sinh"
            rules={[
              { required: true, message: "Đây là trường dữ liệu bắt buộc!" },
            ]}
          >
            <Input type="text" readOnly></Input>
          </Form.Item>
          <Form.Item
            initialValue={info?.name}
            name="name"
            label="Họ và tên"
            rules={[
              { required: true, message: "Đây là trường dữ liệu bắt buộc!" },
            ]}
          >
            <Input type="text" readOnly></Input>
          </Form.Item>
          <Form.Item
            name="suggestType"
            label="Loại đề xuất"
            rules={[
              { required: true, message: "Đây là trường dữ liệu bắt buộc!" },
            ]}
          >
            <Select placeholder="-- Chọn --">
              {SUTDENT_PROPOSAL_TYPE.map((proposal, index) => (
                <>
                  <Select.Option value={proposal.value} key={index}>
                    {proposal.label}
                  </Select.Option>
                </>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="grade"
            label="Khối"
            rules={[
              { required: true, message: "Đây là trường dữ liệu bắt buộc!" },
            ]}
          >
            <Select placeholder="-- Chọn --" onChange={getListSubject}>
              {GRADE?.map((user) => (
                <>
                  <Select.Option value={user.value} key={user.key}>
                    {user.label}
                  </Select.Option>
                </>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="subject"
            label="Môn"
            rules={[
              { required: true, message: "Đây là trường dữ liệu bắt buộc!" },
            ]}
          >
            <Select placeholder="-- Chọn --" onChange={getListClass}>
              {subjects?.map((subject, index) => (
                <>
                  <Select.Option value={subject?.id} key={index}>
                    {subject?.name}
                  </Select.Option>
                </>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="class"
            label="Lớp"
            rules={[
              { required: true, message: "Đây là trường dữ liệu bắt buộc!" },
            ]}
          >
            <Select placeholder="-- Chọn --" onChange={changeInfoClass}>
              {classes?.map((subject, index) => (
                <>
                  <Select.Option value={subject?.id} key={index}>
                    {subject?.name}
                  </Select.Option>
                </>
              ))}
            </Select>
          </Form.Item>
          {/* <Form.Item name="start" label="Giờ bắt đâu">
            <TimePicker
              placeholder="--:--"
              format="HH:mm"
              style={{ width: "100%" }}
              readOnly
            />
          </Form.Item>
          <Form.Item name="end" label="Giờ kết thúc">
            <TimePicker
              placeholder="--:--"
              format="HH:mm"
              style={{ width: "100%" }}
              readOnly
            />
          </Form.Item> */}
          <Form.Item
            name="room"
            label="Phòng học"
            rules={[
              { required: true, message: "Đây là trường dữ liệu bắt buộc!" },
            ]}
          >
            <Input type="text" readOnly></Input>
          </Form.Item>
          <Form.Item
            name="note"
            label="Ghi chú"
            rules={[
              { required: true, message: "Đây là trường dữ liệu bắt buộc!" },
            ]}
          >
            <Input.TextArea type="text" rows={4}></Input.TextArea>
          </Form.Item>
          <Row gutter={[8, 8]} justify="center">
            <Col>
              <Button
                onClick={() => {
                  setModal({
                    open: false,
                    mode: 1,
                  });
                  form.resetFields();
                }}
              >
                Đóng
              </Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Xác nhận
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
