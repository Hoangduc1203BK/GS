import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Like, Repository } from 'typeorm';
import { Attendance, HistoryPrice, SubAttendance, User } from 'src/databases/entities';
import { DepartmentService } from '../department';
import { CreateUserDto, ListUsertDto, UpdateUserDto } from './dto';
import { DEFAULT_PAGING } from 'src/common/constants/paging';
import { ROLE, USER_CLASS_TYPE } from 'src/common/constants/util';
import { paginate } from 'src/common/interfaces/paginate';
import { GeneratorService } from 'src/core/shared/services/generator.service';
import { BcryptService } from './bcrypt.service';
import { AuthService } from '../auth/auth.service';
import { ClassService } from '../class';
import { ListFeetDto } from './dto/list-fee.dto';
import { GetFeeDetailDto } from './dto/get-fee-detail.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepos: Repository<User>,
    private readonly generatorService: GeneratorService,
    @InjectRepository(Attendance) private readonly attendanceRepos: Repository<Attendance>,
    @InjectRepository(SubAttendance) private readonly subAttendanceRepos: Repository<SubAttendance>,
    @InjectRepository(HistoryPrice) private readonly historyRepos: Repository<HistoryPrice>,
    private readonly bcryptService: BcryptService,
    @Inject(forwardRef(() => DepartmentService))
    private readonly departmentService: DepartmentService,
    @Inject(forwardRef(() => ClassService))
    private readonly classService: ClassService
  ) { }

  async listUser(dto: ListUsertDto) {
    const {
      page = DEFAULT_PAGING.PAGE,
      size = DEFAULT_PAGING.LIMIT,
      role = ROLE.USER,
    } = dto;
    let filter = {
      role: role,
    } as any;

    if (dto.grade) {
      filter.grade = dto.grade;
    }
    if (dto.departmentId) {
      filter.departmentId = dto.departmentId;
    }

    if (dto.name) {
      filter.prefix = Like(`%${dto.name.toLocaleLowerCase()}%`)
    }

    const users = await this.userRepos.find({
      where: {
        ...filter,
      },
      order: { ctime: 'ASC' },
      skip: (page - 1) * (size),
      take: size,
    });

    const all = await this.userRepos.find({
      where: {
        ...filter,
      },
      order: { ctime: 'ASC' },
    });

    return {
      result: users,
      ...paginate(users.length, Number(page), Number(size), all.length),
    };
  }

  async getUser(id: string) {
    const user = await this.userRepos.findOne({
      where: { id },
      relations: ['department'],
    });

    if (!user) {
      throw new Error('Không tìm thấy người dùng với id:' + id);
    }

    return user;
  }

  async createUser(dto: CreateUserDto) {
    let department;
    const user = await this.userRepos.findOne({ where: { email: dto.email } });
    if (user) {
      throw new Error('Email đã tồn tại');
    }
    if (dto.departmentId) {
      department = await this.departmentService.getDepartment(dto.departmentId);
    }

    const hashPassword = await this.bcryptService.hash('12345');
    const doc = {
      id: this.generatorService.randomUserID(dto.role),
      password: hashPassword,
      prefix: dto.name.toLocaleLowerCase(),
      ...dto,
    };

    const result = await this.userRepos.save(doc);

    return {
      ...result,
      department: department,
    };
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    let department;
    if (dto.departmentId) {
      department = await this.departmentService.getDepartment(dto.departmentId);
    }
    const user = await this.userRepos.find({
      where: { id }
    });
    const doc = {
      ...user,
      ...dto,
    };

    if (dto.password) {
      const hashPassword = await this.bcryptService.hash(dto.password);
      doc.password = hashPassword
    }

    await this.userRepos.save({ id: id, ...doc });

    return this.getUser(id);
  }

  async listTimeKeeping(userId: string, query: ListFeetDto) {
    const user = await this.userRepos.findOne({
      where: { id: userId }
    })
    const current = new Date();
    let month = current.getMonth() + 1;
    const currentMonth = month <= 9 ? `0${month}` : month.toString();
    const startOfMonth = `${current.getFullYear()}-${currentMonth}-01`;
    const last = new Date(current.getFullYear(), current.getMonth() + 1, 0)
    const endOfMonth = `${current.getFullYear()}-${currentMonth}-${last.getDate()}`;

    const { start = startOfMonth, end = endOfMonth } = query;
    const qr = `select a.*, c.name as class_name,c.teacher_rate, c.fee as fee, s.name as subject, s.grade as grade from attendance a, "class" c, subjects s where a.class_id  = c.id and c.subject_id = s.id and a."day" >= '` + start + `' and a."day" <= '` + end + `' and a.teacher_of_day = '` + userId + `'`
    const attendances = await this.attendanceRepos.query(qr);
    let classes = attendances.map(el => {
      return {
        classId: el.class_id,
        className: el.class_name,
        fee: el.fee,
        teacher_rate: el.teacher_rate,
        subject: el.subject,
        grade: el.grade
      }
    })
    let set = new Set(classes.map(JSON.stringify))
    classes = Array.from(set).map((el) => {
      return JSON.parse(el as string)
    })

    const result = [] as any;
    for (const c of classes) {
      const histories = await this.historyRepos.find({
        where: {
          classId: c.classId,
          ctime: LessThan(current)
        }
      })

      const price = histories.length > 0 ? histories[histories.length - 1].newPrice : c.fee;

      const attendances = await this.classService.listAttendance({ classId: c.classId, start, end });
      const totalOfStudy = attendances.length;
      let numberOfStudy = attendances.filter(el => el.teacher_id == userId).length;

      const item = {
        ...c,
        fee: c.teacher_rate != null ? Number(c.teacher_rate) * Number(price)/100 : Number(c.fee) * 0.6,
        numberOfStudy: `${numberOfStudy}/${totalOfStudy}`,
        total: c.teacher_rate != null ? Number(price) * numberOfStudy * Number(c.teacher_rate) / 100 : Number(price) * numberOfStudy * 0.6
      }

      result.push(item)
    }

    return {
      ...user,
      classes: result
    };
  }

  async timekeepingDetail(userId: string, query: GetFeeDetailDto) {
    const { classId, start, end } = query;
    const classes = await this.classService.getClass(classId);
    const histories = await this.historyRepos.find({
      where: {
        classId: classes.id,
        ctime: LessThan(new Date())
      }
    })

    const price = histories.length > 0 ? histories[histories.length - 1].newPrice : classes.fee;
    const attendances = await this.attendanceRepos.find({
      where: { classId: classId }
    })

    const attends = attendances.filter(el => el.teacherId == userId).length;
    const numberOfStudy = `${attends}/${attendances.length}`;
    const attendanceResult = [];
    for (const a of attendances) {
      const item = {
        day: a.day,
        date: a.date,
        status: a.teacherId == userId ? true : false,
      }

      attendanceResult.push(item);
    }

    return {
      id: classes.id,
      name: classes.name,
      numberOfStudent: classes.numberStudent,
      subject: classes.subject.name,
      grade: classes.subject.grade,
      teacher: classes.user.name,
      numberOfStudy: numberOfStudy,
      total: classes.teacherRate != null ? (price * attends * classes.teacherRate) / 100 : price * attends * 0.3,
      attendances: attendanceResult,
    }
  }

  async listFee(userId: string, query: ListFeetDto) {
    const user = await this.userRepos.findOne({
      where: { id: userId }
    })

    let price = 0;
    const current = new Date();
    let month = current.getMonth() + 1;
    const currentMonth = month <= 9 ? `0${month}` : month.toString();
    const startOfMonth = `${current.getFullYear()}-${currentMonth}-01`;
    const last = new Date(current.getFullYear(), current.getMonth() + 1, 0)
    const endOfMonth = `${current.getFullYear()}-${currentMonth}-${last.getDate()}`;

    const { start = startOfMonth, end = endOfMonth } = query;
    const classOfUser = await this.classService.listClassOfUser(userId, USER_CLASS_TYPE.MAIN);
    const classArr = [];
    for (const c of classOfUser) {
      const histories = await this.historyRepos.find({
        where: {
          classId: c.classId,
          ctime: LessThan(current)
        }
      })

      // get modify price
      price = histories.length > 0 ? histories[histories.length - 1].newPrice : c.classes.fee
      const { classId, classes, ...rest } = c;
      const item = {
        classId: classId,
        className: classes.name,
        fee: price,
        subject: classes.subject.name,
        grade: classes.subject.grade
      }
      classArr.push(item);
    }

    const classResult = [];

    for (const c of classArr) {
      const attendance = await this.classService.listAttendance({ classId: c.classId, start: start, end: end })
      const totalOfStudy = attendance.length;
      let numberOfStudy = 0;
      for (const a of attendance) {
        const subAttendance = await this.subAttendanceRepos.findOne({
          where: {
            studentId: userId,
            attendanceId: a?.id,
            status: true,
          }
        })

        if (subAttendance) {
          numberOfStudy += 1
        }
      }
      classResult.push({
        ...c,
        numberOfStudy: `${numberOfStudy}/${totalOfStudy}`,
        total: price * numberOfStudy
      })
    }

    return {
      ...user,
      classes: classResult
    };
  }

  async getFeeDetail(userId: string, query: GetFeeDetailDto) {
    const classes = await this.classService.getClass(query.classId)
    const { classId, start, end } = query;
    const qr = `
    select c.name as class_name, a.*, sa.status from attendance a , "sub-attendance" sa, "class" c
    where a.id = sa.attendance_id and a.class_id = c.id
    and a."day" >= '` + start + `' and a."day" <= '` + end + `' and sa.user_id ='` + userId + `' and a.class_id = '` + classId + `'`;
    const attendances = await this.attendanceRepos.query(qr);
    const attends = attendances.filter(el => el.status == true).length;
    const numberOfStudy = `${attends}/${attendances.length}`;
    const mapAttendances = attendances.map(el => {
      return {
        day: el.day,
        date: el.date,
        status: el.status,
      }
    })

    const result = {
      id: classes.id,
      name: classes.name,
      numberStudent: classes.numberStudent,
      subject: classes.subject.name,
      grade: classes.subject.grade,
      teacher: classes.user.name,
      numberOfStudy: numberOfStudy,
      total: classes.fee * attends,
      attendances: mapAttendances
    }

    return result;
  }
}
