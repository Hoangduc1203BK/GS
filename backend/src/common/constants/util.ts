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
    TEST_LEARNING = 'test',
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


export enum ASSIGMENT_STATUS {
    ACTIVE = 'active',
    DEACTIVE = 'deactive',
}

export enum SUB_ASSIGMENT_STATUS {
    PENDING = 'pending',
    TURN_IN = 'turn_in',
    TURN_IN_LATE = 'turn_in_late',
    PAST_DUE = 'past_due',
    CANCELED = 'canceled'
}

export enum FEEDBACK_TYPE {
    STUDENT = 'student',
    TEACHER = 'teacher',
}
export function getDayOfMonth(day: string) {
    const today = new Date(); // Lấy ngày hiện tại
    const currentDay = today.getDay();
    const currentDate = today.getDate();
    if(+day < +currentDay ) {
      const offset = Number(currentDay) - Number(day);
      const range = currentDate - offset;
      if(range<0) {
        const lastDay = new Date(today.getFullYear(), today.getMonth(),0).getDate();
        return `${lastDay - Math.abs(range)}-${today.getMonth()}`;
      }else if(range == 0) {
        const lastDay = new Date(today.getFullYear(), today.getMonth(),0).getDate();
        return `${lastDay}-${today.getMonth()}`
      }else {
        return `${range}-${today.getMonth()+1}`
      }
    }else if(+day == +currentDay) {
      return `${currentDate}-${today.getMonth()+1}`
    }else {
      const offset = Number(day) - Number(currentDay);
      return `${currentDate+offset}-${today.getMonth()+1}`
    }
  }