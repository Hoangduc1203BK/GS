import InfoStuTea from "@/components/InfoStuTea";
import LayoutAdmin from "@/components/LayoutAdmin";
import LayoutTimeTables from "@/components/TimeTableOfWeek";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Button } from "antd";
import PopupStudentSuggest from "@/components/popup/popupStudentSuggest";
import PopupStudentFeedback from "@/components/popup/popupStudentFeedback";
import PopupStudentTuitionFee from "@/components/popup/popupStudentTuitionFee";
import { getMeInfo } from "@/api/address";
import { getCookie, hasCookie } from "@/api/cookies";
import { ApiGetListSchedule } from "@/api/student";

const Dashboard = ({user}) => {
  
  const [openSugget, setOpenSuggest] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openTuitionFee, setOpenTuitionFee] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [info, setInfo] = useState(user);
  useEffect(() => {
    const callUserDetail = async () =>  {
      
        let token = {} ;
        if (typeof window !== "undefined") {
          token = getCookie("token");
        } else {
          token = ctx?.req?.cookies?.token;
        }
        if (token) {
          try {
            let res = await getMeInfo(token)
            let user = await res.json();
            setInfo(user)
          } catch (error) {
            console.log("call api error", error)
          }
        }
      
    }

    callUserDetail();
    getSchedule()
  }, []);


  const getSchedule = async () =>{
    const response = await ApiGetListSchedule();
    setSchedule(
      Object.entries(response.data).map(([key,value])=> value)
    )
    console.log(Object.entries(response.data).map(([key,value])=> value));
  }
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
                className="w-1/2 !bg-green-600"
                onClick={() => setOpenFeedback(true)}
              >
                Thư góp ý
              </Button>
            <Button
              type="primary"
              className="w-1/2 !bg-violet-700"
              onClick={() => setOpenTuitionFee(true)}
            >
              Học phí
            </Button>
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
