import React, { useEffect, useState } from "react";
import { Badge, Calendar, Divider, Spin, message } from "antd";
import LayoutAdmin from "@/components/LayoutAdmin";
import { useRouter } from "next/router";
import { ApiGetDetailClass, ApiGetDetailFee } from "@/api/student";
import dayjs from "dayjs";
import { FORMAT_DATE, GRADE } from "@/common/const";
import { CalendarOutlined, LeftOutlined, UserOutlined } from "@ant-design/icons";
import { formatVND } from "@/common/util";

const StudentFeeDetail = ({ user }) => {
  const router = useRouter();
  const { id } = router.query;
  const [detail, setDetail] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const [classInfo, setClassInfo] = useState();
  const fetchDetailFee = async () => {
    try {
      setIsFetching(true);
      const start = dayjs().startOf("month").format(FORMAT_DATE.YYYYMMDD);
      const end = dayjs().endOf("month").format(FORMAT_DATE.YYYYMMDD);
      const res = (await ApiGetDetailFee({ classId: id, start, end })).data;
      const classRes = (await ApiGetDetailClass(id)).data;
      setDetail([...res]);
      setClassInfo(classRes);
      setIsFetching(false);
      console.log(classRes);
    } catch (error) {
      message.error("XEm lịch sử điểm danh thất bại. Vui lòng thử lại");
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchDetailFee();
  }, []);

  const dateCellRender = (value) => {
    const convertVaule = dayjs(value).format(FORMAT_DATE.YYYYMMDD);
    const dates = detail.filter((el) => el.day == convertVaule);
    return (
      <ul className="events-fee">
        {dates?.map((item) => (
          <li key={item.content}>
            <Badge
              status={item?.status ? "success" : "error"}
              text={item?.class_name}
            />
          </li>
        ))}
      </ul>
    );
  };
  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };
  return (
    <div>
      <div
        onClick={() => router.push("/student/fee")}
        className="text-xl flex items-center cursor-pointer text-[#1677ff] w-[75px]"
      >
        <LeftOutlined className="flex items-center" />{" "}
        <div className="mb-[5px]">Trở lại</div>
      </div>
      <div className="text-xl font-bold my-4 flex items-center gap-3"> <UserOutlined /><div>Thông tin cơ bản</div></div>

      <div className="flex justify-between w-full gap-6 mb-5">
        <div className="custom-table my-3 w-1/3 ml-3">
          <table className="w-full">
            <tbody>
              <tr>
                <th className="text-left w-[125px]">Tên học sinh</th>
                <td>{user?.name}</td>
              </tr>
              <tr>
                <th className="text-left">Ngày sinh</th>
                <td>{user?.birthDay}</td>
              </tr>
              <tr>
                <th className="text-left">Số điện thoại</th>
                <td>{user?.phoneNumber}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="custom-table my-3 w-2/5">
          <div className="flex p-1">
            <div className="text-left w-[100px] font-bold">Tên lớp:</div>
            <div className="w-subtraction-100">{classInfo?.name}</div>
          </div>
          <div className="flex p-1">
            <div className="text-left w-[100px] font-bold">Môn:</div>
            <div className="w-subtraction-100">{classInfo?.subject?.name}</div>
          </div>
          <div className="flex p-1">
            <div className="text-left w-[100px] font-bold">Môn:</div>
            <div className="w-subtraction-100">
              {GRADE.find((el) => el.value == classInfo?.subject?.grade)?.label}
            </div>
          </div>
          <div className="flex p-1">
            <div className="text-left w-[100px] font-bold">Học phí:</div>
            <div className="w-subtraction-100">{formatVND(classInfo?.fee)}</div>
          </div>
          <div className="flex p-1">
            <div className="text-left w-[100px] font-bold">Chủ nhiệm:</div>
            <div className="w-subtraction-100">{classInfo?.user?.name}</div>
          </div>
        </div>
      </div>

      <div className="text-xl font-bold my-4 flex items-center gap-3"> <CalendarOutlined /><div>Chi tiêt bảng điểm danh</div></div>
      <Spin spinning={isFetching} tip="loading" size="large">
        <Calendar
          className=" custom-calender"
          cellRender={cellRender}
          headerRender={false}
        />
      </Spin>
    </div>
  );
};

StudentFeeDetail.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default StudentFeeDetail;
