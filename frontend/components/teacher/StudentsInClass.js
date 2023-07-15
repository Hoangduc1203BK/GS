import { getListUser } from "@/api/address";
import { ApiGetListClassWithTeacher, ApiStudentsInClass } from "@/api/student";
import { GRADE, genderVNConvert } from "@/common/const";
import { TeamOutlined } from "@ant-design/icons";
import { Button, Table, message } from "antd";
import { useEffect, useState } from "react";
import PopupCommentStudent from "../popup/popupCommentStudent";
import PopupFeedbacks from "../popup/popupFeedbacks";

export default function StudentsInClass({ info }) {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [isFetchStudent, setIsFetchStudent] = useState(false);
  const [isFetchClass, setIsFetchClass] = useState(true);
  const [expandedKey, setExpandedKey] = useState([]);
  const [listTeacher, setListTeacher] = useState([]);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [isOpenListFeedback, setIsOpenListFeedback] = useState(false);

  const [studentComment, setStudentComment] = useState({});

  const handleCommentStudent = (record) => {
    setStudentComment(record);
    setIsOpenComment(!isOpenComment);
  };

  const handleOpenListFeedback = (record) => {
    setStudentComment(record);
    setIsOpenListFeedback(!isOpenListFeedback);
  };

  const fetchDataClass = async () => {
    try {
      const classOfStudent = await ApiGetListClassWithTeacher();
      setClasses([...classOfStudent?.data]);
      const teachers = await getListUser({
        role: "teacher",
        page: 1,
        size: 999,
      });
      setListTeacher(teachers?.data?.result);
      setIsFetchClass(false);
    } catch (error) {
      console.log(error);
      message.error("Có lỗi xảy ra! Vui lòng thử lại.");
      setIsFetchClass(false);
    }
  };

  const fetchDataStudents = async (expanded, record) => {
    try {
      if (expanded) {
        setIsFetchStudent(true);
        const studentInClass = await ApiStudentsInClass(record.id);
        setStudents(
          studentInClass?.data?.map((i, index) => ({
            ...i,
            key: i?.id,
            number: index + 1,
            gender: i?.gender == "female" ? "Nữ" : "Nam",
          }))
        );
        setIsFetchStudent(false);
        setExpandedKey([record?.key]);
      } else {
        setStudents([]);
        setExpandedKey([]);
        setIsFetchStudent(false);
      }
    } catch (error) {
      console.log(error);
      message.error("Lấy dữ liệu học sinh thất bại!");
    }
  };

  useEffect(() => {
    if (info?.id) {
      fetchDataClass();
    }
  }, [info]);

  const expandedRowRender = (value) => {
    const columns = [
      {
        title: "STT",
        render: (text, record, index) => {
          return <div>{index + 1}</div>;
        },
      },
      {
        title: "Họ và tên",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Ngày sinh",
        dataIndex: "birthDay",
        key: "birthDay",
      },
      {
        title: "Giới tính",
        render: (text, record, index) => {
          return <div>{genderVNConvert(record.gender)}</div>;
        },
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Số điện thoại",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
      },
      {
        title: "Tùy chọn",
        render: (text, record, index) => {
          return (
            <div>
              <Button
                onClick={() => handleCommentStudent(record)}
                className="hover:!bg-sky-600 bg-sky-500 text-white hover:!text-white"
              >
                Nhận xét
              </Button>
              <Button  onClick={() => handleOpenListFeedback(record)}  className="hover:!bg-indigo-600 bg-indigo-500 text-white hover:!text-white">
                Lịch sử
              </Button>
            </div>
          );
        },
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={students?.map((x, indx) => ({ ...x, key: x?.id }))}
        pagination={false}
        loading={isFetchStudent}
      />
    );
  };

  const columns = [
    {
      title: "STT",
      render: (text, record, index) => {
        return <div>{index + 1}</div>;
      },
      align: "center",
      witdh: 40,
    },
    {
      title: "Tên lớp",
      render: (text, record) => {
        return <div>{record?.name}</div>;
      },
      align: "center",
    },
    {
      title: "Giáo viên",
      render: (text, record) => {
        return (
          <div>
            {listTeacher?.find((i) => i?.id === record?.teacher)?.name ||
              "Chưa có"}
          </div>
        );
      },
      align: "center",
    },
    {
      title: "Môn",
      render: (text, record) => {
        return <div>{record?.subject}</div>;
      },
      align: "center",
    },
    {
      title: "Khối",
      render: (text, record) => {
        return <div>Khối {record?.grade}</div>;
      },
      align: "center",
    },
    {
      title: "Lịch học",
      render: (text, record) => {
        return (
          <div className="text-left">
            {record?.time_tables
              ?.map(
                (item) =>
                  `Thứ ${+item?.date + 1} ( ${item?.start} : ${item?.end} ) - ${
                    item?.room_name
                  }`
              )
              ?.join(", ")}
          </div>
        );
      },
      align: "center",
    },
    {
      title: "Sỹ số",
      render: (text, record) => {
        return <div>{record?.number}</div>;
      },
      align: "center",
    },
    {
      title: "Tùy chọn",
      render: (text, record, index) => {
        return (
          <div>
            <Button className="hover:!bg-sky-600 bg-sky-500 text-white hover:!text-white">
              Điểm danh
            </Button>
            <Button className="hover:!bg-indigo-600 bg-indigo-500 text-white hover:!text-white">
              Lịch sử
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PopupCommentStudent
        info={info}
        student={studentComment}
        setOpen={setIsOpenComment}
        open={isOpenComment}
        classId={expandedKey}
      />
      <PopupFeedbacks
        info={info}
        student={studentComment}
        setOpen={setIsOpenListFeedback}
        open={isOpenListFeedback}
        classId={expandedKey}
      />
      <div className="text-2xl font-bold mt-1 mb-5">
        <TeamOutlined /> Danh sách lớp học
      </div>
      <Table
        size="middle"
        dataSource={classes?.map((x) => ({ ...x, key: x.id }))}
        columns={columns}
        loading={isFetchClass}
        expandable={{
          expandedRowRender,
          expandedRowKeys: expandedKey,
          onExpand: (expanded, value) => {
            fetchDataStudents(expanded, value);
          },
        }}
        bordered
        scroll={{ x: 1000 }}
        pagination={false}
      />
      ;
    </div>
  );
}
