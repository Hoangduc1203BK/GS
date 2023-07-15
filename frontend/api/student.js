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
