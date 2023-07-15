import { ApiGetFeedbacks } from "@/api/student";
import { FORMAT_DATE } from "@/common/const";
import { Button, Modal, Table, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function PopupFeedbacks({
  open,
  setOpen,
  student,
  info,
  classId,
}) {
  const [feedbacks, setFeedback] = useState([]);
  const [isFetching, setFetching] = useState(false);

  useEffect(() => {
    if (open) {
      getListFeedbacks();
    }
  }, [open]);

  const getListFeedbacks = async () => {
    try {
      setFetching(true);
      const params = {
        type: "teacher",
        form: info?.id,
        to: student?.id,
        classId: classId[0],
      };
      const response = await ApiGetFeedbacks(params);
      setFeedback([...response.data]);
      setFetching(false);
    } catch (error) {
      message.error("Xem lịch sử nhận xét thất bại! Vui lòng thử lại");
      setOpen(false);
      setFetching(false);
    }
  };

  const columns = [
    {
      title: "STT",
      render: (text, record, index) => {
        return <div>{index + 1}</div>;
      },
      align: "center",
    },
    {
      title: "Tên lớp",
      dataIndex: "className",
      key: "className",
    },
    {
      title: "Người gửi",
      dataIndex: "fromUser",
      key: "fromUser",
    },
    {
      title: "Ngày",
      render: (text, record, index) => {
        return (
          <div>{dayjs(record?.createAt).format(FORMAT_DATE.ddmmyyyy)}</div>
        );
      },
    },
    {
      title: "Nội dung",
      dataIndex: "feedback",
      key: "feedback",
    },
  ];

  return (
    <>
      <Modal
        title="Nhận xét học sinh"
        open={open}
        okType={false}
        cancelText="Đóng"
        footer={
          <Button
            type="primary"
            onClick={() => {
              setOpen(false);
            }}
          >
            Đóng
          </Button>
        }
        width={800}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <Table
          size="middle"
          dataSource={feedbacks?.map((x) => ({ ...x, key: x.id }))}
          columns={columns}
          loading={isFetching}
          bordered
          className="w-full"
          pagination={false}
        />
      </Modal>
    </>
  );
}
