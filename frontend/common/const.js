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
  key: index
}))

export const RESULT_EXAM = [
  {
    key: 1,
    label: "Đang chờ",
    value: "pending"
  },
  {
    key: 1,
    label: "Đạt",
    value: "pass_exam"
  },
  {
    key: 1,
    label: "Trượt",
    value: "fail"
  },
  {
    key: 1,
    label: "Đang học thử",
    value: "test_learning"
  }
]
