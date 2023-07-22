import {
  ApiGetDetailSubAssignments,
  ApiUpdateSubAssignments,
  ApiUploadFileAssigment,
} from "@/api/student";
import { FORMAT_DATE, SUB_ASSIGMENT_STATUS_LIST } from "@/common/const";
import {
  ArrowDownOutlined,
  CloseOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { Button, Select, Spin, Tag, message } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DetailTranscript({ setShowDetail, detail }) {
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [detailSubAssigment, setDetailSubAssigment] = useState();
  const { id } = router.query;

  const [fileAssigment, setFileAssigment] = useState({
    name: "",
  });

  useEffect(() => {
    if (detail?.id) {
      try {
        setLoading(true);
        getDetail();
        setLoading(false);
      } catch (error) {
        message.error("Xem chi tiết bài tập thất bại.");
      }
    }
  }, [detail]);

  const getDetail = async () => {
    const res = (
      await ApiGetDetailSubAssignments({
        assigmentId: detail?.id,
      })
    ).data;
    setDetailSubAssigment({ ...res });
    setFileAssigment({
      name: res?.file,
    });
  };

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

  const handleDrop = async (event) => {
    event.preventDefault();
    setIsDragging(false);
    try {
      setLoading(true);

      const files = event.dataTransfer.files[0];
      const fd = new FormData();
      fd.append("file", files);
      const res = await ApiUploadFileAssigment(id, detail?.id, fd);
      setFileAssigment({
        name: res.data,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log(error);
      message.error("Chọn file thất bại! vui lòng chỉ chọn PDF hoặc IMG");
    }
  };

  const handleBackListWord = () => {
    setShowDetail(false);
  };

  const showStatusAssigment = () => {
    return SUB_ASSIGMENT_STATUS_LIST.find(
      (el) => el.value == detailSubAssigment?.status
    );
  };

  const handleChangeFile = async (ev) => {
    try {
      setLoading(true);
      const files = ev.target.files[0];
      const fd = new FormData();
      fd.append("file", files);
      console.log(fd, 'fd');
      const res = await ApiUploadFileAssigment(id, detail?.id, fd);
      setFileAssigment({
        name: res.data,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log(error);
      message.error("Chọn file thất bại! vui lòng chỉ chọn PDF hoặc IMG");
    }
  };

  const handleCompletedAssigment = async () => {
    try {
      setLoading(true);
      const payload = {
        file: fileAssigment.name,
      };
      await ApiUpdateSubAssignments(detailSubAssigment?.id, payload);
      message.success("Nộp bài thành công.");
      getDetail();
      setLoading(false);
    } catch (error) {
      console.log(error);
      message.error("Nộp bài thất bại! Vui lòng thử lại.");
      setLoading(false);
    }
  };

  const handleDeleteFile = () => {
    setFileAssigment({
      name: "",
    });
  };

  return (
    <Spin tip="Loading" size="large" spinning={isLoading}>
      <div className="mt-3 ml-3">
        <div className=" flex items-center justify-between">
          <div
            onClick={handleBackListWord}
            className="text-xl flex items-center cursor-pointer text-[#1677ff]"
          >
            <LeftOutlined className="flex items-center" />{" "}
            <div className="mb-[5px]">Trở lại</div>
          </div>
          <div className="flex items-center gap-4">
            <Tag
              color={showStatusAssigment()?.color}
              icon={showStatusAssigment()?.icon}
            >
              {showStatusAssigment()?.label}
            </Tag>
            <Button onClick={() => handleCompletedAssigment()} type="primary">
              Hoàn thành
            </Button>
          </div>
        </div>
        <div className="mt-5 flex gap-4">
          <div className="w-2/3 ">
            <div className="title">
              <div className="text-2xl font-bold">{detail?.title}</div>
              <div className="text-slate-400">
                Kỳ hạn cuối ngày{" "}
                {dayjs(detail?.deadline).format(FORMAT_DATE.SPECSIALDATE)}
              </div>
            </div>

            <div className="content mt-5">
              <div className="font-medium">Nội dung</div>
              <i className="text-lg"> {detail?.description}</i>
            </div>

            <div className="content mt-5">
              <div className="font-medium">Bài tập</div>

              {fileAssigment.name ? (
                <div className="mt-3 border-[1px] text-base flex justify-between items-center py-3 px-4 bg-gray-100 border-solid border-slate-300 rounded-md shadow-md">
                  <div className="flex gap-3 items-center cursor-pointer hover:scale-105 transition duration-700 ease-in-out ">
                    <FilePdfOutlined />
                    <u className="fileName">{fileAssigment.name}</u>
                  </div>
                  <div
                    onClick={handleDeleteFile}
                    className="cursor-pointer hover:scale-125 transition duration-700 ease-in-out"
                  >
                    <DeleteOutlined />
                  </div>
                </div>
              ) : (
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
                    onChange={handleChangeFile}
                  />
                  {isDragging ? (
                    <div className="h-[100px] flex justify-center items-center ">
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
                        Duy nhất PDF-IMG (5MB)
                      </div>
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="w-1/3">
            <div className="font-medium">Điểm</div>
            <div className="text-lg font-bold">
              {detailSubAssigment?.point || "Chưa có điểm"}
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}
