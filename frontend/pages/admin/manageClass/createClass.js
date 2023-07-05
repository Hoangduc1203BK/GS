"use client";

import LayoutAdmin from "@/components/LayoutAdmin";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space, Table, TimePicker } from "antd";

const CreateClass = () => {
  const [form] = Form.useForm()
  return (
    <>
      <div className="border-2 h-full">
        <div className="!bg-blue-700 p-2 text-white">
          Thêm mới lớp học
        </div>
        <Row className="px-4 pt-4">
          <Col xs={12} className="px-2">
            <div className="border-2 py-2 px-4">
              Thông tin lớp học
            </div>
          </Col>
          <Col xs={12} className="px-2">
            <div className="border-2 py-2 px-4">
              Lớp học mới
            </div>
          </Col>
        </Row>
        <Row className="px-4 pb-4">
          <Col xs={12} className="px-2">
            <div className="border-2 border-t-0 py-2 px-4">
              <Form
                form={form}
                layout="vertical"
              >
                <Form.Item label="Môn">
                  <Select placeholder="-- Chọn --">
                    <Select.Option value="0">
                      Môn 1
                    </Select.Option>
                    <Select.Option value="1">
                      Môn 2
                    </Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Lớp">
                  <Select placeholder="-- Chọn --">
                    <Select.Option value="0">
                      Lớp 1
                    </Select.Option>
                    <Select.Option value="1">
                      Lớp 2
                    </Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Giáo viên dạy">
                  <Select placeholder="-- Chọn --">
                    <Select.Option value="0">
                      GV 1
                    </Select.Option>
                    <Select.Option value="1">
                      GV 2
                    </Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Sỹ số">
                  <InputNumber min={1} style={{
                    width: '100%'
                  }} />
                </Form.Item>
                <Form.Item label="Học phí / buổi">
                  <InputNumber
                    placeholder="-- Nhập --"
                    min={1}
                    style={{
                      width: '100%'
                    }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={value => value.replace(/\$\s?|(,*)/g, "")}
                    addonAfter="VNĐ" />
                </Form.Item>
                <Form.Item label="Phòng học">
                  <Select placeholder="-- Chọn --">
                    <Select.Option value="0">
                      P1
                    </Select.Option>
                    <Select.Option value="1">
                      P2
                    </Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Ngày học">
                  <DatePicker placeholder="-- Chọn --"
                    style={{
                      width: '100%'
                    }}

                  />
                </Form.Item>
                <Form.Item label="Thời gian bắt đầu buổi học">
                  <TimePicker
                    format="HH:mm"
                    placeholder="--:--"
                    style={{
                      width: '100%'
                    }}

                  />
                </Form.Item>
                <Form.Item label="Thời gian kết thúc buổi học">
                  <TimePicker
                    format="HH:mm"
                    placeholder="--:--"
                    style={{
                      width: '100%'
                    }}

                  />
                </Form.Item>
              </Form>
            </div>
          </Col>
          <Col xs={12} className="px-2">2 </Col>
        </Row>
      </div>
    </>
  )
}


CreateClass.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default CreateClass