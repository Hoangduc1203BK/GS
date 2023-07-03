export const MILISECOND = 1e3;
export const ONE_MIN = 60 * MILISECOND;
export const ONE_HOUR = 60 * ONE_MIN;
export const ONE_DAY = 24 * ONE_HOUR;
export const ONE_WEEK = 7 * ONE_DAY;

// INFO: 2 ** 10 = 1024
export const GB = 2 ** 30;
export const MB = 2 ** 20;


//ROLE

export enum ROLE {
    ADMIN = 'admin',
    USER = 'user',
    TEACHER = 'teacher',
}

//CLASS
export enum CLASS_TYPE {
    ACTIVE = 'active',
    DEACTIVE = 'deactive'
}

//USER_CLASS_TYPE
export enum USER_CLASS_TYPE {
    TEST = 'test',
    MAIN = 'main'
}

//ATTENDANCE_STATUS
export enum ATTENDANCE_STATUS {
    ATTEND = 'attend',
    ABSENT = 'absent'
}