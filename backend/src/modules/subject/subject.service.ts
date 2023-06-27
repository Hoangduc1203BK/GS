import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department, Subject } from 'src/databases/entities';
import { DataSource, Repository } from 'typeorm';
import { DEFAULT_PAGING } from 'src/common/constants/paging';
import { paginate } from 'src/common/interfaces/paginate';
import { CreateSubjectDto, ListSubjectDto, UpdateSubjectDto } from './dto';
import { DepartmentService } from '../department/department.service';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepos: Repository<Subject>,
    private readonly departmentService: DepartmentService,
  ) {}

  async listSubject(dto: ListSubjectDto) {
    const {
      page = DEFAULT_PAGING.PAGE,
      size = DEFAULT_PAGING.LIMIT,
      grade,
      departmentId,
    } = dto;
    let filter = {} as any;

    if (grade) {
      filter.grade = grade;
    }
    if (departmentId) {
      await this.departmentService.getDepartment(departmentId);
      filter.grade = grade;
    }

    const subjects = await this.subjectRepos.find({
      where: {
        ...filter,
        order: { id: 'ASC' },
        skip: (page - 1) * size,
        take: size,
      },
    });

    return {
      result: subjects,
      ...paginate(subjects.length, Number(page), Number(size)),
    };
  }

  async getSubject(id: string) {
    const result = await this.subjectRepos.findOne({ where: { id } });

    if (!result) {
      throw new Error('Subject not found');
    }

    return result;
  }

  async createSubject(dto: CreateSubjectDto) {
    await this.departmentService.getDepartment(dto.departmentId);
    const result = await this.subjectRepos.save(dto);

    return result;
  }

  async updateSubject(id: string, dto: UpdateSubjectDto) {
    const subject = await this.getSubject(id);

    //check department exist if dto have departmentId
    if (dto.departmentId) {
      await this.departmentService.getDepartment(dto.departmentId);
    }

    const doc = {
      ...subject,
      ...dto,
    };

    const result = await this.subjectRepos.save({ id: id, ...doc });

    return result;
  }
}
