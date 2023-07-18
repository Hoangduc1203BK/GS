import { ApiUpdateSubAssignments } from "@/api/student";
import { Button, Col, Form, Modal, Row, message, Input, Select } from "antd";

const { TextArea } = Input;
export default function PopupCheckPoint({ open, setOpen, assigment }) {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      await ApiUpdateSubAssignments(assigment.id, { point: values.point });
      setOpen(!open);
      form.resetFields();
      message.success("Chấm điểm thành công!");
    } catch (error) {
      console.log(error);
      message.error("Chấm điểm thất bại! Vui lòng thử lại");
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
            initialValue={assigment?.student}
            name="name"
            label="Họ và tên"
            rules={[
              { required: true, message: "Đây là trường dữ liệu bắt buộc!" },
            ]}
          >
            <Input type="text" readOnly></Input>
          </Form.Item>
          <Row className="h-[32px] flex items-center mb-[24px]">
            <Col xs={6} className="required-cus">
              <label>Bài làm:</label>
            </Col>
            <Col>
              <label>
                {" "}
                <a href={assigment?.file} target="_blank" className="cursor-pointer">
                  {assigment?.file}
                </a>
              </label>
            </Col>
          </Row>
          <Form.Item
            name="point"
            label="Điểm"
            rules={[
              { required: true, message: "Đây là trường dữ liệu bắt buộc!" },
            ]}
          >
            <Select placeholder="--Chọn--">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((el) => (
                <Select.Option value={el} key={el}>
                  {el}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="feedback" label="Nhận xét">
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
