import LayoutAdmin from "@/components/LayoutAdmin";
import StudentsInClass from "@/components/teacher/StudentsInClass";
import { Tabs } from "antd";
const LearningOutcomes = ({user}) => {

  const items = [
    {
      key: "1",
      label: `Danh sách lớp học`,
      children: <StudentsInClass info={user} />,
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} />;
};

LearningOutcomes.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default LearningOutcomes;
