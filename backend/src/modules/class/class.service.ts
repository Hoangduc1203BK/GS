import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Classes, Room, Subject, TimeTable, UserClass } from 'src/databases/entities';
import { DataSource, Repository } from 'typeorm';
import { CreateClassDto, CreateUserClassDto, ListClassDto, UpdateClassDto } from './dto';
import { DEFAULT_PAGING } from 'src/common/constants/paging';
import { CLASS_TYPE } from 'src/common/constants';
import { UserService } from '../user';
import { paginate } from 'src/common/interfaces/paginate';
import * as moment from 'moment';
import { Schedule } from 'src/common/interfaces/time-table';
import { GeneratorService } from 'src/core/shared/services';
import { DepartmentService } from '../department';
import { ListUserClassDto } from './dto/list-user-class.dto';
@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Classes) private readonly classRepos: Repository<Classes>,
    @InjectRepository(Room) private readonly roomRepos: Repository<Room>,
    @InjectRepository(TimeTable)
    private readonly timeRepos: Repository<TimeTable>,
    @InjectRepository(Subject) private readonly subjectRepos: Repository<Subject>,
    @InjectRepository(UserClass) private readonly userClassRepos: Repository<UserClass>,
    private readonly datasource: DataSource,
    private readonly generatorService: GeneratorService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) { }

  async createRoom(data: any) {
    const result = await this.roomRepos.save(data);

    return result;
  }

  async getRoom(id: number) {
    const result = await this.roomRepos.findOne({ where: { id } });

    if (!result) {
      throw new Error('Room not found');
    }

    return result;
  }

  async deleteSchedule(id: number) {
    await this.timeRepos.delete(id);

    return true;
  }

  async listRoom() {
    const result = await this.roomRepos.find();

    return result;
  }

  async listClass(query: ListClassDto) {
    const {
      // page = DEFAULT_PAGING.PAGE,
      // size = DEFAULT_PAGING.LIMIT,
      type = CLASS_TYPE.ACTIVE,
      subjectId,
      teacher,
      roomId,
      date,
      start,
      end,
    } = query;
    let classFilter = {
      type: "'" + CLASS_TYPE.ACTIVE + "'"
    } as any;

    let scheduleFilter = {
      date: "'2','3','4','5','6'",
      start: 7.5,
      end: 21.5
    } as any;

    if (subjectId) {
      await this.subjectRepos.findOne({ where: { id: subjectId } });
      classFilter["subject_id"] = "'" + subjectId + "'";
    }

    if (teacher) {
      await this.userService.getUser(teacher);
      classFilter.teacher = "'" + teacher + "'";
    }

    if (type) {
      classFilter.type = "'" + type + "'";
    }

    if (roomId) {
      scheduleFilter["room_id"] = roomId;
    }
    if (date) {
      scheduleFilter.date = date.split(",").map(el => "'" + el + "'").join(',')

    }

    if (start) {
      scheduleFilter.start = start;
    }

    if (end) {
      scheduleFilter.end = end;
    }

    let qr = ` select c.*, t."start" ,t."end" ,t."date" ,r."name" as room_name from "class" c, "time-tables" t, "rooms" r where c.id = t.class_id and t.room_id = r.id `
    let classArr = [];

    if (Object.keys(classFilter).length > 0) {
      for (const [k, v] of Object.entries(classFilter)) {
        classArr.push(" c." + `"${k}" = ` + `${v} `)
      }
    }
    if (Object.keys(scheduleFilter).length > 0) {
      for (const [k, v] of Object.entries(scheduleFilter)) {
        if (k == 'room_id') {
          classArr.push(` t."room_id" = ` + `${v} `)
        }
        if (k == "start") {
          classArr.push(` t."start" >= ` + `${v} `)
        }
        if (k == "end") {
          classArr.push(` t."end" <= ` + `${v} `)
        }
        if (k == "date") {
          classArr.push(` t."date" in ( ${v} ) `)
        }
      }
    }

    if (classArr.length > 0) {
      qr = qr + " and " + classArr.join(" and ")
    }


    let classes = await this.classRepos.query(qr);
    if (classes.length >= 1) {
      const { start, end, date, room_name, ...rest } = classes[0];
      const result = [{
        ...rest,
        time_tables: [{
          start, end, date, room_name
        }]
      }];

      classes.shift();

      classes.reduce((init, curr) => {
        const { start, end, date, room_name, ...rest } = curr;
        const item = result.find(el => el.id == curr.id);
        if (!item) {
          result.push({
            ...rest,
            time_tables: [{
              start, end, date, room_name
            }]
          })
        } else {
          item.time_tables.push({
            start, end, date, room_name
          })
        }
      }, classes)

      return result;
    } else {
      return [];
    }
  }

  async getClass(id: string) {
    const result = await this.classRepos.findOne({
      where: { id },
      relations: ['timeTables', 'timeTables.room', 'user'],
    });

    if (!result) {
      throw new Error('Class not found');
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

    const classes = await this.classRepos.findOne({ where: { id } })

    const { schedules, ...rest } = dto;

    const doc = {
      ...classes,
      ...rest
    }

    const updateDoc = await this.classRepos.save(doc);

    if (updateDoc && updateDoc.id) {
      await this.datasource.manager.transaction(async (manager) => {
        const schedules1 = await this.timeRepos.find({ where: { classId: id } });
        await Promise.all(schedules1.map(async (s) => {
          await this.deleteSchedule(s.id)
        }))

        if (schedules && Object.keys(schedules).length > 0) {
          for (const s of schedules) {
            const check = await this.checkSchedule(s.start.toString(), s.end.toString(), s.date, s.roomId);

            if (!check) {
              throw new Error(`Phòng này đã có lớp đăng kí sẵn`);
            }
          }
        }

        if (schedules && Object.keys(schedules).length > 0) {
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
        }
      })
    }

    return this.getClass(id);
  }

  async checkSchedule(start: string, end: string, date: string, roomId: number) {
    const schedules = await this.timeRepos.find({ where: { date: date, roomId: roomId } });
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

  async listTeacherEmpty(schedules: Schedule[]) {
    if (schedules && schedules.length > 0) {
      const listClassNotEmpty = [];
      const listTeacherNOtEmpty = [];
      for (const s of schedules) {
        const { start, end, date, roomId } = s;
        const timeTables = await this.timeRepos.find({ where: { date: date, roomId: roomId } });
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
              listClassNotEmpty.push(s1.classId)
            }
          }
        }
      }

      for (const id of listClassNotEmpty) {
        const result = await this.getClass(id);
        listTeacherNOtEmpty.push(result.teacher);
      }

      let listTeacher = await this.userService.listUser({
        role: 'teacher'
      })

      let listTeacherID = listTeacher.result.map(el => {
        return { id: el.id, name: el.name }
      })

      const result = listTeacherID.filter(el => !listTeacherNOtEmpty.some(el2 => el2 === el.id));

      return result;
    } else {
      return []
    }
  }

  async createClass(dto: CreateClassDto) {
    const { schedules, ...rest } = dto;
    let user;
    //check teacher exist
    if (dto.teacher) {
      user = await this.userService.getUser(dto.teacher);
    }

    //check subject exist
    const subject = await this.subjectRepos.findOne({ where: { id: dto.subjectId } });

    //check room exist
    const id = this.generatorService.randomString(6);

    const doc = {
      id: id,
      ...rest,
      type: CLASS_TYPE.ACTIVE,
    }
    const result = await this.classRepos.save(doc)

    if (result && result.id) {
      await this.datasource.manager.transaction(async manager => {
        for (const s of schedules) {
          const check = await this.checkSchedule(s.start, s.end, s.date, s.roomId)
          if (!check) {
            await this.classRepos.delete({ id });
            throw new Error(`Another class already in this time`);
          }
        }

        for (const s of schedules) {
          const data = {
            classId: id,
            date: s.date,
            start: moment.duration(s.start).asHours(),
            end: moment.duration(s.end).asHours(),
            roomId: s.roomId
          }

          await manager.save(TimeTable, data);
        }
      })
    }

    let classes = {
      ...doc,
      schedules: schedules,
      subject: subject,
    } as any;
    if (user && user.id) {
      classes = {
        ...classes,
        teacherName: user.name
      }
    }

    return classes;
  }

  //user-class
  async getUserClass(id: number) {
    const result = await this.userClassRepos.findOne({
      where: {
        id
      },
      relations: ['user', 'classes']
    })

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
    const result = await this.userClassRepos.find({
      where: {
        classId: classId,
        type: type,
        dtime: null,
      },
      relations: ['user']
    })

    return result.map(el => el["user"]);
  }

  async listClassOfUser(userId: string, type: string) {
    await this.userService.getUser(userId);

    const classes = await this.userClassRepos.find({
      where: {
        userId: userId,
        dtime: null,
      },
      relations: ['classes']
    })

    return classes
  }

  async updateUserClass(id: number, dto: UpdateClassDto) {
    const userClass = await this.userClassRepos.findOne({ where: { id } });

    const doc = {
      ...userClass,
      ...dto
    }

    await this.userClassRepos.save({id: id, ...doc})

    return this.getUserClass(id);
  }
}
