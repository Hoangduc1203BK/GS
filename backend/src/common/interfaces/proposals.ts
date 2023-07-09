export interface TEACHER_REGISTER_CLASS {
    classId: string
}

export interface STUDENT_REGISTER_CLASS {
    classId: string
}

export interface TEACHER_TAKE_BRAKE {
    classId: string,
    sub_teacher_id: string,
}

export interface STUDENT_TERMINATE_CLASS {
    classId: string
}

