import { getListTestLearning } from "@/api/address";
import { COLORS } from "@/common/const";
import { SolutionOutlined } from "@ant-design/icons";
import { Badge, Table, message } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function StudentsInClassTest({ info }) {
  const [classes, setClasses] = useState([]);
  const [isFetchClass, setIsFetchClass] = useState(false);
  const [listLearned, setListLearned] = useState({});
  const [tableParams, setTableParams] = useState({
    page: 1,
    size: 10,
  });
  const router = useRouter();

  const fetchDataClass = async () => {
    try {
      if (info?.id) {
        setIsFetchClass(true);
        const classOfStudent = await getListTestLearning({...tableParams,status: 'active', userId : info.id});
        setListLearned(classOfStudent.data)
        setIsFetchClass(false);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra! Vui lòng thử lại.");
      setIsFetchClass(false);
    }
  };

  useEffect(() => {
    if (info?.id) {
      fetchDataClass();
    }
  }, [info]);

  const columnsLearned = [
    {
      title: "STT",
      render: (text, record, index) => {
        return <div>{index + 1}</div>;
      },
      align: "center",
    },
    {
      title: "Mã HS",
      render: (text, record) => {
        return <div>{record?.studentId}</div>;
      },
      align: "center",
    },
    {
      title: "Họ và tên",
      render: (text, record) => {
        return <div>{record?.student}</div>;
      },
      align: "center",
    },
    {
      title: "Số điện thoại",
      render: (text, record) => {
        return <div>{record?.phoneNumber}</div>;
      },
      align: "center",
    },
    {
      title: "Khối",
      render: (text, record) => {
        return <div><Badge key={COLORS[record?.grade]} color={COLORS[record?.grade]} text={`Khối ${record?.grade || "..."} `} /></div>;
      },
      align: "center",
    },
    {
      title: "Môn đăng ký",
      render: (text, record) => {
        return <div>{record?.subject}</div>;
      },
      align: "center",
    },
    {
      title: "Lớp học thử",
      render: (text, record) => {
        return <div>{record?.class}</div>;
      },
      align: "center",
    },
    {
      title: "Lớp học thử",
      render: (text, record) => {
        return <div>{record?.class}</div>;
      },
      align: "center",
    },
    {
      title: "Lịch học thử",
      render: (text, record) => {
        return <div>Thứ {record?.timeTable?.date} ( {record?.timeTable?.start} : {record?.timeTable?.end} )</div>;
      },
      align: "center",
    },
    {
      title: "Ghi chú",
      render: (text, record) => {
        return <div>{record?.description}</div>;
      },
      align: "center",
    }
  ]

  function handleChangeTableLearned(pagination) {
    setTableParams({
      ...tableParams,
      page: pagination.current,
      size: pagination.pageSize,
    })
  }

  return (
    <div>
      <div className="text-2xl font-bold mt-1 mb-5">
      <SolutionOutlined /> Danh sách lớp học Thử
      </div>
      <Table
        locale={{
          emptyText: (
            <div style={{ marginTop: "20px" }}>
              {listLearned?.result?.length === 0 ? "Không có dữ liệu!" : null}
            </div>
          ),
        }}
        size="middle"
        style={{
          marginTop: "10px",
          width: "100%",
        }}
        dataSource={listLearned?.result?.map((el) => ({ ...el, key: el?.id }))}
        columns={columnsLearned}
        bordered
        onChange={handleChangeTableLearned}
        loading={isFetchClass}
        pagination={{
          locale: { items_per_page: "/ trang" },
          total: listLearned?.totalPages,
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
