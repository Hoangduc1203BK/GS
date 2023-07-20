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
          console.log(res?.data?.accessToken);
          getMeInfo(res?.data?.accessToken)
            .then((e) => {
              e.json().then((value) => {
                if (value.role === "user") {
                  Router.push("student");
                } else if (value.role === "teacher") {
                  Router.push("teacher");
                } else {
                  Router.push("/admin/departmentManage");
                }
              });
            })
            .catch((er) => {
              console.log(er);
            });
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
        style={{
          backgroundImage: "url(/bg.png)",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "top",
          height: "100vh",
          width: "100%",
        }}
        className={`${jose.className} h-screen flex justify-center items-center`}
      >
        <div className="w-1/2">
          <div className="h-full flex justify-center">
            <Image
              src="/layer.png"
              alt="QuacQuac Logo"
              // className="dark:invert"
              width={600}
              height={64}
              priority
            />
          </div>
        </div>
        <div className=" w-1/2 h-full rounded-sm bg-inherit flex justify-center items-center">
          <div
            className="px-6 py-16 w-1/2 rounded-md bg-white"
            style={{
              boxShadow: "5px 5px 50px 0px rgba(0, 157, 255, 0.5)",
            }}
          >
            <h1 className="text-[30px] text-[#13005A] flex justify-center font-bold">
              {checkRegister ? "Đăng ký" : "Đăng nhập"}
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
                  <Input prefix={<MailOutlined />} placeholder="Nhập email" />
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
                    placeholder="Nhập mật khẩu"
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
              <Row justify="center" className="mt-4">
                <Col className="text-white">
                  <Button type="primary" htmlType="submit">
                    {checkRegister ? "Đăng ký" : "Đăng nhập"}
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
