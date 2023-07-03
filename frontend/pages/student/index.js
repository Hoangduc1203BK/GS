import InfoStuTea from "@/components/InfoStuTea";
import LayoutAdmin from "@/components/LayoutAdmin";
import LayoutTimeTables from "@/components/TimeTableOfWeek";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { MockDataInfo } from "@/common/mock";
import { checkNameField } from "@/common/const"
const Dashboard = () => {
  const [schedule, setSchedule] = useState([]);
  const [info, setInfo] = useState(MockDataInfo);
  useEffect(() => {
    setSchedule(
      [1, 3, 4, 5, 6, 9, 7, 10, 8].map((el) => {
        return {
          id: el,
          startDate: dayjs().format("YYYY-MM-DD"),
          startTime: dayjs().format("HH:mm"),
          subject: "toán",
          teachet: " Lê Thị Phương ",
          room: "Phòng 101",
          time: "2 tiếng",
          session: "Buổi 4",
        };
      })
    );
  }, []);

  return (
    <div className="flex">
      <div className="w-2/5">
        <InfoStuTea info={info || {}} />
      </div>
      <div className="w-3/5">
        <LayoutTimeTables schedule={schedule} />
      </div>
    </div>
  );
};

Dashboard.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default Dashboard;
