import {
  CheckOutlined, CloseOutlined, ExclamationOutlined, IssuesCloseOutlined, WarningOutlined, CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

export const checkNameField = (field) => {
  switch (field) {
    case "phoneNumber":
      return "Số Điện Thoại";
    case "address":
      return "Địa chỉ";
    case "name":
      return "Họ và tên";
    case "gender":
      return "Giới tính";
    case "subject":
      return "Môn";
    case "birthDay":
      return "Ngày sinh";
    case "email":
      return "Email";
    case "major":
      return "Chuyên ngành";
    case "grade":
      return "Khối";
    default:
      break;
  }
};

export const genderVNConvert = (key) => {
  switch (key) {
    case "male":
      return "Nam";
    case "female":
      return "Nữ";
    default:
      break;
  }
};

export const OPTION_SUBJECT = [
  {
    value: "",
    label: "--Chọn--",
    disabled: false,
  },
  {
    value: "toan",
    label: "Toán",
    disabled: false,
  },
  {
    value: "li",
    label: "Lí",
    disabled: false,
  },
  {
    value: "hoa",
    label: "Hóa",
    disabled: false,
  },
  {
    value: "van",
    label: "Văn",
    disabled: false,
  },
  {
    value: "su",
    label: "Sử",
    disabled: false,
  },
  {
    value: "dia",
    label: "Địa",
    disabled: false,
  },
  {
    value: "sinh",
    label: "Sinh",
    disabled: false,
  },
];

export const TYPE_SUGGEST_STUDENT = [
  {
    value: 1,
    label: "Chuyển lớp",
  },
  {
    value: 2,
    label: "Đăng ký lớp học mới",
  },
];
export const GRADE = new Array(9).fill({}).map((item, index) => ({
  label: `Khối ${index + 1}`,
  value: `${index + 1}`,
  key: index,
}));

export const RESULT_EXAM = [
  {
    key: 1,
    label: "Đang chờ",
    value: "pending",
    color: "blue",
    icon: <SyncOutlined spin />
  },
  {
    key: 1,
    label: "Đạt",
    value: "pass_exam",
    color: "green",
    icon: <CheckCircleOutlined />
  },
  {
    key: 1,
    label: "Trượt",
    value: "fail",
    color: "red",
    icon: <CloseCircleOutlined />
  },
  {
    key: 1,
    label: "Đang học thử",
    value: "test",
    color: "cyan",
    icon: <ClockCircleOutlined />
  },
];

export const PROPOSAL_STATUS = {
  PENDING: "pending",
  REJECTED: "rejected",
  CANCELED: "canceled",
  APPROVED: "approved",
};

export const PROPOSAL_STATUS_LIST = [
  {
    label: "Chờ phê duyệt",
    value: "pending",
    color: "blue",
    icon: <SyncOutlined spin />
  },
  {
    label: "Từ chối",
    value: "rejected",
    color: "red",
    icon: <CloseCircleOutlined />
  },
  {
    label: "Hủy",
    value: "canceled",
    color: "gray",
    icon: <MinusCircleOutlined />
  },
  {
    label: "Chấp thuận",
    value: "approved",
    color: "green",
    icon: <CheckCircleOutlined />
  },
];

export const PROPOSAL_TYPE = {
  TEACHER_REGISTER_CLASS: "teacher_register_class",
  STUDENT_REGISTER_CLASS: "student_register_class",
  TEACHER_TAKE_BRAKE: "teacher_take_break",
  STUDENT_TERMINATE_CLASS: "student_terminate_class",
};

export const STUDENT_PROPOSAL_TYPE = [
  {
    label: "Đăng ký lớp học mới",
    value: "student_register_class",
  },
  {
    label: "Thôi học",
    value: "student_terminate_class",
  },
];

export const TEACHER_PROPOSAL_TYPE = [
  {
    label: "Đăng ký lớp mới",
    value: "teacher_register_class",
  },
  {
    label: "Nghỉ dạy",
    value: "teacher_take_break",
  },
];

export const FORMAT_DATE = {
  YYYYMMDD: "YYYY-MM-DD",
  ddmmyyyy: "DD/MM/YYYY",
  YYYYMMDDHHMM: "YYYY-MM-DD HH:mm",
  DATE: "Ngày DD/MM/YYYY",
  SPECSIALDATE: "YYYY/MM/DD Lúc HH:mm"
};

export const SUB_ASSIGMENT_STATUS = {
  PENDING: "pending",
  TURN_IN: "turn_in",
  TURN_IN_LATE: "turn_in_late",
  PAST_DUE: "past_due",
  CANCELED: "canceled",
};

export const SUB_ASSIGMENT_STATUS_LIST = [
  {
    label: "Chưa hoàn thành",
    value: "pending",
    color: "processing",
    icon: <CloseOutlined />
  },
  {
    label: "Hoàn thành",
    value: "turn_in",
    color: "success",
    icon: <CheckOutlined />
  },
  {
    label: "Nộp muộn",
    value: "turn_in_late",
    color: "warning",
    icon: <WarningOutlined />

  },
  {
    label: "Quá hạn",
    value: "past_due",
    color: "error",
    icon: <IssuesCloseOutlined />

  },
  {
    label: "Hủy",
    value: "canceled",
    color: "",
    icon: <ExclamationOutlined />
  },
];

export const STATUS_ASIGGMENT = [
  {
    value: "active",
    label: "",
  },
  {
    value: "deactive",
    label: "",
  },
];

export const COLORS = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
  'aqua'
];
