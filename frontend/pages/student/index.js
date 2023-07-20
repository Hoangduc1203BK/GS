import InfoStuTea from "@/components/InfoStuTea";
import LayoutAdmin from "@/components/LayoutAdmin";
import LayoutTimeTables from "@/components/TimeTableOfWeek";
import { useEffect, useState } from "react";
import { Button } from "antd";
import { getMeInfo } from "@/api/address";
import { getCookie, hasCookie } from "@/api/cookies";
import { ApiGetListSchedule } from "@/api/student";
import AddEditTs from "@/components/AddEditTS";
import { UserOutlined } from "@ant-design/icons";

const Dashboard = ({ user }) => {
  const [openEditDetail, setEditDetail] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [info, setInfo] = useState(user);
  useEffect(() => {
    callUserDetail();
    getSchedule();
  }, []);

  useEffect(() => {
    if (!openEditDetail) {
      callUserDetail();
    }
  }, [openEditDetail]);
  const callUserDetail = async () => {
    let token = {};
    if (typeof window !== "undefined") {
      token = getCookie("token");
    } else {
      token = ctx?.req?.cookies?.token;
    }
    if (token) {
      try {
        let res = await getMeInfo(token);
        let user = await res.json();
        setInfo(user);
      } catch (error) {
        console.log("call api error", error);
      }
    }
  };

  const getSchedule = async () => {
    const response = await ApiGetListSchedule();
    setSchedule(Object.entries(response?.data).map(([key, value]) => value));
  };
  return (
    <div className="flex">
      <div className={openEditDetail ? "w-2/3" : "w-2/5"}>
        {openEditDetail ? (
          <div>
            <div className="text-2xl font-bold mt-1 mb-5">
              <UserOutlined /> Thông tin cá nhân
            </div>
            <div className="mt-9 ">
              <AddEditTs
                dataEdit={info}
                checkEdit={openEditDetail}
                mode={2}
                handleOpenForm={setEditDetail}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="text-2xl font-bold mt-1 mb-5">
              <UserOutlined /> Thông tin cá nhân
            </div>
            <div className="mt-1">
              <InfoStuTea info={info || {}} mode={2}>
                <div className="flex justify-end w-full mt-5">
                  <Button
                    type="primary"
                    className="w-full "
                    size="large"
                    onClick={() => setEditDetail(true)}
                  >
                    Cập nhật thông tin
                  </Button>
                </div>{" "}
              </InfoStuTea>
            </div>
          </div>
        )}
      </div>
      <div className={openEditDetail ? "w-1/3" : "w-3/5"}>
        <LayoutTimeTables schedule={schedule} />
      </div>
    </div>
  );
};

Dashboard.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default Dashboard;
