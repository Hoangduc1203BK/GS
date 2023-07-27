import { ApiGetListFee } from "@/api/student";
import { GRADE } from "@/common/const";
import { formatVND } from "@/common/util";
import LayoutAdmin from "@/components/LayoutAdmin";
import { TeamOutlined } from "@ant-design/icons";
import { Button, Table, Tabs, message } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function StudentFeeList({ user }) {
  const [classes, setClasses] = useState([]);
  const [isFetchClass, setIsFetchClass] = useState(false);

  const router = useRouter();

  const fetchDataClass = async () => {
    try {
      if (user?.id) {
        setIsFetchClass(true);
        const classOfStudent = (await ApiGetListFee()).data;
        setClasses(
          classOfStudent?.classes.map((i, index) => ({
            ...i,
            key: i?.id,
            number: index + 1,
          }))
        );
        console.log(classOfStudent);

      }
      setIsFetchClass(false);

    } catch (error) {
      message.error("Có lỗi xảy ra! Vui lòng thử lại.");
      setIsFetchClass(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchDataClass();
    }
  }, [user]);

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
        return <div>{record?.className}</div>;
      },
    },
    {
      title: "Khối",
      render: (text, record, index) => {
        return <div>{GRADE.find(el => el.value == record?.grade).label}</div>;
      },
    },
    {
      title: "Môn học",
      render: (text, record, index) => {
        return <div>{record.subject}</div>;
      },
    },

    {
      title: "Buổi học",
      render: (text, record, index) => {
        return <div>{record.numberOfStudy}</div>;
      },
    },
    {
      title: "Học phí",
      render: (text, record, index) => {
        return <div>{formatVND(record?.fee)}</div>;
      },
    }, {
      title: "Tổng tiền",
      render: (text, record, index) => {
        return <div>{formatVND(record?.total)}</div>;
      },
    },
    {
      title: "Tùy chọn",
      render: (text, record, index) => {
        return (
          <div>
            <Button onClick={() => router.push('fee/' + record.classId)} className="hover:!bg-violet-600 bg-violet-500 text-white hover:!text-white ml-3">
              Chi tiết
            </Button>
          </div>
        );
      },
    },
  ];

  const items = [
    {
      key: "1",
      label: `Danh sách điểm danh`,
      children: (
        <div>
          <div className="text-2xl font-bold mt-1 mb-5">
            <TeamOutlined /> Danh sách điểm danh theo lớp học
          </div>
          <Table
            size="middle"
            dataSource={classes?.map((x) => ({ ...x, key: x.classId }))}
            columns={columns}
            bordered
            scroll={{ x: 1000 }}
            pagination={false}
            loading={isFetchClass}
          />
        </div>
      ),
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
}

StudentFeeList.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default StudentFeeList;