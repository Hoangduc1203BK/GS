import { GRADE } from "@/common/const"
import { Button, Card, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Select, Switch } from "antd"
import Image from "next/image"

const logoMale = require("../public/userMale.png")
const logoFemale = require("../public/userFemale.png")

const AddEditTs = ({ checkEdit, dataMe }) => {

  const [form] = Form.useForm()

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} md={10}>
          <Card
            className="px-3 bg-gray-200 shadow-2xl"
            title={<>
              <Row gutter={[8, 8]}>
                <Col xs={14}>
                  <p className="uppercase text-sm font-bold">Trường {dataMe?.role === 'teacher' ? dataMe?.teacher_school : dataMe?.student_school}</p>
                </Col>
                <Col xs={10} className="text-center">
                  <p className="uppercase text-sm font-bold">Thông tin {`${dataMe?.role === 'teacher' ? "giáo viên" : "sinh viên"}`}</p>
                  <p className="text-xs">{`${dataMe?.role === 'teacher' ? "Teacher" : "Student"}`} card</p>
                </Col>
              </Row>
            </>}
            headStyle={{
              borderBottom: '2px solid #cd1818'
            }}
          // style={{
          //     width: 600,
          // }}
          >
            <Row gutter={[8, 8]}>
              <Col xs={16}>
                <div className="mb-2">
                  <p className="text-[9px]">Họ tên / Name</p>
                  <p className="uppercase text-base font-bold">{dataMe?.name || ""}</p>
                </div>
                <div className="mb-2">
                  <p className="text-[9px]">Ngày sinh / Date of Birth</p>
                  <p className="text-sm font-medium">{dataMe?.birthDay || ""}</p>
                </div>
                <div className="mb-2">
                  <p className="text-[9px]">Giới tính</p>
                  <p className="text-sm font-medium">{dataMe?.gender == "female" ? "Nữ" : "Nam"}</p>
                </div>
                <div className="mb-2">
                  <p className="text-[9px]">Email</p>
                  <p className="text-sm font-medium">{dataMe?.email || ""}</p>
                </div>
                <div className="mb-2">
                  <p className="text-[9px]">SĐT</p>
                  <p className="text-sm font-medium">{dataMe?.parentPhoneNumber || dataMe?.phoneNumber || ""}</p>
                </div>
                <div className="mb-2">
                  <p className="text-[9px]">{`${dataMe?.role === 'teacher' ? "Bộ môn" : "Khối"}`}</p>
                  <p className="text-sm font-medium">{`${dataMe?.role === 'teacher' ? dataMe?.departmentId : "Khối " + (dataMe?.grade || "...")}`}</p>
                </div>
              </Col>
              <Col xs={8}>
                <Image src={dataMe?.gender == 'male' ? logoMale : logoFemale} alt="Logo user" />
                <p className="text-[9px] text-center">{`${dataMe?.role === 'teacher' ? "MGV" : "MSSV"}`} / ID No</p>
                <p className="text-sm font-medium text-center">{dataMe?.id || ""} </p>

              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={{
          offset: 1,
          span: 13
        }}
          className="border rounded-md !p-3 !px-6"
        >
          <Form
            form={form}
            layout="vertical"

          >
            <p className="font-medium text-lg mb-2">Thông tin {dataMe?.role == 'teacher' ? "giáo viên" : "học sinh"}</p>
            <Row gutter={[8, 8]}>
              <Col xs={24} md={12}>
                <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: "Đây là trường dữ liệu bắt buộc!" }]}>
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
                <Form.Item label="Ngày sinh" name="birthDay" rules={[{ required: true, message: "Đây là trường dữ liệu bắt buộc!" }]}>
                  <DatePicker className="w-full" placeholder="Chọn ngày" />
                </Form.Item>
                <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: "Đây là trường dữ liệu bắt buộc!" }]}>
                  <Select
                    placeholder="-- Chọn --"
                  ></Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: "Đây là trường dữ liệu bắt buộc!" }, { type: 'email', message: "Không đúng định dạng email!" }]}>
                  <Input placeholder="Nhập email" />
                </Form.Item>
                <Form.Item label="SĐT" name="phoneNumber" rules={[{ required: true, message: "Đây là trường dữ liệu bắt buộc!" }, () => ({
                  validator(rule, value) {
                    if (!value || validatePhone(value)) {
                      return Promise.resolve()
                    }
                    return Promise.reject("Số điện thoại không đúng định dạng!")
                  },
                })]}>
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: "Đây là trường dữ liệu bắt buộc!" }]}>
                  <Input placeholder="Nhập địa chỉ" />
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left" > Thông tin phụ </Divider>
            <Row gutter={[8, 8]}>
              <Col xs={24} md={12}>
                {
                  dataMe?.role == 'teacher' ?
                    <>
                      <Form.Item label="Bộ môn" name="departmentId" rules={[{ required: true, message: "Đây là trường dữ liệu bắt buộc!" }]}>
                        <Select
                          placeholder="-- Chọn --"
                        >
                          <Select.Option>bo mon 1</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label="Tốt nghiệp" name="graduated">
                        <Switch defaultChecked />
                      </Form.Item>
                      <Form.Item label="Chuyên ngành" name="major">
                        <Input placeholder="Nhập chuyên ngành" />
                      </Form.Item>
                    </>
                    :
                    <>
                      <Form.Item label="Khối lớp" name="grade" rules={[{ required: true, message: "Đây là trường dữ liệu bắt buộc!" }]}>
                        <Select
                          placeholder="-- Chọn --"
                        >
                          {GRADE?.map((grade) => (
                            <>
                              <Select.Option value={grade.value} key={grade.key}>
                                {grade.label}
                              </Select.Option>
                            </>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item label="SĐT phụ huynh" name="parentPhoneNumber" rules={[() => ({
                        validator(rule, value) {
                          if (!value || validatePhone(value)) {
                            return Promise.resolve()
                          }
                          return Promise.reject("Số điện thoại không đúng định dạng!")
                        },
                      })]}>
                        <Input placeholder="Nhập số điện thoại phụ huynh" />
                      </Form.Item>
                    </>
                }

              </Col>
              <Col xs={24} md={12}>
                {
                  dataMe?.role == 'teacher' ?
                    <>

                      <Form.Item label="Degree" name="degree">
                        <Input placeholder="Nhập degree" />
                      </Form.Item>
                      <Form.Item label="Số năm kinh nghiệm" name="experience">
                        <InputNumber min={0} className="w-full" placeholder="Nhập số năm" />
                      </Form.Item>
                      <Form.Item label="Trường đang dạy" name="teacherSchool">
                        <Input placeholder="Nhập tên trường" />
                      </Form.Item>
                    </>
                    :
                    <>
                      <Form.Item label="Trường đang học" name="studentSchool">
                        <Input placeholder="Nhập tên trường" />
                      </Form.Item>
                    </>
                }
              </Col>
            </Row>
            <Row gutter={[8, 8]} justify="center">
              <Col>
                <Button htmlType="submit" type="primary">Xác nhận</Button>
              </Col>
              <Col>
                <Button>Hủy</Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default AddEditTs