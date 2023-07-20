import { useEffect, useState } from "react";

import { Card, Col, Image, Row } from "antd";
import dayjs from "dayjs";
import { getListDepartment } from "@/api/address";

const logoMale = require("../public/userMale.png")
const logoFemale = require("../public/userFemale.png")

export default function InfoStuTea({ children, info, mode }) {
  const [listDepartment, setListDepartment] = useState([]);

  useEffect(() => {
    getListDepartment().then(
      res => {
        setListDepartment(res?.data?.result);
      }
    ).catch(err => console.log(err, 'errr'))
  }, []);
  return (
    <div className="p-4">
      <Card
        className="px-3 bg-gray-200 shadow-2xl"
        title={
          <>
            <Row gutter={[8, 8]}>
              <Col xs={14}>
                <p className="uppercase text-sm font-bold">
                  Trường{" "}
                  {mode === 1
                    ? info.teacher_school
                    : info.student_school}
                </p>
              </Col>
              <Col xs={10} className="text-center">
                <p className="uppercase text-sm font-bold">
                  Thông tin {`${mode === 1 ? "giáo viên" : "sinh viên"}`}
                </p>
                <p className="text-xs">
                  {`${mode === 1 ? "Teacher" : "Student"}`} card
                </p>
              </Col>
            </Row>
          </>
        }
        headStyle={{
          borderBottom: "2px solid #cd1818",
        }}
      >
        <Row gutter={[8, 8]}>
          <Col xs={16}>
            <div className="mb-2">
              <p className="text-[9px]">Họ tên / Name</p>
              <p className="uppercase text-base font-bold">{info.name}</p>
            </div>
            <div className="mb-2">
              <p className="text-[9px]">Ngày sinh / Date of Birth</p>
              <p className="text-sm font-medium">
                {info.birthDay
                  ? dayjs(info.birthDay).format("DD-MM-YYYY")
                  : ""}
              </p>
            </div>
            <div className="mb-2">
              <p className="text-[9px]">Giới tính</p>
              <p className="text-sm font-medium">
                {info.gender == "male" ? "Nam" : "Nữ"}
              </p>
            </div>
            <div className="mb-2">
              <p className="text-[9px]">Email</p>
              <p className="text-sm font-medium">{info.email}</p>
            </div>
            <div className="mb-2">
              <p className="text-[9px]">SĐT</p>
              <p className="text-sm font-medium">{info.phoneNumber}</p>
            </div>
            <div className="mb-2">
              <p className="text-[9px]">{`${
                mode === 1 ? "Bộ môn" : "Khối"
              }`}</p>
              <p className="text-sm font-medium">{`${
                mode === 1
                  ? listDepartment?.find(
                      (i) => i.id === info?.departmentId
                    )?.name || ""
                  : "Khối " + (info?.grade || "...")
              }`}</p>
            </div>
          </Col>
          <Col xs={8}>
            <Image
              src={info?.gender == "male" ? '/userMale.png' : '/userFemale.png' }
              alt="Logo user"
            />
            <p className="text-[9px] text-center">
              {`${mode === 1 ? "MGV" : "MSSV"}`} / ID No
            </p>
            <p className="text-sm font-medium text-center">{info?.id || ""} </p>
          </Col>
        </Row>
      </Card>

      {children}
    </div>
  );
}
