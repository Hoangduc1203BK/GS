import { ApiClassOfStudent, ApiCreateFeedback, ApiStudentsInClass } from "@/api/student";
import { genderVNConvert } from "@/common/const";
import { SolutionOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Table, message } from "antd";
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

  const [modal, setModal] = useState({
    open: false,
    record: null
  });

  function handleModal(record) {
    setModal({
      open: true,
      record: record
    })
  }
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
                  `${+item?.date + 1 === 8 ? 'Chủ nhật' : `Thứ ${+item?.date + 1}`} ( ${item?.start} : ${item?.end} ) - ${item?.room?.name}`
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
          <div className="flex gap-2">
            <Button
              type="primary"
              onClick={() => router.push(`/student/homework/${record.classId}`)}
            >
              Bài tập
            </Button>
            <Button
              // type="primary"
              className="hover:!bg-violet-600 bg-violet-500 text-white hover:!text-white "
              onClick={() => handleModal(record)}
            >
              Góp ý
            </Button>
          </div>
        );
      },
    },
  ];

  const [feedback, setFeedback] = useState('');
  async function saveFeedback() {
    if (!feedback) {
      message.error("Vui lòng nhập nhận xét!")
    } else {
      const params = {
        classId: modal?.record?.classes?.id,
        from: modal?.record?.userId,
        to: modal?.record?.classes?.teacher,
        type: "student",
        feedback: feedback
      }
      ApiCreateFeedback(params).then(res => {
        console.log(res, 'resss');
        if (res?.data?.id) {
          message.success("Gửi nhận xét thành công!")
          setModal({
            open: false,
            record: null
          })
          setFeedback("")
        } else {
          message.error("Nhận xét không thành công! Vui lòng thử lại sau!")
        }
      }).catch(err => message.error("Có lỗi kỹ thuật! Vui lòng kiểm tra lại! " + err))
    }
  }
  return (
    <div>
      <Modal
        open={modal.open}
        title={"Góp ý"}
        footer={null}
        onCancel={() => setModal({
          open: false,
          record: null
        })}
      >
        <p className="text-lg my-4"><SolutionOutlined /> Lớp: {modal?.record?.classes?.name}</p>
        <p className="text-lg mb-4"><UserOutlined /> Giáo viên: {modal?.record?.classes?.user?.name}</p>
        <Form.Item label="Nhận xét" required>
          <Input.TextArea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} placeholder="Nhận xét tại đây..." />
        </Form.Item>
        <div className="flex justify-center gap-2">
          <Button type="primary" onClick={saveFeedback} >Lưu</Button>
          <Button onClick={() => setModal({
            open: false,
            record: null
          })}>Hủy</Button>
        </div>
      </Modal>
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
