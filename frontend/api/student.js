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

    export function ApiClassOfStudent(userId) {
        return axios.get('/class/user/' + userId);
    }
    export function ApiStudentsInClass(classId) {
        return axios.get('/class/' + classId +'/users');
    }

    export function ApiGetListSubject(params) {
        return axios.get('/subject',{
            params:params
        });
    }

    export function ApiGetListClass(params) {
        return axios.get('/class',{
            params:params
        });
    }

    export function ApiGetListClassEmpty(params) {
        return axios.get('/class/student-empty',{
            params:params
        });
    }

    export function ApiCreateSuggest (data){
        return axios.post('/proposal', data);
    }

    
    export function ApiGetListSuggest (params){
        return axios.get('/proposal', {
            params: {...params}
        });
    }

    export function ApiGetListSchedule (){
        return axios.get('/class/schedules');
    }