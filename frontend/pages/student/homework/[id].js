import LayoutAdmin from "@/components/LayoutAdmin";
import DetailTranscript from "@/components/student/DetailTranscript";
import { CheckOutlined, LeftOutlined } from "@ant-design/icons";
import { Spin, Tabs, Tag, message } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FORMAT_DATE, SUB_ASSIGMENT_STATUS_LIST } from "@/common/const";
import { ApiGetDetailClass, ApiGetStudentAssignments } from "@/api/student";
import dayjs from "dayjs";
import { dayOfWeekVn } from "@/common/util";
const Homeworks = ({ user }) => {
  const [detail, setDetail] = useState();
  const [isDetail, setIsDetail] = useState(false);
  const [tabActive, setTabActive] = useState("1");
  const [assigments, setAssigments] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const [classDetail, setClassDetail] = useState();
  const [isFetchList, setFetchList] =  useState(false);

  useEffect(() => {
    fetchListAssigments();
  }, [tabActive]);

  useEffect(() => {
    fetchDetailClass()
  }, []);

  const fetchDetailClass = async () =>{
    const res = await ApiGetDetailClass(id);
    setClassDetail(res.data)
  }

  const handleClickDetail = (detail) => {
    setIsDetail(true);
    setDetail(detail)
  };

  const handleBackClasses = () => {
    router.push("/student/class");
  };

  const showStatusAssigment = () => {
    return SUB_ASSIGMENT_STATUS_LIST.find(
      (el, index) => index + 1 == tabActive
    );
  };

  const homeworks = () => {
    return (
      <div className="transaction-list  ml-3">
        {assigments?.map((el) => (
          <div className="mt-4 p-4" key={el.id}>
            <div className="flex gap-5 text-xl mb-3">
              <div className="font-bold">
                {dayjs(el.created_at).format(FORMAT_DATE.DATE)}
              </div>
              <div className=" text-slate-400">{dayOfWeekVn(el.created_at)}</div>
            </div>

            <div
              onClick={()=>handleClickDetail(el)}
              className="border-[1px] flex justify-between items-center py-3 px-4 bg-gray-100 cursor-pointer hover:scale-105 transition duration-700 ease-in-out hover:border-2 border-solid border-slate-300	 rounded-md shadow-md"
            >
              <div>
                <div className="font-bold">{el.title}</div>
                <div>
                  Đã gửi và lúc{" "}
                  {`${dayjs(el.created_at)
                    .hour()
                    .toString()
                    .padStart(2, "0")}:${dayjs(el.created_at)
                    .minute()
                    .toString()
                    .padStart(2, "0")}`}
                </div>
              </div>
              <div>
                <Tag
                  color={showStatusAssigment().color}
                  icon={showStatusAssigment().icon}
                >
                  {showStatusAssigment().label}
                </Tag>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const items = [
    {
      key: "1",
      label: "Chưa hoàn thành",
      children: homeworks(),
    },
    {
      key: "2",
      label: "Đã hoàn thành",
      children: homeworks(),
    },
    {
      key: "3",
      label: "Nộp muộn",
      children: homeworks(),
    },
    {
      key: "4",
      label: "Quá hạn",
      children: homeworks(),
    },
  ];

  const fetchListAssigments = async () => {
    try {
      setFetchList(true)
      const params = {
        classId: id,
        status: SUB_ASSIGMENT_STATUS_LIST.find(
          (el, index) => index + 1 == tabActive
        ).value,
      };
      console.log(params);
      const res = (await ApiGetStudentAssignments(params)).data;
      console.log(res);
      setAssigments([...res]);
      setFetchList(false)
    } catch (error) {
      console.log(error);
      message.error("Xem danh sách bài tập thất bại! Vui lòng thử lại");
      setFetchList(false)

    }
  };

  const handleChangeTab = (tab) => {
    setTabActive(tab);
  };

  return (
    <div>
      {isDetail ? (
        <div className="transaction-detail">
          <DetailTranscript setShowDetail={setIsDetail} detail={detail} />
        </div>
      ) : (
        <Spin tip="loading" size="large" spinning={isFetchList}>
          <div className="flex">
            <div
              onClick={handleBackClasses}
              className="text-xl flex items-center cursor-pointer w-[100px] text-[#1677ff]"
            >
              <LeftOutlined className="flex items-center" />{" "}
              <div className="mb-[5px]">Trở lại</div>
            </div>
            <div className="ml-5 text-2xl font-bold mb-[5px]">Mã lớp {id} - {classDetail?.name}</div>
          </div>

          <Tabs
            activeKey={tabActive}
            tabPosition="top"
            onChange={handleChangeTab}
            items={items}
          />
        </Spin>
      )}
    </div>
  );
};

Homeworks.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default Homeworks;
