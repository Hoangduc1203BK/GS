import { ApiGetAssignments } from "@/api/student";
import { dayOfWeekVn } from "@/common/util";
import LayoutAdmin from "@/components/LayoutAdmin";
import PopupCreateHomework from "@/components/popup/popupCreateHomework";
import TeacherDetailHomework from "@/components/teacher/DetailHomework";
import { CheckOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Pagination, Table, Tag, message } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function TeacherHomeworks({ user }) {
  const [idDeteil, setIdDetail] = useState("");
  const [isDetail, setIsDetail] = useState(false);
  const [isOpenCre, setIsOpenCre] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const [page, setPage] = useState({
    linePer: 10,
    page: 1,
  });

  const [assignments, setAssignments] = useState({
    total: 0,
    data: [],
  });
  const [assignmentDetail, setAssignmentDetail] = useState();

  useEffect(() => {
    if (!isOpenCre) {
      fetchAssignments();
    }
  }, [isOpenCre]);

  const fetchAssignments = async () => {
    try {
      const res = (await ApiGetAssignments({ classId: id, ...page })).data;
      setAssignments({
        data: [...res.result],
        total: res.total,
      });
    } catch (error) {
      console.log(error);
      message.error("Xem danh sách bài tập thất bại! Vui lòng thủ lại sau");
    }
  };

  const handleClickDetail = (id) => {
    console.log(id);
    setIsDetail(true);
    setIdDetail(id);
  };

  const handleBackClasses = () => {
    router.push("/teacher/class");
  };

  const hanldeUpdate = (detail) => {
    setIsOpenCre(true);
    setAssignmentDetail(detail);
  };

  const handleChangePageOption = (page, linePer) => {
    setPage({
      page,
      linePer,
    });
    fetchAssignments();
  };

  const handleDeleteAssignment = async (id) => {
    try {
      await ApiUpdateHomework(detail?.id, { status: "deactive" });
      message.success("Xóa bài tập thành công!");
    } catch (error) {
      message.success("Xóa bài tập thất bại! Vui lòng thử lại.");
    }
  };
  return (
    <div>
      <PopupCreateHomework
        detail={assignmentDetail}
        setOpen={setIsOpenCre}
        open={isOpenCre}
        classId={id}
      />
      {isDetail ? (
        <div className="transaction-detail">
          <TeacherDetailHomework
            info={user}
            idDetail={idDeteil}
            setIsDetail={setIsDetail}
          />
        </div>
      ) : (
        <div className="transaction-list  ml-3">
          {/* <div className="flex justify-between"> */}
          <div
            onClick={handleBackClasses}
            className="text-xl flex items-center cursor-pointer text-[#1677ff] w-[75px]"
          >
            <LeftOutlined className="flex items-center" />{" "}
            <div className="mb-[5px]">Trở lại</div>
          </div>
          <div className="flex justify-end">
            <Button
              type="primary"
              onClick={() => {
                setIsOpenCre(true), setAssignmentDetail({});
              }}
            >
              Thêm mới
            </Button>
          </div>
          {assignments.data?.map((el, index) => (
            <div className="mt-4 p-4" key={index}>
              <div className="flex gap-5 text-xl mb-3">
                <div className="font-bold">
                  {dayjs(el.ctime).format("Ngày DD/MM/YYYY")}
                </div>
                <div className=" text-slate-400">{dayOfWeekVn(el.ctime)}</div>
              </div>

              <div className="border-[1px] flex justify-between items-center py-3 px-4 bg-gray-100 border-solid border-slate-300 rounded-md shadow-md">
                <div
                  onClick={() => handleClickDetail(el.id)}
                  className=" cursor-pointer hover:scale-105 transition duration-700 ease-in-out"
                >
                  <div className="font-bold">{el.title}</div>
                  <div>
                    Đã gửi và lúc{" "}
                    {`${dayjs(el.ctime)
                      .hour()
                      .toString()
                      .padStart(2, "0")}:${dayjs(el.ctime)
                      .minute()
                      .toString()
                      .padStart(2, "0")}`}
                  </div>
                </div>
                <div>
                  <Button onClick={() => hanldeUpdate(el)} type="primary">
                    Chỉnh sửa
                  </Button>
                  <Button
                    onClick={() => handleDeleteAssignment(el.id)}
                    type="primary"
                    danger
                    className="ml-4"
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end mt-3">
            <Pagination
              current={page.page}
              pageSize={page.linePer}
              onChange={handleChangePageOption}
              total={assignments.total}
            />
          </div>
        </div>
      )}
    </div>
  );
}

TeacherHomeworks.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default TeacherHomeworks;
