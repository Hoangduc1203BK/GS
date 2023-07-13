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
    label: "Thêm lớp",
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
  },
  {
    key: 1,
    label: "Đạt",
    value: "pass_exam",
  },
  {
    key: 1,
    label: "Trượt",
    value: "fail",
  },
  {
    key: 1,
    label: "Đang học thử",
    value: "test",
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
  },
  {
    label: "Từ chối",
    value: "rejected",
  },
  {
    label: "Hủy",
    value: "canceled",
  },
  {
    label: "Chấp thuận",
    value: "approved",
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
    label: "Thêm lớp",
    value: "student_register_class",
  },
  {
    label: "Thôi học",
    value: "student_terminate_class",
  },
];

export const TEACHER_PROPOSAL_TYPE = [
  {
    label: "Thêm lớp",
    value: "teacher_register_class",
  },
  {
    label: "Nghỉ dạy",
    value: "teacher_take_break",
  },
];


export const FORMAT_DATE = {
  YYYYMMDD: "YYYY-MM-DD",
};
