import { getAttendance, getListAttendance, getListUser, getListUserInClass } from "@/api/address";
import { ApiGetListClassWithTeacher, ApiStudentsInClass, postAttendance, updateAttendance } from "@/api/student";
import { GRADE, genderVNConvert } from "@/common/const";
import { CheckCircleFilled, CloseCircleFilled, TeamOutlined } from "@ant-design/icons";
import { Avatar, Button, Checkbox, List, Modal, Table, message } from "antd";
import { useEffect, useState } from "react";
import PopupCommentStudent from "../popup/popupCommentStudent";
import PopupFeedbacks from "../popup/popupFeedbacks";
import { useRouter } from "next/router";
import dayjs from "dayjs";

export default function StudentsInClass({ info, watchHistory }) {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [isFetchStudent, setIsFetchStudent] = useState(false);
  const [isFetchClass, setIsFetchClass] = useState(true);
  const [expandedKey, setExpandedKey] = useState([]);
  const [listTeacher, setListTeacher] = useState([]);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [isOpenListFeedback, setIsOpenListFeedback] = useState(false);

  const router = useRouter()
  const [studentComment, setStudentComment] = useState({});

  const [modal, setModal] = useState({
    open: false,
    mode: 0, //0 - add | 1 - edit
    data: {}
  });

  const [listStudentAttendance, setListStudentAttendance] = useState([]);

  async function handleModal(open, record) {
    if (open) {
      await getListUserInClass(record?.id).then(
        res => {
          if (res?.data?.length > 0) {
            getAttendance({ classId: record?.id, date: "3", day: "2023-07-19" }).then(
              // getAttendance({ classId: record?.id, date: dayjs().day(), day: dayjs().format("YYYY-MM-DD") }).then(
              resAtt => {
                if (resAtt?.data?.students?.length > 0) {
                  res?.data?.forEach(i => {
                    const index = resAtt?.data?.students?.findIndex(el => el?.studentId === i?.id)
                    if (index >= 0) {
                      i.status = resAtt?.data?.students[index].status
                    } else i.status = false
                    i.attendanceId = resAtt?.data?.id
                  })
                  setModal({
                    open: true,
                    mode: 1,
                    data: record
                  })
                } else {
                  setModal({
                    open: true,
                    mode: 0,
                    data: record
                  })
                }
                setListStudentAttendance(res?.data?.map(i => ({ ...i, key: i?.id })))
              }
            ).catch(err => {
              message.error("Chưa có bảng điểm danh! Vui lòng cập nhật!")
              setListStudentAttendance(res?.data?.map(i => ({ ...i, key: i?.id })))
              setModal({
                open: true,
                mode: 0,
                data: record
              })
            })
          } else {
            message.error("Chưa có học sinh nào trong lớp!")
          }
        }
      )
    } else {
      setListStudentAttendance([])
      setModal({
        open: false,
        mode: 0,
        data: {}
      })
    }
  }

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
              <Button onClick={() => handleOpenListFeedback(record)} className="hover:!bg-indigo-600 bg-indigo-500 text-white hover:!text-white">
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
                  `Thứ ${+item?.date + 1} ( ${item?.start} : ${item?.end} ) - ${item?.room_name
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
          <div className="block w-[125px]">
            <Button className="hover:!bg-sky-600 w-[125px] bg-sky-500 text-white hover:!text-white" onClick={() => handleModal(true, record)}>
              Điểm danh
            </Button>
            <Button className="hover:!bg-indigo-600 w-[125px] bg-indigo-500 text-white hover:!text-white" onClick={() => watchHistory(record)}>
              Lịch sử
            </Button>
            <Button onClick={() => router.push(`/teacher/class/homework/${record.id}`)} className="hover:!bg-green-600 w-[125px] bg-green-500 text-white hover:!text-white">
              Bài tập
            </Button>
          </div>
        );
      },
    },
  ];

  // for checkbox
  const onChange = (e, record) => {
    listStudentAttendance?.forEach(i => i?.id === record?.id ? i.status = e.target.checked : i)
    setListStudentAttendance([...listStudentAttendance])
  };

  async function saveAttendance() {
    if (modal.mode == 0) {
      const params = {
        classId: modal.data?.id,
        teacherId: modal.data?.teacher_of_day,
        date: dayjs().day() + "",
        day: dayjs().format("YYYY-MM-DD"),
        attendances: listStudentAttendance?.map(i => ({ id: i?.id, status: i?.status || false }))
      }
      postAttendance(params).then(
        res => {
          if (res?.data?.id) {
            message.success("Cập nhật điểm danh thành công!")
            setModal({
              open: false,
              mode: 0
            })
            setListStudentAttendance([])
          } else {
            message.error("Cập nhật điểm danh thất bại!")
          }
        }
      ).catch(err => message.error("Có lỗi xảy ra! " + err))

    } else {
      const params = {
        attendances: listStudentAttendance?.map(i => ({ id: i?.id, status: i?.status, attendanceId: i?.attendanceId }))
      }
      updateAttendance(params, modal?.data?.id, dayjs().format("YYYY-MM-DD"), dayjs().day() + "").then(
        res => {
          console.log(res, 'resss');
          if (res?.data?.id) {
            message.success("Cập nhật điểm danh thành công!")
            setModal({
              open: false,
              mode: 0
            })
            setListStudentAttendance([])
          } else {
            message.error("Cập nhật điểm danh thất bại!")
          }
        }
      ).catch(err => message.error("Có lỗi xảy ra! " + err))
    }
  }

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
      <Modal
        open={modal.open}
        title={`Cập nhật điểm danh ngày ${dayjs().format("DD-MM-YYYY")}`}
        onCancel={() => handleModal(false)}
        okText="Lưu"
        cancelText="Hủy"
        onOk={saveAttendance}
      >
        <List
          itemLayout="horizontal"
          dataSource={listStudentAttendance}
          renderItem={(item, index) => (
            <List.Item
              key={item?.id}
              className="hover:scale-105 duration-500 group hover:shadow-xl !px-4"
              extra={
                <Checkbox checked={item?.status} onChange={e => onChange(e, item)}>Điểm danh</Checkbox>
              }
            >
              <List.Item.Meta
                avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                title={<p className="group-hover:font-bold duration-500">{item.name}</p>}
                description={<p className="group-hover:font-semibold">{item?.id}</p>}
              />
            </List.Item>
          )}
        />
      </Modal>
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
    </div>
  );
}
