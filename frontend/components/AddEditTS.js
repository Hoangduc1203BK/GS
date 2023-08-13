import { createUser, getListDepartment, updateUser, uploadAvatar, uploadImage } from "@/api/address"
import { GRADE } from "@/common/const"
import { checkImageFileUpload, validatePhone } from "@/common/util"
import { Button, Card, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Select, Switch, Upload, message } from "antd"
import dayjs from "dayjs"
import Image from "next/image"
import { useEffect, useState } from "react"

const logoMale = require("../public/userMale.png")
const logoFemale = require("../public/userFemale.png")

const AddEditTs = ({ checkEdit, dataEdit, mode, handleOpenForm }) => {
  const [form] = Form.useForm()

  const valueForm = {
    name: Form.useWatch('name', form),
    email: Form.useWatch('email', form),
    birthDay: Form.useWatch('birthDay', form),
    phoneNumber: Form.useWatch('phoneNumber', form),
    gender: Form.useWatch('gender', form),
    address: Form.useWatch('address', form),
    departmentId: Form.useWatch('departmentId', form),
    teacher_school: Form.useWatch('teacherSchool', form),
    student_school: Form.useWatch('studentSchool', form),
    grade: Form.useWatch('grade', form),
  }

  const [listDepartment, setListDepartment] = useState([]);
  const [checkedGraduated, setCheckedGraduated] = useState(false);

  async function onFinish(values) {
    values.birthDay = dayjs(values.birthDay).format('YYYY-MM-DD')
    if (mode === 1) {
      values.graduated = checkedGraduated
      values.role = 'teacher'
    } else {
      values.role = 'user'
    }
    if (imageUrl) {
      values.avatar = imageUrl
    }
    if (checkEdit) {
      updateUser(dataEdit?.id, values).then(
        res => {
          if (res?.data?.id) {
            message.success(`Cập nhật thông tin ${mode === 1 ? "giáo viên" : "học sinh"} thành công!`)
            form.resetFields()
            handleOpenForm(false, false)
          } else message.error(`Cập nhật thông tin ${mode === 1 ? "giáo viên" : "học sinh"} thất bại`)
        }
      ).catch(err => message.error("Có lỗi xảy ra! " + err))
    } else {
      createUser(values).then(
        res => {
          if (res?.data?.id) {
            message.success(`Thêm mới ${mode === 1 ? "giáo viên" : "học sinh"} thành công!`)
            form.resetFields()
            handleOpenForm(false, false)
          } else message.error(`Thêm mới ${mode === 1 ? "giáo viên" : "học sinh"} thất bại`)
        }
      ).catch(err => message.error("Có lỗi xảy ra! " + err))
    }
  }

  useEffect(() => {
    if (checkEdit) {
      if (mode == 1) {
        form.setFieldsValue({
          name: dataEdit?.name,
          email: dataEdit?.email,
          phoneNumber: dataEdit?.phoneNumber,
          birthDay: dayjs(dataEdit?.birthDay),
          gender: dataEdit?.gender,
          address: dataEdit?.address,
          departmentId: dataEdit?.departmentId,
          major: dataEdit?.major,
          teacherSchool: dataEdit?.teacherSchool,
          experience: dataEdit?.experience,
          degree: dataEdit?.degree,
        })
        setCheckedGraduated(dataEdit?.graduated)
      }
      else {
        form.setFieldsValue({
          name: dataEdit?.name,
          email: dataEdit?.email,
          phoneNumber: dataEdit?.phoneNumber,
          birthDay: dayjs(dataEdit?.birthDay),
          gender: dataEdit?.gender,
          address: dataEdit?.address,
          grade: dataEdit?.grade,
          studentSchool: dataEdit?.studentSchool,
          parentPhoneNumber: dataEdit?.parentPhoneNumber,
        })
      }
      if (dataEdit?.avatar) {
        setImageUrl(dataEdit?.avatar)
        setFileList([
          {
            uid: "-1",
            name: "images",
            status: "done",
            url: dataEdit?.avatar,
          },
        ])

      }
    }
  }, [checkEdit, dataEdit]);

  useEffect(() => {
    getListDepartment().then(
      res => {
        setListDepartment(res?.data?.result);
      }
    ).catch(err => console.log(err, 'errr'))
  }, []);

  //for upload image
  const [fileList, setFileList] = useState([])
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false);
  const customRequest = async options => {
    setImageUrl("")
    setLoading(true)
    const file = fileList[0]
    const fd = new FormData();
    fd.append("file", file.originFileObj);
    const { onSuccess } = options
    await uploadImage(fd).then(
      res => {
        if (res?.data?.url) {
          onSuccess("ok")
          setImageUrl(res?.data?.url)
          setLoading(false)
        }
      }
    ).catch(err => {
      message.error("Có lỗi xảy ra! Vui lòng kiểm tra lại")
      setLoading(false)
    })
  }
  const handleBeforeUpload = file => {
    if (!checkImageFileUpload(file)) {
      message.error(`${file.name} không đúng định dạng!`)
    }
    return checkImageFileUpload(file) ? true : Upload.LIST_IGNORE
  }
  const handleChangeImage = info => {
    setFileList(info.fileList)
  }
  const handleRemoveImage = () => {
    setFileList([])
    setImageUrl("")
  }
  console.log(imageUrl, 'imageUrl');
  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} md={10}>
          <Card
            className="px-3 bg-gray-200 shadow-2xl"
            title={<>
              <Row gutter={[8, 8]}>
                <Col xs={14}>
                  <p className="uppercase text-sm font-bold">Trường {mode === 1 ? valueForm.teacher_school : valueForm.student_school}</p>
                </Col>
                <Col xs={10} className="text-center">
                  <p className="uppercase text-sm font-bold">Thông tin {`${mode === 1 ? "giáo viên" : "học viên"}`}</p>
                  <p className="text-xs">{`${mode === 1 ? "Teacher" : "Student"}`} card</p>
                </Col>
              </Row>
            </>}
            headStyle={{
              borderBottom: '2px solid #cd1818'
            }}
          >
            <Row gutter={[8, 8]}>
              <Col xs={16}>
                <div className="mb-2">
                  <p className="text-[9px]">Họ tên / Name</p>
                  <p className="uppercase text-base font-bold">{valueForm.name}</p>
                </div>
                <div className="mb-2">
                  <p className="text-[9px]">Ngày sinh / Date of Birth</p>
                  <p className="text-sm font-medium">{valueForm.birthDay ? dayjs(valueForm.birthDay).format('DD-MM-YYYY') : ""}</p>
                </div>
                <div className="mb-2">
                  <p className="text-[9px]">Giới tính</p>
                  <p className="text-sm font-medium">{valueForm.gender == 'male' ? "Nam" : "Nữ"}</p>
                </div>
                <div className="mb-2">
                  <p className="text-[9px]">Email</p>
                  <p className="text-sm font-medium">{valueForm.email}</p>
                </div>
                <div className="mb-2">
                  <p className="text-[9px]">SĐT</p>
                  <p className="text-sm font-medium">{valueForm.phoneNumber}</p>
                </div>
                <div className="mb-2">
                  <p className="text-[9px]">{`${mode === 1 ? "Bộ môn" : "Khối"}`}</p>
                  <p className="text-sm font-medium">{`${mode === 1 ? listDepartment?.find(i => i.id === valueForm?.departmentId)?.name || "" : "Khối " + (valueForm?.grade || "...")}`}</p>
                </div>
              </Col>
              <Col xs={8}>
                <img className="h-[85%] w-full" src={imageUrl} alt="Avatar User" />
                {/* <div className="w-full h-[85%] relative overflow-hidden">
                  <Image fill src={imageUrl} alt="Avatar User" />
                </div> */}
                <p className="text-[9px] text-center">{`${mode === 1 ? "MGV" : "MSSV"}`} / ID No</p>
                <p className="text-sm font-medium text-center">{dataEdit?.id || ""} </p>
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
            onFinish={onFinish}
          >
            <p className="font-medium text-lg mb-2">Thông tin {mode === 1 ? "giáo viên" : "học sinh"}</p>

            <Upload listType="picture-card" maxCount={1} customRequest={customRequest} fileList={fileList} beforeUpload={handleBeforeUpload} onChange={handleChangeImage} onRemove={handleRemoveImage}>
              Chọn ảnh để tải lên (jpg, png ...)
            </Upload>
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
                  >
                    <Select.Option value="female">Nữ</Select.Option>
                    <Select.Option value="male">Nam</Select.Option>
                  </Select>
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
                  mode === 1 ?
                    <>
                      <Form.Item label="Bộ môn" name="departmentId" rules={[{ required: true, message: "Đây là trường dữ liệu bắt buộc!" }]}>
                        <Select
                          placeholder="-- Chọn --"
                        >
                          {
                            listDepartment?.map(i => (
                              <Select.Option key={i.id} value={i.id}>{i?.name}</Select.Option>
                            ))
                          }
                        </Select>
                      </Form.Item>
                      <Form.Item label="Tốt nghiệp">
                        <Switch checked={checkedGraduated} onChange={(checked) => setCheckedGraduated(checked)} />
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
                  mode == 1 ?
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
                <Button htmlType="submit" type="primary" loading={loading}>Xác nhận</Button>
              </Col>
              <Col>
                <Button onClick={() => {
                  handleOpenForm(false, false)
                  setFileList([])
                  setImageUrl("")
                }}>Hủy</Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default AddEditTs