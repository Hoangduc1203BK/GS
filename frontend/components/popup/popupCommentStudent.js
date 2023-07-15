import { ApiCreateFeedback } from "@/api/student";
import { Button, Col, Form, Modal, Row, message, Input } from "antd";

const { TextArea } = Input;
export default function PopupCommentStudent({ open, setOpen, info, student, classId }) {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      const payload = {
        from:  info?.id,
        to: student?.id,
        type: "teacher",
        feedback: values.feedback,
        classId : classId[0]
      };
      await ApiCreateFeedback(payload);
      setOpen(!open);
      form.resetFields()
      message.success("Nhận xét học sinh thành công!");
    } catch (error) {
      console.log(error);
      message.error("Nhận xét thất bại! Vui lòng thử lại");
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
            initialValue={student?.id}
            name="id"
            label="Mã học sinh"
            rules={[
              { required: true, message: "Đây là trường dữ liệu bắt buộc!" },
            ]}
          >
            <Input type="text" readOnly></Input>
          </Form.Item>
          <Form.Item
            initialValue={student?.name}
            name="name"
            label="Họ và tên"
            rules={[
              { required: true, message: "Đây là trường dữ liệu bắt buộc!" },
            ]}
          >
            <Input type="text" readOnly></Input>
          </Form.Item>

          <Form.Item
            name="feedback"
            label="Nhận xét"
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
