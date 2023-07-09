import { ApiClassOfStudent, ApiStudentsInClass } from "@/api/student";
import { genderVNConvert } from "@/common/const";
import { TeamOutlined } from "@ant-design/icons";
import { Table } from "antd";
import { useEffect, useState } from "react";

export default function StudentsInClass({info}) {

    const [students, setStudents] = useState([])

    const fetchData = async () => {
        if (info?.id) {
          const classOfStudent = await ApiClassOfStudent(info.id);
          const classId = classOfStudent?.data[0]?.classId;
          if(classId){
            const studentInClass = await ApiStudentsInClass(classId);
            setStudents([...studentInClass.data])
          }
        }
      };
      
    useEffect(()=>{
        if(info?.id){
            fetchData()
        }   
    },[info])



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
        dataIndex: "Email",
        key: "Email",
      },
      {
        title: "Số điện thoại",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
      },
  ];

  return (
    <div>
      <div className="text-2xl font-bold mt-1 mb-5">
      <TeamOutlined /> Danh sách lớp
      </div>
      <Table
        size="middle"
        dataSource={students?.map((x) => ({ ...x, key: x?.classroom }))}
        columns={columns}
        bordered
        scroll={{ x: 1000 }}
        pagination={{
          locale: { items_per_page: "/ trang" },
          // total: listResult?.length,
          showTotal: (total, range) => (
            <span>{`${range[0]} - ${range[1]} / ${total}`}</span>
          ),
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          defaultPageSize: 10,
          position: ["bottomRight"],
        }}
      />
      ;
    </div>
  );
}
