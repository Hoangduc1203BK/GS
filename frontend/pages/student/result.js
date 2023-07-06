import LayoutAdmin from "@/components/LayoutAdmin";
import TeacherComment from "@/components/student/TeacherComment";
import Transcript from "@/components/student/Transcript";
import { Tabs } from "antd";
const LearningOutcomes = () => {

  const items = [
    {
      key: "1",
      label: `Bảng điểm`,
      children: <Transcript />,
    },
    {
      key: "2",
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
