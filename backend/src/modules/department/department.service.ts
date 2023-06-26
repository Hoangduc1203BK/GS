import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Department } from "src/databases/entities";
import { DataSource, Repository } from 'typeorm';
import { CreateDepartmentDto, ListDepartmentDto, UpdateDepartmentDto } from "./dto";
import { DEFAULT_PAGING } from "src/common/constants/paging";
import { paginate } from "src/common/interfaces/paginate";

@Injectable()
export class DepartmentService {
    constructor(
        @InjectRepository(Department) private readonly departmentRepos: Repository<Department>, 
    ) {}

    async listDepartment(dto: ListDepartmentDto) {
        const { page = DEFAULT_PAGING.PAGE, size = DEFAULT_PAGING.LIMIT} = dto;
        const departments = await this.departmentRepos.find({order: {id: 'ASC'}, skip: (page-1) * size, take: size})

        return {result: departments, ...paginate(departments.length, Number(page), Number(size))}
    }
    

    async getDepartment(id: number) {
        const department = await this.departmentRepos.findOne({where: { id }});

        if(!department) {
            throw new Error('Department not found')
        }

        return department
    }

    async createDepartment(dto: CreateDepartmentDto) {
        const { leader } = dto;

        if(leader) {

        }

        const department = await this.departmentRepos.save(dto);

        return department;
    }

    async updateDepartment(id: number, dto: UpdateDepartmentDto) {
        const { leader } = dto;

        if(leader) {

        }

        const department = await this.getDepartment(id);
        const doc = {
            ...department,
            ...dto,
        }

        const result = await this.departmentRepos.save({id: id,...doc})

        return result;
    }
}