import axios, { Axios } from "axios";
import {
	deleteCookie,
	getCookie,
	setCookie,
} from "./cookies";
import Cookies from "js-cookie";
export const setToken = (token) => {
	axios.defaults.headers.common[
		"Authorization"
	] = `Bearer ${token}`;
};
axios.defaults.baseURL = "http://localhost:4000/api/v1";

axios.interceptors.response.use(
	(response) => {
		if (response && response.status < 500) {
			return response;
		}
		throw new Error(
			response?.errors || "Response not handle"
		);
	},
	(error) => {
		const { response } = error;
		if (response && [401, 403].includes(response.status)) {
			if (typeof window !== "undefined")
				window.localStorage?.removeItem("token");
			deleteCookie("token");
			window.location.href = "/login";
		}
		// throw error
	}
);

// axios.interceptors.request.use(
// 	async (config) => {
// 		const token = Cookies.get("token");
// 		const refreshToken = Cookies.get("rf_token");
// 		if (token) {
// 			config.headers.Authorization = `Bearer ${token}`;
// 		}
// 		if (!token && refreshToken) {
// 			const result = await Axios.post(
// 				"http://localhost:3000/auth/refresh-token",
// 				{
// 					refresh_token: refreshToken,
// 				}
// 			);
// 			if (result?.data?.access_token) {
// 				Cookies.set(
// 					"token",
// 					result?.data?.access_token?.value,
// 					{
// 						expires:
// 							result?.data?.access_token?.expires_in /
// 							86400,
// 					}
// 				);
// 				config.headers.Authorization = `Bearer ${result?.data?.access_token?.value}`;
// 			}
// 		}
// 		return config;
// 	},
// 	(error) => Promise.reject(error)
// );

export async function getMeInfo(token) {
	return fetch(`http://localhost:4000/api/v1/auth/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
}

export const authMe = () => {
	return axios.get("/auth/me");
};

export const login = (params) => {
	return axios.post("/auth/login", params);
};

// classroom
export const getListClassRoom = () => {
	return axios.get("/class/room");
};

export const createClassRoom = (params) => {
	return axios.post("/class/room", params);
};

export const updateClassRoom = (id, params) => {
	return axios.patch(`/class/room/${id}`, params);
};

// user
export const getListUser = (params) => {
	return axios.get("/user", { params: params });
};
export const createUser = (params) => {
	return axios.post("/user", params);
};


// subject
export const getListSubject = (params) => {
	return axios.get("/subject", { params: params });
};

// exam
export const getListExam = (params) => {
	return axios.get("/exam", { params: params });
};

export const createExam = (params) => {
	return axios.post("/exam", params);
};

export const updateExam = (id, params) => {
	return axios.patch(`/exam/${id}`, params);
};

// test learning
export const getListTestLearning = (params) => {
	return axios.get("/test-learning", { params: params });
};

export const createTestLearning = (params) => {
	return axios.post("/test-learning", params)
}

export const updateTestLearning = (id, params) => {
	return axios.patch(`/test-learning/${id}`, params);
};

// class
export const getListClass = (params) => {
	return axios.get("/class", { params: params });
};

export const createClass = (params) => {
	return axios.post("/class", params)
}
