import LayoutAdmin from "@/components/LayoutAdmin";
import DetailTranscript from "@/components/student/DetailTranscript";
import { CheckOutlined, DatabaseFilled, LeftOutlined } from "@ant-design/icons";
import { Tabs, Tag } from "antd";
import { useState } from "react";
import { useRouter } from "next/router";
const Homeworks = ({ user }) => {
  const [idDeteil, setIdDetail] = useState("");
  const [isDetail, setIsDetail] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const handleClickDetail = () => {
    setIsDetail(true);
  };

  const handleBackClasses = () => {
    router.push("/student/class");
  };

  const homeworks = () => {
    return (
      <div className="transaction-list  ml-3">
        <div className="mt-4 p-4">
          <div className="flex gap-5 text-xl mb-3">
            <div className="font-bold">Ngày 11 tháng 4 năm 2023</div>
            <div className=" text-slate-400">Thứ 4</div>
          </div>

          <div
            onClick={handleClickDetail}
            className="border-[1px] flex justify-between items-center py-3 px-4 bg-gray-100 cursor-pointer hover:scale-105 transition duration-700 ease-in-out hover:border-2 border-solid border-slate-300	 rounded-md shadow-md"
          >
            <div>
              <div className="font-bold">
                Tuần 11:Tiêu đề bài tập hôm nay là
              </div>
              <div>Đã gửi và lúc 14:20</div>
            </div>
            <div>
              <Tag color="success" icon={<CheckOutlined />}>
                Đã hoàn thành
              </Tag>
            </div>
          </div>
        </div>
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
  ];

  return (
    <div>
      {isDetail ? (
        <div className="transaction-detail">
          <DetailTranscript setShowDetail={setIsDetail} />
        </div>
      ) : (
        <div>
          <div
            onClick={handleBackClasses}
            className="text-xl flex items-center cursor-pointer text-[#1677ff]"
          >
            <LeftOutlined className="flex items-center" />{" "}
            <div className="mb-[5px]">Trở lại</div>
          </div>
          <Tabs defaultActiveKey="1" tabPosition="top" items={items} />
        </div>
      )}
    </div>
  );
};

Homeworks.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default Homeworks;
