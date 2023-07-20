import LayoutAdmin from "@/components/LayoutAdmin";
import StudentsInClass from "@/components/student/StudentsInClass";
import StudentsInClassTest from "@/components/student/StudentsInClassTest";
import TeacherComment from "@/components/student/TeacherComment";
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
      label: `Danh sách lớp học thử`,
      children: <StudentsInClassTest info={user} />,
    },
    {
      key: "3",
      label: `Nhận xét của giáo viên`,
      children: <TeacherComment info={user} />,
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} />;
};

LearningOutcomes.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default LearningOutcomes;
