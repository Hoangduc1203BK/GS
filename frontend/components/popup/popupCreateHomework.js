import { ApiCreateHomework, ApiUpdateHomework } from "@/api/student";
import { disabledDate } from "@/common/util";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  message,
  Input,
  DatePicker,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

const { TextArea } = Input;
export default function PopupCreateHomework({
  open,
  setOpen,
  detail,
  classId,
}) {
  const [form] = Form.useForm();

  useEffect(()=> {
    if(open){
    form.setFieldsValue({
      classId: classId,
    })
    }
  },[open])


  useEffect(() => {
    if (open && detail?.id) {
      const date = dayjs(detail.deadline);
      form.setFieldsValue({
        time: date,
        date: date,
        description: detail.description,
        title: detail.title,
      });
    }
  }, [open]);

  const handleFinish = async (values) => {
    try {
      let timeV = `${dayjs(values.time)
        .hour()
        .toString()
        .padStart(2, "0")}:${dayjs(values.time)
        .minute()
        .toString()
        .padStart(2, "0")}`;
      let dateV = dayjs(values.date).format("YYYY-MM-DD");
      const payload = {
        deadline: `${dateV} ${timeV}`,
        title: values.title,
        description: values.description,
        classId: classId,
      };
      if (detail?.id) {
        delete payload.classId;
        await ApiUpdateHomework(detail?.id,payload);
      } else {
        await ApiCreateHomework(payload);
      }
      setOpen(!open);
      form.resetFields();
      message.success("Viết bài tập học sinh thành công!");
    } catch (error) {
      console.log(error);
      message.error("Viết bài tập thất bại! Vui lòng thử lại");
    }
  };

  return (
    <>
      <Modal
        title="Nhận xét học sinh"
        open={open}
        footer={null}
        width={800}
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
            name="classId"
            label="Mã lớp"
            rules={[
              { required: true, message: "Đây là trường dữ liệu bắt buộc!" },
            ]}
          >
            <Input type="text" readOnly></Input>
          </Form.Item>
          <Form.Item
            label="Thời gian kết thúc nộp bài"
            name="time"
            rules={[
              { required: true, message: "Đây là trường dữ liệu bắt buộc!" },
            ]}
          >
            <TimePicker
              format="HH:mm"
              placeholder="--:--"
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item
            label="Ngày kết thúc nộp bài"
            name="date"
            rules={[
              { required: true, message: "Đây là trường dữ liệu bắt buộc!" },
            ]}
          >
            <DatePicker
              placeholder="-- Chọn --"
              style={{
                width: "100%",
              }}
              format="YYYY-MM-DD"
              disabledDate={disabledDate}
            />
          </Form.Item>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              { required: true, message: "Đây là trường dữ liệu bắt buộc!" },
            ]}
          >
            <Input type="text"></Input>
          </Form.Item>

          <Form.Item
            name="description"
            label="Nội dung"
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
