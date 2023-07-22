import axios, { Axios } from "axios";
import { deleteCookie, getCookie, setCookie } from "./cookies";
import Cookies from "js-cookie";
export const setToken = (token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export function ApiClassOfStudent(userId, params) {
  return axios.get("/class/user/" + userId, {
    params,
  });
}
export function ApiStudentsInClass(classId) {
  return axios.get("/class/" + classId + "/users");
}

export function ApiGetListSubject(params) {
  return axios.get("/subject", {
    params: params,
  });
}

export function ApiGetListClass(params) {
  return axios.get("/class", {
    params: params,
  });
}

export function ApiGetDetailClass(id) {
  return axios.get("/class/" + id);
}

export function ApiGetListClassEmpty(params) {
  return axios.get("/class/student-empty", {
    params: params,
  });
}

export function ApiGetListClassTeacherEmpty(params) {
  return axios.get("/class/empty", {
    params: params,
  });
}

export function ApiCreateSuggest(data) {
  return axios.post("/proposal", data);
}

export function ApiGetListSuggest(params) {
  return axios.get("/proposal", {
    params: { ...params },
  });
}

export function ApiGetListSchedule() {
  return axios.get("/class/schedules");
}

export function ApiGetListClassWithTeacher() {
  return axios.get("/class/list-class-of-teacher");
}

export function ApiCreateFeedback(payload) {
  return axios.post("/feedback", payload);
}

export function ApiGetFeedbacks(params) {
  return axios.get("/feedback", { params });
}

export function ApiCreateHomework(payload) {
  return axios.post("/assigments", payload);
}

export function ApiUpdateHomework(id, payload) {
  return axios.patch(`/assigments/${id}`, payload);
}

export function ApiGetAssignments(params) {
  return axios.get('/assigments', {
    params
  })
}

export function ApiGetAssignmentDetail(id) {
  return axios.get('/assigments/' + id);
}

export function ApiGetStudentAssignments(params) {
  return axios.get('/assigments/student', {
    params: params
  })
}

export function ApiGetDetailSubAssignments(params) {
  return axios.get('/assigments/sub-assigment', {
    params
  })
}

export function ApiUpdateSubAssignments(id, payload) {
  return axios.patch('/assigments/sub-assigment/' + id, payload);
}

export function ApiUploadFileAssigment(classId, assigmentId, fd) {

  return axios.post(`/assigments/upload?classId=${classId}&assigmentId=${assigmentId}`, fd);
}

export function ApiGetListFee() {
  return axios.get(`/user/fee`);
}

export function ApiGetListTimeKeeping() {
  return axios.get(`/user/timekeeping`);
}

export function ApiGetDetailTimeKeeping(params) {
  return axios.get(`/user/timekeeping/detail`, {
    params
  });
}

export function ApiGetDetailFee(params) {
  return axios.get(`/user/fee/detail`, {
    params
  });
}
// attendance
export const getAttendance = (params) => {
  return axios.get(`/class/attendance`, { params: params })
}

export const postAttendance = (params) => {
  return axios.post(`/class/attendance`, params)
}

export const updateAttendance = (params, classId, day, date) => {
  return axios.patch(`/class/attendance?classId=${classId}&day=${day}&date=${date}`, params)
}