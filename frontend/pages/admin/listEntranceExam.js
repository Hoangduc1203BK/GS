"use client";

import LayoutAdmin from "@/components/LayoutAdmin";
import { CalendarOutlined, SnippetsOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row } from "antd";
import { Tabs } from 'antd';
const ListEntranceExam = () => {
  const [formSearch] = Form.useForm()

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        centered
        items={[
          {
            label: (
              <span>
                <SnippetsOutlined />
                Xếp lịch thi
              </span>
            ),
            key: '1',
            children:
              <>
                <p className="font-semibold mb-2">Danh sách thi thử</p>
                <Form
                  form={formSearch}
                >
                  <Row gutter={[8, 8]}>
                    <Col xs={12} lg={8}>
                      <Form.Item name="q">
                        <Input placeholder="Tìm kiếm..." />
                      </Form.Item>
                    </Col>
                    <Col xs={12} lg={8}>
                      <Row gutter={[8, 8]}>
                        <Col>
                          <Button>Đặt lại</Button>
                        </Col>
                        <Col>
                          <Button type="primary">Tìm kiếm</Button>
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={24} lg={8}>
                      <Row gutter={[8, 8]} justify="end">
                        <Col>
                          <Button type="primary">Xếp lịch thi</Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </>,
          },
          {
            label: (
              <span>
                <CalendarOutlined />
                Lịch thi thử
              </span>
            ),
            key: '2',
            children: `Content of Tab Pane 2`,
          }
        ]}
      />

    </>
  )
}

ListEntranceExam.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default ListEntranceExam 