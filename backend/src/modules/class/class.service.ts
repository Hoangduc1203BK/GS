import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Attendance,
  Classes,
  Room,
  SubAttendance,
  Subject,
  TimeTable,
  UserClass,
} from 'src/databases/entities';
import { DataSource, In, IsNull, Repository } from 'typeorm';
import {
  CreateAttendanceDto,
  CreateClassDto,
  CreateUserClassDto,
  ListClassDto,
  ListTeacherEmptyDto,
  UpdateAttendanceDto,
  UpdateClassDto,
} from './dto';
import { DEFAULT_PAGING } from 'src/common/constants/paging';
import { CLASS_TYPE, ROLE, USER_CLASS_TYPE, getDayOfMonth } from 'src/common/constants';
import { UserService } from '../user';
import { paginate } from 'src/common/interfaces/paginate';
import * as moment from 'moment';
import { Schedule } from 'src/common/interfaces/time-table';
import { GeneratorService } from 'src/core/shared/services';
import { DepartmentService } from '../department';
import { ListUserClassDto } from './dto/list-user-class.dto';
import { ListAttendanceDto } from './dto/list-attendance.dto';
@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Classes) private readonly classRepos: Repository<Classes>,
    @InjectRepository(Room) private readonly roomRepos: Repository<Room>,
    @InjectRepository(TimeTable)
    private readonly timeRepos: Repository<TimeTable>,
    @InjectRepository(Subject)
    private readonly subjectRepos: Repository<Subject>,
    @InjectRepository(UserClass)
    private readonly userClassRepos: Repository<UserClass>,
    @InjectRepository(Attendance) private readonly attendanceRepos: Repository<Attendance>,
    @InjectRepository(SubAttendance) private readonly subAttendanceRepos: Repository<SubAttendance>,
    private readonly datasource: DataSource,
    private readonly generatorService: GeneratorService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) { }

  async getTimeTable(id: number) {
    const result = await this.timeRepos.findOne({
      where: { id },
      relations: ['classes', 'room']
    })

    if (!result) {
      throw new Error('Không tìm thấy lớp có lịch học với id là:' + id);
    }

    return result;
  }

  async listTimeTable(classId: string) {
    const result = await this.timeRepos.find({
      where: { classId: classId }
    })

    return result;
  }


  async createRoom(data: any) {
    const result = await this.roomRepos.save(data);

    return result;
  }

  async updateRoom(id: number, data: any) {
    const room = await this.getRoom(id);

    const doc = {
      ...room,
      ...data
    }

    const result = await this.roomRepos.save({ id: id, ...doc })

    return result;
  }

  async getRoom(id: number) {
    const result = await this.roomRepos.findOne({ where: { id } });

    if (!result) {
      throw new Error('Không tìm thấy phòng');
    }

    return result;
  }

  async deleteSchedule(id: number) {
    await this.timeRepos.delete(id);

    return true;
  }

  async listRoom() {
    const result = await this.roomRepos.find({
      order: { id: 'ASC' }
    });

    return result;
  }

  async listClassOfTeacher(userId: string) {
    const listClassOfTeacher = await this.listClass({teacher: userId});
    const listClassOfTeacherOfDay = await this.listClass({teacherOfDay: userId}); 
    const difference = listClassOfTeacherOfDay.filter(el => !listClassOfTeacher.some((el1) => el1.id == el.id));

    return [
      ...listClassOfTeacher,
      ...difference
    ]
  }

  async listClass(query: ListClassDto) {
    const {
      // page = DEFAULT_PAGING.PAGE,
      // size = DEFAULT_PAGING.LIMIT,
      type = CLASS_TYPE.ACTIVE,
      subjectId,
      teacher,
      teacherOfDay,
      roomId,
      date,
      start,
      end,
    } = query;
    let classFilter = {
      type: "'" + CLASS_TYPE.ACTIVE + "'",
    } as any;

    let scheduleFilter = {
      date: "'0','1','2','3','4','5','6'",
      start: 7.5,
      end: 21.5,
    } as any;

    if (subjectId) {
      await this.subjectRepos.findOne({ where: { id: subjectId } });
      classFilter['subject_id'] = "'" + subjectId + "'";
    }

    if (teacher) {
      await this.userService.getUser(teacher);
      classFilter.teacher = "'" + teacher + "'";
    }

    if (teacherOfDay) {
      await this.userService.getUser(teacher);
      classFilter.teacher_of_day = "'" + teacherOfDay + "'";
    }

    if (type) {
      classFilter.type = "'" + type + "'";
    }

    if (roomId) {
      scheduleFilter['room_id'] = roomId;
    }
    if (date) {
      scheduleFilter.date = date
        .split(',')
        .map((el) => "'" + el + "'")
        .join(',');
    }

    if (start) {
      scheduleFilter.start = start;
    }

    if (end) {
      scheduleFilter.end = end;
    }

    let qr = ` select c.*, s.name as subject, s.grade as grade, t.id as time_id, t."start" ,t."end" ,t."date" ,r."name" as room_name from "class" c, "time-tables" t, "rooms" r, "subjects" s where c.id = t.class_id and t.room_id = r.id and c.subject_id=s.id`;
    let classArr = [];

    if (Object.keys(classFilter).length > 0) {
      for (const [k, v] of Object.entries(classFilter)) {
        classArr.push(' c.' + `"${k}" = ` + `${v} `);
      }
    }
    if (Object.keys(scheduleFilter).length > 0) {
      for (const [k, v] of Object.entries(scheduleFilter)) {
        if (k == 'room_id') {
          classArr.push(` t."room_id" = ` + `${v} `);
        }
        if (k == 'start') {
          classArr.push(` t."start" >= ` + `${v} `);
        }
        if (k == 'end') {
          classArr.push(` t."end" <= ` + `${v} `);
        }
        if (k == 'date') {
          classArr.push(` t."date" in ( ${v} ) `);
        }
      }
    }

    if (classArr.length > 0) {
      qr = qr + ' and ' + classArr.join(' and ');
    }

    let classes = await this.classRepos.query(qr);
    if (classes.length >= 1) {
      const { start, end, date, room_name, time_id, ...rest } = classes[0];
      let result = [
        {
          ...rest,
          time_tables: [
            {
              id: time_id,
              start,
              end,
              date,
              room_name,
            },
          ],
        },
      ];

      classes.shift();

      classes.reduce((init, curr) => {
        const { id, start, end, date, room_name, time_id, ...rest } = curr;
        const item = result.find((el) => el.id == curr.id);
        if (!item) {
          result.push({
            id: id,
            ...rest,
            time_tables: [
              {
                id: time_id,
                start,
                end,
                date,
                room_name,
              },
            ],
          });
        } else {
          item.time_tables.push({
            id: time_id,
            start,
            end,
            date,
            room_name,
          });
        }
      }, classes);

      const result1 = [];
      for(const c of result) {
        let students = await this.userClassRepos.count({where: {classId: c.id, dtime: IsNull()}});
        const item = {
          ...c,
          number: `${students}/${c.number_student}`
        }

        result1.push(item)
      }

      return result1;
    } else {
      return [];
    }
  }

  async getClass(id: string) {
    const classes = await this.classRepos.findOne({
      where: { id },
      relations: ['subject', 'user'],
    });

    if (!classes) {
      throw new Error('Không tìm thấy lớp');
    }

    const timeTables = await this.timeRepos.find({ where: { classId: id } });

    const result = {
      ...classes,
      time_tables: timeTables
    }

    return result;
  }

  async updateClass(id: string, dto: UpdateClassDto) {
    if (dto.subjectId) {
      await this.subjectRepos.findOne({ where: { id: dto.subjectId } });
    }

    if (dto.teacher) {
      await this.userService.getUser(dto.teacher);
    }

    const classes = await this.classRepos.findOne({ where: { id } });

    const { schedules, ...rest } = dto;

    const doc = {
      ...classes,
      ...rest,
    };

    const updateDoc = await this.classRepos.save(doc);

    if (schedules && Object.keys(schedules).length > 0) {
      await this.datasource.manager.transaction(async (manager) => {
        if (schedules && Object.keys(schedules).length > 0) {
          for (const s of schedules) {
            const check = await this.checkSchedule(
              s.start.toString(),
              s.end.toString(),
              s.date,
              s.roomId,
            );

            if (!check) {
              throw new Error(`Phòng này đã có lớp đăng kí sẵn`);
            }
          }
        }

        const schedules1 = await this.timeRepos.find({
          where: { classId: id },
        });
        await Promise.all(
          schedules1.map(async (s) => {
            await this.deleteSchedule(s.id);
          }),
        );
        for (const s of schedules) {
          const doc = {
            date: s.date,
            start: moment.duration(s.start).asHours(),
            end: moment.duration(s.end).asHours(),
            roomId: s.roomId,
            classId: id,
          };

          await manager.save(TimeTable, doc);
        }
      });
    }

    return this.getClass(id);
  }

  async checkSchedule(
    start: string,
    end: string,
    date: string,
    roomId: number,
  ) {
    const schedules = await this.timeRepos.find({
      where: { date: date, roomId: roomId },
    });
    if (schedules.length > 0) {
      for (const s of schedules) {
        if (
          (moment.duration(start).asHours() >= s.start &&
            moment.duration(start).asHours() <= s.end) ||
          (moment.duration(end).asHours() >= s.start &&
            moment.duration(end).asHours() <= s.end) ||
          (moment.duration(start).asHours() <= s.start &&
            moment.duration(end).asHours() >= s.end)
        ) {
          return false;
        }
      }
      return true;
    }

    return true;
  }

  //lấy danh sách giáo viên có lịch trống 
  async listTeacherEmpty(dto: ListTeacherEmptyDto) {
    if (dto.schedules && dto.schedules.length > 0) {
      const listClassNotEmpty = [];
      const listTeacherNOtEmpty = [];
      for (const s of dto.schedules) {
        const { start, end, date, roomId } = s;
        const timeTables = await this.timeRepos.find({
          where: { date: date, roomId: roomId },
        });
        for (const s1 of timeTables) {
          if (
            (moment.duration(start).asHours() >= s1.start &&
              moment.duration(start).asHours() <= s1.end) ||
            (moment.duration(end).asHours() >= s1.start &&
              moment.duration(end).asHours() <= s1.end) ||
            (moment.duration(start).asHours() <= s1.start &&
              moment.duration(end).asHours() >= s1.end)
          ) {
            if (!listClassNotEmpty.includes(s1.classId)) {
              listClassNotEmpty.push(s1.classId);
            }
          }
        }
      }

      for (const id of listClassNotEmpty) {
        const result = await this.getClass(id);
        listTeacherNOtEmpty.push(result.teacher);
      }

      let filter = {
        role: ROLE.TEACHER
      } as any;

      if (dto.departmentId) {
        filter.departmentId = dto.departmentId
      }

      let listTeacher = await this.userService.listUser(filter);

      let listTeacherID = listTeacher.result.map((el) => {
        return { id: el.id, name: el.name };
      });

      const result = listTeacherID.filter(
        (el) => !listTeacherNOtEmpty.some((el2) => el2 === el.id),
      );

      return result;
    } else {
      return [];
    }
  }

  //lấy danh sách các lớp trống của học sinh
  async listEmptyClassOfStudent(userId: string, subjectId: string) {
    let listClassOfUser = await this.userClassRepos.find({
      where: { userId: userId }
    })

    listClassOfUser = listClassOfUser.filter(el => el.dtime == null);

    const listClass = await this.listClass({ subjectId: subjectId });

    const result = listClass.filter(el => !listClassOfUser.some(el1 => el1.classId == el.id));
    const result1 = result.map(el => {
      const { id, ...rest} = el;

      return {
        classId: id,
        ...rest,
      }
    })

    return result1;
  }

  //lấy danh sách các lớp trong bộ môn chưa có người dạy
  async listClassEmptyOfTeacher(userId: string) {
    const user = await this.userService.getUser(userId);
    const departmentId = user.department.id;
    const subjects = await this.subjectRepos.find({
      where: { departmentId: departmentId }
    })
    const subjectIds = subjects.map(el => `'` + el.id + `'`);
    const subjectParam = subjectIds.join(', ')
    const qr = 'select c.*,  s."name" as subject, s.grade as  grade from class c, subjects s, "time-tables" t, "rooms" r where c.id = t.class_id and t.room_id = r.id and c.subject_id = s.id and c.subject_id IN(' + subjectParam + ') and c.teacher IS NULL'
    const classes = await this.classRepos.query(qr);
    const result = classes.map(el => {
      const {id, ...rest } = el;

      return {
        classId: id,
        ...rest
      }
    })

    return classes;
  }

  async createClass(dto: CreateClassDto) {
    const { schedules, ...rest } = dto;
    let user;
    //check teacher exist
    if (dto.teacher) {
      user = await this.userService.getUser(dto.teacher);
    }

    //check subject exist
    const subject = await this.subjectRepos.findOne({
      where: { id: dto.subjectId },
    });

    //check room exist
    const id = this.generatorService.randomString(6);

    const doc = {
      id: id,
      ...rest,
      type: CLASS_TYPE.ACTIVE,
      teacherOfDay: rest.teacher,
    };
    const result = await this.classRepos.save(doc);

    if (result && result.id) {
      await this.datasource.manager.transaction(async (manager) => {
        for (const s of schedules) {
          const check = await this.checkSchedule(
            s.start,
            s.end,
            s.date,
            s.roomId,
          );
          if (!check) {
            await this.classRepos.delete({ id });
            throw new Error(`Phòng này đã có lớp đăng ký sẵn`);
          }
        }

        for (const s of schedules) {
          const data = {
            classId: id,
            date: s.date,
            start: moment.duration(s.start).asHours(),
            end: moment.duration(s.end).asHours(),
            roomId: s.roomId,
          };

          await manager.save(TimeTable, data);
        }
      });
    }

    let classes = {
      ...doc,
      schedules: schedules,
      subject: subject,
    } as any;
    if (user && user.id) {
      classes = {
        ...classes,
        teacherName: user.name,
      };
    }

    return classes;
  }

  //user-class
  async proposalGetUserClass(userId: string, classId: string) {
    const result = await this.userClassRepos.findOne({
      where: {
        userId: userId,
        classId: classId,
      }
    })

    return result;
  }

  async getUserClass(id: number) {
    const result = await this.userClassRepos.findOne({
      where: {
        id,
      },
      relations: ['user', 'classes'],
    });

    return result;
  }
  async createUserClass(data: CreateUserClassDto) {
    const { userId, classId, type } = data;
    const user = await this.userService.getUser(userId);
    const classes = await this.getClass(classId);
    const result = await this.userClassRepos.save(data);

    return result;
  }

  async listUserInClass(classId: string, type: string) {
    const classes = await this.getClass(classId);
    let result = await this.userClassRepos.find({
      where: {
        classId: classId,
        type: type,
        dtime: null,
      },
      relations: ['user'],
    });

    result = result.filter(el => el.dtime == null)

    return result.map((el) => el['user']);
  }

  async listClassOfUser(userId: string, type: string) {
    await this.userService.getUser(userId);

    const classes = await this.userClassRepos.find({
      where: {
        userId: userId,
        dtime: IsNull(),
      },
      relations: ['classes', 'classes.subject', 'classes.timeTables', 'classes.user', 'classes.timeTables.room'],
    });

    return classes;
  }

  async updateUserClass(id: number, dto: UpdateClassDto) {
    const userClass = await this.userClassRepos.findOne({ where: { id } });

    const doc = {
      ...userClass,
      ...dto,
    };

    await this.userClassRepos.save({ id: id, ...doc });

    return this.getUserClass(id);
  }


  //attendance
  async createAttendance(dto: CreateAttendanceDto) {
    const { classId, teacherId, day, date, attendances } = dto;
    const classes = await this.classRepos.findOne({ where: { id: classId } });
    const teacher = await this.userService.getUser(teacherId);
    const id = this.generatorService.randomString(6);
    const doc = {
      id: id,
      classId: classId,
      day: day,
      date: date,
      teacherId: teacherId
    }
    let result = await this.attendanceRepos.save(doc);
    await this.datasource.manager.transaction(async (manager) => {
      await Promise.all(attendances.map(async (el) => {
        const attendance = {
          studentId: el.id,
          attendanceId: id,
          status: el.status,
        }
        await this.subAttendanceRepos.save(attendance);
      }))
    })

    return {
      ...result,
      attendances: attendances
    }
  }

  async deleteSubAttendance(id: number) {
    await this.subAttendanceRepos.delete(id)

    return true;
  }
  async updateAttendance(query: any, dto: UpdateAttendanceDto) {
    const { date, day, classId } = query;
    const attendance = await this.attendanceRepos.findOne({
      where: {
        classId: classId,
        date: date,
        day: day
      },
    })

    if (!attendance) {
      throw new Error('Bảng điểm danh không tồn tại')
    }

    const { attendances, ...rest } = dto;

    const doc = {
      ...attendance,
      ...rest
    }

    const result = await this.attendanceRepos.save({id: attendance.id, ...doc});

    if (attendances && attendances.length > 0) {
      await this.datasource.manager.transaction(async (manager) => {
        const listSubAttendance = await this.subAttendanceRepos.find({ where: { attendanceId: attendance.id } });
        await Promise.all(listSubAttendance.map(async (at) => {
          await this.deleteSubAttendance(at.id)
        }))

        for (const at of dto.attendances) {
          const update = {
            studentId: at.id,
            attendanceId: attendance.id,
            status: at.status,
          }
          await manager.save(SubAttendance, update);
        }
      })
    }

    return this.getAttendance({classId :result.classId, date: result.date, day: result.day})
  }

  async getAttendance(query: any) {
    const { classId, date, day } = query;
    const result = await this.attendanceRepos.findOne({
      where: {
        classId, date, day
      },
      relations: ['subAttendances', 'subAttendances.student']
    })

    if (!result) {
      throw new Error('Bảng điểm danh không tồn tại')
    }

    const { subAttendances, ...rest } = result;

    const teacher = await this.userService.getUser(result.teacherId)
    const classes = await this.classRepos.findOne({ where: { id: result.classId } });
    const students = result.subAttendances.map(el => {
      return {
        studentId: el.student.id,
        name: el.student.name,
        status: el.status
      }
    })

    return {
      ...rest,
      teacher: teacher.name,
      class: classes.name,
      students: students
    };
  }

  async listAttendance(dto: ListAttendanceDto) {
    let paramsArr = [];
    for (let [k, v] of Object.entries(dto)) {
      if (k == 'start') {
        paramsArr.push(" a.day >= '" + v + "'")
      }
      else if (k == 'end') {
        paramsArr.push(" a.day <= '" + v + "'")
      }
      else if (k == 'classId') {
        paramsArr.push(` a.class_id = '` + v + "'")
      } else if (k == 'teacher') {
        paramsArr.push(` a.teacher_of_day = '` + v + "'")
      }
    }

    let qr = 'select a.id, a.teacher_of_day as teacher_id,  u.name as teacher, a.class_id , c.name as class, a.date, a.day, a.created_at from attendance a, class c, users u where a.class_id = c.id and c.teacher=u.id ';
    if (paramsArr.length > 0) {
      qr = qr + ' AND ' + paramsArr.join(' AND ')
    }

    const listAttendance = await this.attendanceRepos.query(qr);
    const result = [];
    for(const a of listAttendance) {
      const countTrue = await this.subAttendanceRepos.count({where: {
        attendanceId: a.id,
        status: true
      }})

      const all = await this.subAttendanceRepos.count({where: {
        attendanceId: a.id
      }})

      result.push({
        ...a,
        attend: `${countTrue}/${all}`
      })
    }

    return result;
  }

  //thời khoá biểu
  async listScheduleOfStudent(userId: string) {
    const classes = await this.listClassOfUser(userId, USER_CLASS_TYPE.MAIN);
    const listClass = classes.map(el => {
      return {
        ...el.classes,
        teacherName: el.classes.user ? el.classes.user.name : null,
      };
    })

    const listMapClass = [] as any;
    const dates = {
      '0': {
        day: getDayOfMonth('0'),
        classes: []
      },
      '1': {
        day: getDayOfMonth('1'),
        classes: []
      },
      '2': {
        day: getDayOfMonth('2'),
        classes: []
      },
      '3': {
        day: getDayOfMonth('3'),
        classes: []
      },
      '4': {
        day: getDayOfMonth('4'),
        classes: []
      },
      '5': {
        day: getDayOfMonth('5'),
        classes: []
      },
      '6': {
        day: getDayOfMonth('6'),
        classes: []
      }
    } as any;

    for (const c of listClass) {
      const schedules = c.timeTables;
      for (const s of schedules) {
        const item = {
          class: c.name,
          subject: c.subject.name,
          classId: c.id,
          teacher: c.teacherName,
          date: s.date,
          start: s.start,
          end: s.end,
          room: s.room.name,
        }
        listMapClass.push(item);
      }
    }

    for (const classes of listMapClass) {
      switch (classes.date) {
        case '0':
          dates['0'].classes.push(classes);
          break;
        case '1':
          dates['1'].classes.push(classes);
          break;
        case '2':
          dates['2'].classes.push(classes);
          break;
        case '3':
          dates['3'].classes.push(classes);
          break;
        case '4':
          dates['4'].classes.push(classes);
          break;
        case '5':
          dates['5'].classes.push(classes);
          break;
        case '6':
          dates['6'].classes.push(classes);
          break;
      }
    }

    return dates;
  }

  async listSchedulesOfTeacher(teacherId: string) {
    const teacher = await this.userService.getUser(teacherId);
    const listClass = await this.listClass({ teacher: teacherId });
    const listMapClass = [] as any;
    const dates = {
      '0': {
        day: getDayOfMonth('0'),
        classes: []
      },
      '1': {
        day: getDayOfMonth('1'),
        classes: []
      },
      '2': {
        day: getDayOfMonth('2'),
        classes: []
      },
      '3': {
        day: getDayOfMonth('3'),
        classes: []
      },
      '4': {
        day: getDayOfMonth('4'),
        classes: []
      },
      '5': {
        day: getDayOfMonth('5'),
        classes: []
      },
      '6': {
        day: getDayOfMonth('6'),
        classes: []
      }
    } as any;

    for (const c of listClass) {
      const schedules = c.time_tables;
      for (const s of schedules) {
        const item = {
          class: c.name,
          subject: c.subject,
          classId: c.id,
          teacher: teacher.name,
          date: s.date,
          start: s.start,
          end: s.end,
          room: s.room_name
        }
        listMapClass.push(item);
      }
    }

    for (const classes of listMapClass) {
      switch (classes.date) {
        case '0':
          dates['0'].classes.push(classes);
          break;
        case '1':
          dates['1'].classes.push(classes);
          break;
        case '2':
          dates['2'].classes.push(classes);
          break;
        case '3':
          dates['3'].classes.push(classes);
          break;
        case '4':
          dates['4'].classes.push(classes);
          break;
        case '5':
          dates['5'].classes.push(classes);
          break;
        case '6':
          dates['6'].classes.push(classes);
          break;
      }
    }

    return dates;
  }
}
