import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Classes, Room, TimeTable } from 'src/databases/entities';
import { DataSource, Repository } from 'typeorm';
import { CreateClassDto, ListClassDto, UpdateClassDto } from './dto';
import { DEFAULT_PAGING } from 'src/common/constants/paging';
import { CLASS_TYPE } from 'src/common/constants';
import { SubjectService } from '../subject';
import { UserService } from '../user';
import { paginate } from 'src/common/interfaces/paginate';
import * as moment from 'moment';
import { Schedule } from 'src/common/interfaces/time-table';
import { GeneratorService } from 'src/core/shared/services';
@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Classes) private readonly classRepos: Repository<Classes>,
    @InjectRepository(Room) private readonly roomRepos: Repository<Room>,
    @InjectRepository(TimeTable)
    private readonly timeRepos: Repository<TimeTable>,
    private readonly subjectService: SubjectService,
    private readonly userService: UserService,
    private readonly datasource: DataSource,
    private readonly generatorService: GeneratorService,
  ) {}

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

  async listRoom() {
    const result = await this.roomRepos.find();

    return result;
  }

  async listClass(query: ListClassDto) {
    const {
      page = DEFAULT_PAGING.PAGE,
      size = DEFAULT_PAGING.LIMIT,
      type = CLASS_TYPE.ACTIVE,
      subjectId,
      teacher,
      roomId,
      date,
      start,
      end,
    } = query;
    let filter = {
      start: '7.5',
      end: '21.5',
      date: '2',
    } as any;

    if (subjectId) {
      await this.subjectService.getSubject(query.subjectId);
      filter.subjectId = query.subjectId;
    }

    if (teacher) {
      await this.userService.getUser(query.teacher);
      filter.teacher = query.teacher;
    }

    if (roomId) {
      await this.getRoom(query.roomId);
      filter.roomId = query.roomId;
    }
  }

  async getClass(id: string) {
    const result = await this.classRepos.findOne({
      where: { id },
      relations: ['room', 'timetables'],
    });

    if (!result) {
      throw new Error('Class not found');
    }

    return result;
  }

  async updateClass(dto: UpdateClassDto) {
    if (dto.subjectId) {
      await this.subjectService.getSubject(dto.subjectId);
    }

    if (dto.teacher) {
      await this.userService.getUser(dto.teacher);
    }

    if (dto.roomId) {
      await this.getRoom(dto.roomId);
    }
  }

  async checkSchedule(start: string, end: string, date: string) {
    const schedules = await this.timeRepos.find({ where: { date: date } });
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
    const listClassNotEmpty = [];
    const listTeacherNOtEmpty = [];
    for (const s of schedules) {
      const { start, end, date } = s;
      const timeTables = await this.timeRepos.find({ where: { date: date } });
      for (const s1 of timeTables) {
        if (
          (moment.duration(start).asHours() >= s1.start &&
            moment.duration(start).asHours() <= s1.end) ||
          (moment.duration(end).asHours() >= s1.start &&
            moment.duration(end).asHours() <= s1.end) ||
          (moment.duration(start).asHours() <= s1.start &&
            moment.duration(end).asHours() >= s1.end)
        ) {
          if(!listClassNotEmpty.includes(s1.classId)) {
            listClassNotEmpty.push(s1.classId)
          }
        }
      }
    }

    for(const id of listClassNotEmpty) {
        const result = await this.getClass(id);
        listTeacherNOtEmpty.push(result.teacher);
    }

    let listTeacher = await this.userService.listUser({
        role: 'teacher'
    })

    let listTeacherID = listTeacher.result.map(el => {
        return {id: el.id, name: el.name}
    })

    const result = listTeacherID.filter(el => !listTeacherNOtEmpty.some(el2 => el2 === el.id))

    return result;
  }

  async createClass(dto: CreateClassDto) {
    const {schedules, ...rest} = dto;
    //check teacher exist
    const user = await this.userService.getUser(dto.teacher);

    //check subject exist
    const subject = await this.subjectService.getSubject(dto.subjectId);

    //check room exist
    const room = await this.getRoom(dto.roomId);
    const id = this.generatorService.randomString(6);

    const doc = {
        id: id,
        ...rest,
        type: CLASS_TYPE.ACTIVE,
    }
    const result = await this.classRepos.save(doc)

    if(result && result.id){
        await this.datasource.manager.transaction(async manager => {
            for(const s of schedules) {
                const check = await this.checkSchedule(s.start, s.end, s.date)
                if(!check) {
                    await this.classRepos.delete({ id });
                    throw new Error(`Another class already in this time`);
                }
            }

            for(const s of schedules) {
                const data = {
                    classId: id,
                    date: s.date,
                    start: moment.duration(s.start).asHours(),
                    end: moment.duration(s.end).asHours()
                }

                await manager.save(TimeTable,data);
            }
        })
    }

    return {
        ...doc,
        schedules: schedules,
        teacherName: user.name,
        subject: subject,
        room: room
    }
  }
}
