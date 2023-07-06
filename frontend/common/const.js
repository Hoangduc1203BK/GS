export const GRADE = new Array(9).fill({}).map((item, index) => ({
  label: `Lớp ${index + 1}`,
  value: `Lớp ${index + 1}`,
  key: index
}))