import InfoStuTea from "@/components/InfoStuTea";
import LayoutAdmin from "@/components/LayoutAdmin";
import LayoutTimeTables from "@/components/TimeTableOfWeek";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { MockDataInfo } from "@/common/mock";
import { Button } from "antd";
import PopupStudentSuggest from "@/components/popup/popupStudentSuggest";
import PopupStudentFeedback from "@/components/popup/popupStudentFeedback";
import PopupStudentTuitionFee from "@/components/popup/popupStudentTuitionFee";
const Dashboard = () => {
  
  const [openSugget, setOpenSuggest] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openTuitionFee, setOpenTuitionFee] = useState(false);
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
       <PopupStudentSuggest open={openSugget} setOpen={setOpenSuggest} />
      <PopupStudentFeedback open={openFeedback} setOpen={setOpenFeedback} />
      <PopupStudentTuitionFee open={openTuitionFee} setOpen={setOpenTuitionFee} info={info} />
      <div className="w-2/5">
        <InfoStuTea info={info || {}}>
          <div className="flex gap-2 w-full mt-3">
            <Button
              type="primary"
              className="w-1/2"
              onClick={() => setOpenSuggest(true)}
            >
              Đề xuất
            </Button>
            <Button
              type="primary"
              className="w-1/2 !bg-violet-700"
              onClick={() => setOpenTuitionFee(true)}
            >
              Học phí
            </Button>
          </div>
          <div className="flex gap-2 w-full mt-3">
            <Button
              type="primary"
              className="w-1/2 !bg-green-600"
              onClick={() => setOpenFeedback(true)}
            >
              Thư góp ý
            </Button>
            <div className="w-1/2"></div>
          </div>
        </InfoStuTea>
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
