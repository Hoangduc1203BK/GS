import {
  ArrowDownOutlined,
  CloseOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";

export default function DetailTranscript({setShowDetail}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    // Xử lý file đã kéo và thả ở đây
    const files = event.dataTransfer.files;
    // handleFiles(files);
    console.log(files);
  };

  const handleBackListWord = () => {
    setShowDetail(false)
  }

  return (
    <div className="mt-3 ml-3">
      <div className=" flex items-center justify-between">
        <div onClick={handleBackListWord} className="text-xl flex items-center cursor-pointer text-[#1677ff]">
          <LeftOutlined className="flex items-center" />{" "}
          <div className="mb-[5px]">Trở lại</div>
        </div>
        <div className="flex items-center gap-4">
          {false ? (
            <div className="text-slate-400 flex gap-1 items-center">
              <CloseOutlined className="flex items-center" />
              <div className="mb-[3px]">Chưa hoàn thành</div>
            </div>
          ) : (
            <div className="text-green-400 flex gap-1 items-center">
              <CloseOutlined className="flex items-center" />
              <div className="mb-[3px]">
                Đã hoàn thành ngày 17/4/2023 lúc 11:06
              </div>
            </div>
          )}

          <Button type="primary">Hoàn thành</Button>
        </div>
      </div>
      <div className="mt-5 flex gap-4">
        <div className="w-2/3 ">
          <div className="title">
            <div className="text-2xl font-bold">
              Tiêu đề bài kiểm tra là gì?
            </div>
            <div className="text-slate-400">
              Kỳ hạn cuối ngày 17/5/2023 lúc 11:00
            </div>
          </div>

          <div className="content mt-5">
            <div className="font-medium">Nội dung</div>
            <i className="text-lg">Nội dung bài tập là</i>
            <div>
              <i>Nội dung hướng dẫn là?</i>
            </div>
          </div>

          <div className="content mt-5">
            <div className="font-medium">Bài tập</div>

            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="mt-3 border-[1px] flex justify-center items-center py-3 px-4 bg-gray-100 border-solid border-slate-300 rounded-md shadow-md"
            >
              <input
                id="upload-file-home-work"
                type="file"
                className="hidden"
              />
              {isDragging ? (
                <div className="h-[125px] flex justify-center items-center ">
                  <div className="text-center">
                    <ArrowDownOutlined className="text-[50px]" />
                    <div className="font-bold text-base">
                        Kéo và thả file vào đây...
                    </div>
                  </div>
                </div>
              ) : (
                <label
                  for="upload-file-home-work"
                  className="text-center cursor-pointer"
                >
                  <CloudUploadOutlined className="text-[50px]" />
                  <div className="font-bold">
                    Kéo thả hoặc chọn file bài tập
                  </div>
                  <div className="font-bold text-base  italic">
                    Duy nhất PDF (5MB)
                  </div>
                </label>
              )}
            </div>

            {/* <div className="mt-3 border-[1px] text-base flex justify-between items-center py-3 px-4 bg-gray-100 border-solid border-slate-300 rounded-md shadow-md">
              <div className="flex gap-3 items-center cursor-pointer hover:scale-105 transition duration-700 ease-in-out ">
                <FilePdfOutlined />
                <u className="fileName">Hoàng Minh đức.pdf</u>
              </div>
              <div className="cursor-pointer hover:scale-125 transition duration-700 ease-in-out">
                <DeleteOutlined />
              </div>
            </div> */}
          </div>
        </div>
        <div className="w-1/3">
          <div className="font-medium">Điểm</div>
          <div className="text-lg font-bold">10</div>
        </div>
      </div>
    </div>
  );
}
