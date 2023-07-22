import React, { useEffect, useState } from "react";
import { Badge, Calendar, Spin, message } from "antd";
import LayoutAdmin from "@/components/LayoutAdmin";
import { useRouter } from "next/router";
import { ApiGetDetailClass, ApiGetDetailTimeKeeping } from "@/api/student";
import dayjs from "dayjs";
import { FORMAT_DATE, GRADE } from "@/common/const";
import { CalendarOutlined, LeftOutlined, UserOutlined } from "@ant-design/icons";
import { formatVND } from "@/common/util";

const StudentFeeDetail = ({ user }) => {
  const router = useRouter();
  const { id } = router.query;
  const [detail, setDetail] = useState();
  const [isFetching, setIsFetching] = useState(true);

  const [classInfo, setClassInfo] = useState();
  const fetchDetailFee = async () => {
    try {
      setIsFetching(true);
      const start = dayjs().startOf("month").format(FORMAT_DATE.YYYYMMDD);
      const end = dayjs().endOf("month").format(FORMAT_DATE.YYYYMMDD);
      const res = (await ApiGetDetailTimeKeeping({ classId: id, start, end })).data;
      const classRes = (await ApiGetDetailClass(id)).data;
      setDetail({...res});
      console.log(res);
      setClassInfo(classRes);
      setIsFetching(false);
      console.log(classRes);
    } catch (error) {
      message.error("Xxm lịch sử chấm công thất bại. Vui lòng thử lại");
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchDetailFee();
  }, []);

  const dateCellRender = (value) => {
    const convertVaule = dayjs(value).format(FORMAT_DATE.YYYYMMDD);
    const dates = detail?.attendances?.filter((el) => el.day == convertVaule);
    return (
      <ul className="events-fee">
        {dates?.map((item) => (
          <li key={item.content}>
            <Badge
              status={item?.status ? "success" : "error"}
              text={detail?.name}
            />
            <div>GV: {detail?.teacher}</div>
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
        onClick={() => router.push("/teacher/fee")}
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
                <th className="text-left w-[125px]">Tên giáo viên</th>
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
              <tr>
                <th className="text-left">Số buổi dạy</th>
                <td>{detail?.numberOfStudy}</td>
              </tr>
              <tr>
                <th className="text-left">Tổng tiền</th>
                <td>{formatVND(detail?.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="custom-table my-3 w-2/5">
        <table className="w-full">
            <tbody>
              <tr>
                <th className="text-left w-[125px]">Tên lớp</th>
                <td>{classInfo?.name}</td>
              </tr>
              <tr>
                <th className="text-left">Môn</th>
                <td>{classInfo?.subject?.name}</td>
              </tr>
              <tr>
                <th className="text-left">Khối</th>
                <td> {GRADE.find((el) => el.value == classInfo?.subject?.grade)?.label}</td>
              </tr>
              <tr>
                <th className="text-left">Học phí:</th>
                <td>{formatVND(classInfo?.fee)}</td>
              </tr>
              <tr>
                <th className="text-left">Chủ nhiệm:</th>
                <td>{classInfo?.user?.name}</td>
              </tr>
            </tbody>
          </table>
         
        </div>
      </div>

      <div className="text-xl font-bold my-4 flex items-center gap-3"> <CalendarOutlined /><div>Chi tiêt bảng chấm công</div></div>
      <Spin spinning={isFetching} tip="loading" size="large">

      <div className="flex items-center">
        <div className="h-3 w-3 rounded-full bg-[#52c41a] m-3"></div>Chấm công
      </div>
      <div className="flex items-center">
        <div className="h-3 w-3 rounded-full bg-[#ff4d4f] m-3"></div>Nghỉ phép
      </div>

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
