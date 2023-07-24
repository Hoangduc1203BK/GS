import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  message,
} from "antd";
import Image from "next/image";
import { Josefin_Sans } from "next/font/google";
import Head from "next/head";
import { useState } from "react";
import dayjs from "dayjs";
import { createUser, getMeInfo, login } from "@/api/address";
import { setCookie } from "@/api/cookies";
import Router from "next/router";
import {
  LockOutlined,
  MailOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";

const jose = Josefin_Sans({ subsets: ["latin"] });
export default function Login() {
  const [form] = Form.useForm();

  const [checkRegister, setCheckRegister] = useState(false);

  const handleSubmitForm = (values) => {
    login(values)
      .then((res) => {
        if (res?.data?.accessToken) {
          message.success("Đăng nhập thành công!");
          setCookie("token", res?.data?.accessToken);
          const userLogin = JSON.parse(Buffer.from(res?.data?.accessToken?.split(".")[1], "base64"))
          setCookie("role", userLogin?.role);
          if (userLogin.role === "user") {
            Router.push("/student");
          } else if (userLogin.role === "teacher") {
            Router.push("/teacher");
          } else {
            Router.push("/admin/departmentManage");
          }
        } else {
          message.error(
            "Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản và mật khẩu!"
          );
        }
      })
      .catch((err) => {
        message.error(
          err?.response?.data?.message || err?.response?.data?.errors
        );
      });
  };
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div
        // style={{
        //   backgroundImage: "url(/bg.png)",
        //   backgroundRepeat: "no-repeat",
        //   backgroundAttachment: "fixed",
        //   backgroundSize: "cover",
        //   backgroundPosition: "top",
        //   height: "100vh",
        //   width: "100%",
        // }}
        className={`${jose.className} h-screen flex justify-center items-center bg-[#14238A]`}
      >
        <div className="w-1/2 h-full  flex justify-center items-center"
          style={{
            backgroundImage: "url(/school.png)",
            backgroundRepeat: "no-repeat",
            // backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "left",
          }}
        >
          <div className="w-[60%] absolute">
            {/* <img src="https://www.metasolutions.net/wp-content/uploads/2021/06/emis.png" /> */}
            {/* <div className=" flex justify-center">
              <Image
                src="/hust.png"
                alt="QuacQuac Logo"
                // className="dark:invert"
                // fill
                width={100}
                height={84}
                priority
              />
            </div> */}
            <p className="text-[25px] text-white text-center uppercase font-bold">welcome</p>
            <p className="text-[30px] text-[#13005A] text-center uppercase font-bold">Education Management System</p>
          </div>
        </div>
        <div className=" w-1/2 h-full rounded-sm bg-inherit flex justify-center items-center">
          <div
            className="px-6 py-8 w-[400px] rounded-md bg-white"
            style={{
              boxShadow: "5px 5px 50px 0px rgba(0, 157, 255, 0.5)",
            }}
          >
            <h1 className="text-[30px] text-[#13005A] flex justify-center font-bold">
              GS App
            </h1>
            <Form
              form={form}
              className="mt-4"
              labelCol={{ span: 4 }}
              labelAlign="left"
              labelWrap="wrap"
              onFinish={handleSubmitForm}
            >
              <>
                <Form.Item
                  label=""
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Trường dữ liệu bắt buộc!",
                    },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Enter email" className="h-12" />
                </Form.Item>
                <Form.Item
                  label=""
                  // className="mb-2"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Trường dữ liệu bắt buộc!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter password"
                    className="h-12"
                  />
                </Form.Item>
                {/* <Row justify="end">
										<Col className="text-white">
											Have not an account?
											<Button
												type="link"
												onClick={clickRegister}
											>
												Register now!
											</Button>
										</Col>
									</Row> */}
              </>
              <Row justify="center" className="mt-4 h-12">
                <Col className="text-white h-full" xs={24}>
                  <Button className="w-full h-full uppercase text-lg !bg-[#D60A0B] font-medium hover:shadow-buttonHome hover:!bg-[#FABC13] hover:!text-black" type="primary" htmlType="submit">
                    {checkRegister ? "Đăng ký" : "Login"}
                  </Button>{" "}
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
