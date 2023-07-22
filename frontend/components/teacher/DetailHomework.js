import { ApiGetAssignmentDetail, ApiGetDetailClass } from "@/api/student";
import { FORMAT_DATE, SUB_ASSIGMENT_STATUS_LIST } from "@/common/const";
import { LeftOutlined } from "@ant-design/icons";
import { Button, Table, message } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PopupCheckPoint from "../popup/popupCheckPoint";

export default function TeacherDetailHomework({ info, setIsDetail, idDetail }) {
  const router = useRouter();
  const { id } = router.query;
  const [subAssigments, setSubAssigments] = useState();
  const [classDetail, setClassDetail] = useState();
  const [isFetchClass, setIsFetchClass] = useState(false);
  const [isOpenPoint, setIsOpenPoint] = useState(false);
  const [assigment, setAssigment] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);
  useEffect(() => {
    getDetailAssignment();
  }, [idDetail]);

  useEffect(() => {
    if (isUpdate) {
      getDetailAssignment();
    }
  }, [isUpdate]);

  const getDetailAssignment = async () => {
    try {
      setIsFetchClass(true);
      const res = await ApiGetAssignmentDetail(idDetail);
      const resClass = await ApiGetDetailClass(id);
      setSubAssigments({ ...res.data });
      setClassDetail({ ...resClass.data });
      setIsFetchClass(false);
    } catch (error) {
      console.log(error);
      message.error("Xem chi tiết bài tập thất bại");
      setIsDetail(false);
      setIsFetchClass(false);
    }
  };

  const handleBackListHomework = () => {
    setIsDetail(false);
  };

  const columns = [
    {
      title: "STT",
      render: (text, record, index) => {
        return <div>{index + 1}</div>;
      },
      align: "center",
      witdh: 20,
    },
    {
      title: "Họ tên",
      dataIndex: "student",
      key: "student",
    },
    {
      title: "Bài làm",
      render: (text, record, index) => {
        return (
          <a href={record.file} target="_blank">
            {record.file || ""}
          </a>
        );
      },
    },

    {
      title: "Điểm",
      dataIndex: "point",
      key: "point",
    },
    {
      title: "Nhận xét",
      dataIndex: "feedback",
      key: "feedback",
    },
    {
      title: "Trạng thái",
      render: (text, record, index) => {
        return (
          <div>
            {
              SUB_ASSIGMENT_STATUS_LIST.find((el) => el.value == record.status)
                .label
            }
          </div>
        );
      },
    },
    {
      title: "Tùy chọn",
      render: (text, record, index) => {
        return (
          <Button
            onClick={() => {
              setAssigment(record);
              setIsOpenPoint(true);
            }}
            type="primary"
          >
            Chấm điểm
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <PopupCheckPoint
        setOpen={setIsOpenPoint}
        open={isOpenPoint}
        assigment={assigment}
        setIsUpdate={setIsUpdate}
      />

      <div
        onClick={handleBackListHomework}
        className="text-xl flex items-center cursor-pointer text-[#1677ff]"
      >
        <LeftOutlined className="flex items-center" />{" "}
        <div className="mb-[5px]">Trở lại</div>
      </div>
      <div className="flex justify-between w-full gap-6">
        <div className="custom-table my-3 w-1/3 ml-3">
          <table className="w-full">
            <tbody>
              <tr>
                <th className="text-left w-[125px]">Tên lớp</th>
                <td>{classDetail?.name}</td>
              </tr>
              <tr>
                <th className="text-left">Môn</th>
                <td>{classDetail?.subject?.name}</td>
              </tr>
              <tr>
                <th className="text-left">Giáo viên</th>
                <td>{classDetail?.user?.name}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="custom-table my-3 w-2/5">
          <div className="flex p-1">
            <div className="text-left w-[100px] font-bold">Ngày kết thúc:</div>
            <div className="w-subtraction-100">
              {dayjs(subAssigments?.deadline).format(FORMAT_DATE.YYYYMMDDHHMM)}
            </div>
          </div>
          <div className="flex p-1">
            <div className="text-left w-[100px] font-bold">Tiêu đề:</div>
            <div className="w-subtraction-100">{subAssigments?.title}</div>
          </div>
          <div className="flex p-1">
            <div className="text-left w-[100px] font-bold">Nội dung:</div>
            <div className="w-subtraction-100">
              {subAssigments?.description}
            </div>
          </div>
        </div>
      </div>

      <div>
        <Table
          size="middle"
          className="!w-full"
          dataSource={subAssigments?.subAssigments?.map((x) => ({
            ...x,
            key: x.id,
          }))}
          columns={columns}
          loading={isFetchClass}
          bordered
          scroll={{ x: 1000 }}
          pagination={false}
        />
      </div>
    </div>
  );
}
