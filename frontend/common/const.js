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