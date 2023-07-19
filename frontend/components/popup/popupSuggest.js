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
  Input,
} from "antd";
import { useState } from "react";
import {
  STUDENT_PROPOSAL_TYPE,
  GRADE,
  FORMAT_DATE,
  PROPOSAL_TYPE,
} from "@/common/const";
import {
  ApiClassOfStudent,
  ApiCreateSuggest,
  ApiGetListClassEmpty,
  ApiGetListSubject,
} from "@/api/student";
import dayjs from "dayjs";

const { TextArea } = Input;
export default function PopupStudentSuggest({
  open,
  setOpen,
  info,
  setUpdate,
}) {
  const [form] = Form.useForm();
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classInfo, setClassInfo] = useState({
    start: "",
    end: "",
    room: "",
  });

  const getListSubject = async (value) => {
    const response = await ApiGetListSubject({ grade: value });
    setSubjects([...response.data?.result]);
    form.setFieldsValue({
      ...form.getFieldValue,
      subject: "",
      class: "",
      room: "",
    });
  };

  const getListClass = async (value) => {
    const field = form.getFieldsValue();
    let response = {};
    form.setFieldsValue({
      ...form.getFieldValue,
      class: "",
      room: "",
    });
    if (field.suggestType === PROPOSAL_TYPE.STUDENT_REGISTER_CLASS) {
      response = await ApiGetListClassEmpty({
        subjectId: value,
      });
    } else if (field.suggestType === PROPOSAL_TYPE.STUDENT_TERMINATE_CLASS) {
      response = await ApiClassOfStudent(info.id, {
        subjectId: value,
      });
    }
    setClasses([...response.data]);
  };

  const changeInfoClass = (value) => {
    const field = form.getFieldsValue();

    const classInfo = classes.find((el) => el.classId === value);
    console.log(classInfo);
    setClassInfo(info);
    form.setFieldsValue({
      ...form.getFieldValue,
      room:
        field.suggestType == PROPOSAL_TYPE.STUDENT_REGISTER_CLASS
          ? classInfo?.time_tables[0]?.room_name
          : classInfo?.classes?.timeTables[0]?.room?.name,
    });
  };
  const handleFinish = async (values) => {
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
      setUpdate(true);
      form.resetFields();
    } catch (error) {
      message.error("Tạo đề xuất Thất bại!");
    }
  };

  const handleChaneSuggestType = () => {
    form.setFieldsValue({
      ...form.getFieldValue,
      grade: "",
      subject: "",
      class: "",
      room: "",
    });
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
            <Select
              placeholder="-- Chọn --"
              onChange={() => handleChaneSuggestType()}
            >
              {STUDENT_PROPOSAL_TYPE.map((proposal, index) => (
                <Select.Option value={proposal.value} key={index}>
                  {proposal.label}
                </Select.Option>
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
                <Select.Option value={user.value} key={user.key}>
                  {user.label}
                </Select.Option>
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
                <Select.Option value={subject?.id} key={index}>
                  {subject?.name}
                </Select.Option>
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
                <Select.Option value={subject?.classId} key={index}>
                  {subject?.name || subject?.classes?.name || ""}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
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
                  setOpen(!open);
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
