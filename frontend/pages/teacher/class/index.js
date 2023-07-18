import { getListAttendance, getListUser } from "@/api/address";
import LayoutAdmin from "@/components/LayoutAdmin";
import HistoryAttendance from "@/components/historyAttendance";
import StudentsInClass from "@/components/teacher/StudentsInClass";
import { Tabs, message } from "antd";
import { useEffect, useState } from "react";
const LearningOutcomes = ({ user }) => {

  const [dataAttendance, setDataAttendance] = useState({});
  const [activeTab, setActiveTab] = useState("1");
  const [listTeacher, setListTeacher] = useState([]);

  useEffect(() => {
    getListUser({ role: 'teacher', page: 1, size: 999 }).then(
      res => {
        setListTeacher(res?.data?.result);
      }
    ).catch(err => message.error("Lấy dữ liệu thất bại!"))
  }, []);

  async function watchHistory(record) {
    const params = {
      classId: record?.id,
      teacher: record?.teacher
    }
    await getListAttendance(params).then(
      res => {
        if (res?.data?.length == 0) {
          message.error("Chưa có lịch sử điểm danh!")
        } else {
          setDataAttendance(
            {
              class: record,
              listAttendance: res?.data
            }
          )
          setActiveTab("2")
        }
      }
    ).catch(err => message.error('Có lỗi xảy ra! Không thế lấy lịch sử điểm danh! ' + err))
  }

  function handleChangeTab(key) {
    if (key === "2") {
      message.error("Vui lòng chọn lớp!")
    }
    setActiveTab("1")
  }
  const items = [
    {
      key: "1",
      label: `Danh sách lớp học`,
      children: <StudentsInClass info={user} watchHistory={watchHistory} />,
    },
    {
      key: "2",
      label: `Lịch sử điểm danh`,
      children: <HistoryAttendance dataAttendance={dataAttendance} listTeacher={listTeacher} />,
      disabled: true
    }
  ];
  return <Tabs defaultActiveKey="1" activeKey={activeTab} items={items} onChange={handleChangeTab} />
};

LearningOutcomes.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default LearningOutcomes;
