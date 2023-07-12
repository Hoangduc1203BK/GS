import { ApiClassOfStudent, ApiStudentsInClass } from "@/api/student";
import { genderVNConvert } from "@/common/const";
import { TeamOutlined } from "@ant-design/icons";
import { Button, Table, message } from "antd";
import { useEffect, useState } from "react";

export default function StudentsInClass({ info }) {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [isFetchStudent, setIsFetchStudent] = useState(false);
  // const []

  const fetchDataClass = async () => {
    try {
      if (info?.id) {
        const classOfStudent = await ApiClassOfStudent(info.id);
        setClasses([...classOfStudent?.data]);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra! Vui lòng thử lại.");
    }
  };

  const fetchDataStudents = async (expanded, value) => {
    if (expanded) {
      setIsFetchStudent(true);
      const studentInClass = await ApiStudentsInClass(value.classId);
      setStudents([...studentInClass.data]);
      setIsFetchStudent(false);
    } else {
      setStudents([]);
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
      {
        title: "Tùy chọn",
        render: (text, record, index) => {
          return <div>
            <Button className="hover:!bg-sky-600 bg-sky-500 text-white hover:!text-white">Nhận xét</Button>
            <Button className="hover:!bg-indigo-600 bg-indigo-500 text-white hover:!text-white">Điểm danh</Button>
          </div>;
        },
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
        return <div>{record.classes.name}</div>;
      },
    },
    {
      title: "Mã môn học",
      render: (text, record, index) => {
        return <div>{record.classes.subjectId}</div>;
      },
    },
    {
      title: "Ngày bắt đầu",
      render: (text, record, index) => {
        return <div>{record.classes.startDate}</div>;
      },
    },
    {
      title: "Giáo viên",
      render: (text, record, index) => {
        return <div>{record.classes.user.name}</div>;
      },
    },
    {
      title: "Lịch dạy",
      render: (text, record, index) => {
        return (
          <div>
            {record.classes.timeTables.map((el, idx) => (
              <div key={idx}>
                Từ {el.start}h đến {el.end}h - Phòng {el.room.name}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: "Tùy chọn",
      render: (text, record, index) => {
        return <div>
          <Button className="hover:!bg-indigo-600 bg-indigo-500 text-white hover:!text-white">lịch sử Điểm danh</Button>
        </div>;
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
          defaultExpandedRowKeys: ["0"],
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
