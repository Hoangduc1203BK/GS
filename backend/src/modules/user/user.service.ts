import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/databases/entities';
import { DepartmentService } from '../department';
import { CreateUserDto, ListUsertDto, UpdateUserDto } from './dto';
import { DEFAULT_PAGING } from 'src/common/constants/paging';
import { ROLE } from 'src/common/constants/util';
import { paginate } from 'src/common/interfaces/paginate';
import { GeneratorService } from 'src/core/shared/services/generator.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepos: Repository<User>,
    private readonly departmentService: DepartmentService,
    private readonly generatorService: GeneratorService,
  ) {}

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

    const users = await this.userRepos.find({
      where: {
        ...filter,
      },
      order: { id: 'ASC' },
      skip: (page - 1) * size,
      take: size,
    });

    return {
      result: users,
      ...paginate(users.length, Number(page), Number(size)),
    };
  }

  async getUser(id: string) {
    const user = await this.userRepos.findOne({
      where: { id },
      relations: ['department'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async createUser(dto: CreateUserDto) {
    let department;
    if(dto.departmentId) {
        department = await this.departmentService.getDepartment(dto.departmentId)
    }

    const doc = {
        id: this.generatorService.randomUserID(dto.role),
        ...dto,
    }

    const result = await this.userRepos.save(doc);

    return {
        ...result,
        department: department
    }
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    let department;
    if(dto.departmentId) {
        department = await this.departmentService.getDepartment(dto.departmentId)
    }
    const user = await this.getUser(id);
    const doc = {
        ...user,
        ...dto,
    }

    const result = await this.userRepos.save({id: id, ...doc})
    if(department.id) {
        return {
            ...result,
            department: department
        }
    }

    return result;
  }
}
