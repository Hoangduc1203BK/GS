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

//EXAM_RESULT
export enum EXAM_RESULT {
    PENDING = 'pending',
    PASS = 'pass_exam',
    TEST_LEARNING = 'test_learning',
    FAIL = 'fail',
}

export const STANDARD_SCORE = 7;

export enum TEST_LEARNING_STATUS {
    PENDING = 'pending',
    ACTIVE = 'active',
    DONE = 'done',
}

export enum PROPOSAL_TYPE {
    TEACHER_REGISTER_CLASS = 'teacher_register_class',
    STUDENT_REGISTER_CLASS = 'student_register_class',
    TEACHER_TAKE_BRAKE = 'teacher_take_break',
    STUDENT_TERMINATE_CLASS = 'student_terminate_class'
}

export enum PROPOSAL_STATUS {
    PENDING = 'pending',
    REJECTED = 'rejected',
    CANCELED = 'canceled',
    APPROVED = 'approved'
}