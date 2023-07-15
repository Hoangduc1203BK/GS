import {
  CheckOutlined,
  DatabaseFilled,
  TwitterOutlined,
} from "@ant-design/icons";
import { Table, Tag } from "antd";
import DetailTranscript from "./DetailTranscript";
import { useState } from "react";

export default function Transcript({}) {
  const [idDeteil, setIdDetail] = useState("");
  const [isDetail, setIsDetail] = useState(false);

  const handleClickDetail = () => {
    setIsDetail(true)
  }

  return (
    <div>
      {isDetail ? (
        <div className="transaction-detail">
          <DetailTranscript setShowDetail={setIsDetail} />
        </div>
      ) : (
        <div className="transaction-list  ml-3">
          <div className="text-2xl font-bold mt-1 mb-5">
            <DatabaseFilled /> Quản lý bài tập
          </div>
          <div className="mt-4 p-4">
            <div className="flex gap-5 text-xl mb-3">
              <div className="font-bold">Ngày 11 tháng 4 năm 2023</div>
              <div className=" text-slate-400">Thứ 4</div>
            </div>

            <div onClick={handleClickDetail} className="border-[1px] flex justify-between items-center py-3 px-4 bg-gray-100 cursor-pointer hover:scale-105 transition duration-700 ease-in-out hover:border-2 border-solid border-slate-300	 rounded-md shadow-md">
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
      )}
    </div>
  );
}
