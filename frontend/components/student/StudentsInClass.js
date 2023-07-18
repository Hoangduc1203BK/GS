import { ApiClassOfStudent, ApiStudentsInClass } from "@/api/student";
import { genderVNConvert } from "@/common/const";
import { TeamOutlined } from "@ant-design/icons";
import { Button, Table, message } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function StudentsInClass({ info }) {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [isFetchStudent, setIsFetchStudent] = useState(false);
  const [isFetchClass, setIsFetchClass] = useState(false);

  const [expandedKey, setExpandedKey] = useState([]);
  const router = useRouter();

  const fetchDataClass = async () => {
    try {
      if (info?.id) {
        setIsFetchClass(true);
        const classOfStudent = await ApiClassOfStudent(info.id);
        setClasses(
          classOfStudent?.data?.map((i, index) => ({
            ...i,
            key: i?.id,
            number: index + 1,
          }))
        );
        setIsFetchClass(false);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra! Vui lòng thử lại.");
      setIsFetchClass(false);
    }
  };

  const fetchDataStudents = async (expanded, record) => {
    try {
      if (expanded) {
        setIsFetchStudent(true);
        const studentInClass = await ApiStudentsInClass(record.classId);
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

  const expandedRowRender = () => {
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
    ];

    return (
      <Table
        columns={columns}
        dataSource={students?.map((x, indx) => ({ ...x, key: indx + 1 }))}
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
    },
    {
      title: "Tên lớp",
      render: (text, record, index) => {
        return <div>{record.classes?.name}</div>;
      },
    },
    {
      title: "Mã môn học",
      render: (text, record, index) => {
        return <div>{record.classes?.subjectId}</div>;
      },
    },
    {
      title: "Ngày bắt đầu",
      render: (text, record, index) => {
        return <div>{record.classes?.startDate}</div>;
      },
    },
    {
      title: "Giáo viên",
      render: (text, record, index) => {
        return <div>{record.classes?.user?.name}</div>;
      },
    },
    {
      title: "Lịch học",
      render: (text, record) => {
        return (
          <div className="text-left">
            {record?.classes?.timeTables
              ?.map(
                (item) =>
                  `Thứ ${+item?.date + 1} ( ${item?.start} : ${item?.end} ) - ${
                    item?.room?.name
                  }`
              )
              ?.join(", ")}
          </div>
        );
      },
      align: "center",
    },
    {
      title: "Tùy chọn",
      render: (text, record, index) => {
        return (
          <div>
            <Button
              type="primary"
              onClick={() => router.push(`/student/homework/${record.classId}`)}
            >
              Bài tập
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="text-2xl font-bold mt-1 mb-5">
        <TeamOutlined /> Danh sách lớp học
      </div>
      <Table
        size="middle"
        dataSource={classes?.map((x) => ({ ...x, key: x.classId }))}
        columns={columns}
        expandable={{
          expandedRowRender,
          expandedRowKeys: expandedKey,
          onExpand: (expanded, record) => {
            fetchDataStudents(expanded, record);
          },
        }}
        bordered
        scroll={{ x: 1000 }}
        pagination={false}
        loading={isFetchClass}
      />
      ;
    </div>
  );
}
