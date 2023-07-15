import LayoutAdmin from "@/components/LayoutAdmin";
import StudentsInClass from "@/components/student/StudentsInClass";
import TeacherComment from "@/components/student/TeacherComment";
import Transcript from "@/components/student/Transcript";
import { Tabs } from "antd";
const LearningOutcomes = ({user}) => {

  const items = [
    {
      key: "1",
      label: `Danh sách lớp học`,
      children: <StudentsInClass info={user} />,
    },
    {
      key: "2",
      label: `Quản lý bài tập`,
      children: <Transcript />,
    },
    {
      key: "3",
      label: `Nhận xét của giáo viên`,
      children: <TeacherComment />,
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} />;
};

LearningOutcomes.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default LearningOutcomes;
