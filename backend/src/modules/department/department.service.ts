import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Department } from "src/databases/entities";
import { DataSource, Repository } from 'typeorm';
import { CreateDepartmentDto, ListDepartmentDto, UpdateDepartmentDto } from "./dto";
import { DEFAULT_PAGING } from "src/common/constants/paging";
import { paginate } from "src/common/interfaces/paginate";
import { GeneratorService } from "src/core/shared/services";
import { UserService } from "../user";

@Injectable()
export class DepartmentService {
    constructor(
        @InjectRepository(Department) private readonly departmentRepos: Repository<Department>, 
        private readonly generatorService: GeneratorService,
        @Inject(forwardRef(() => UserService)) 
        private readonly userService: UserService,
    ) {}

    async listDepartment(dto: ListDepartmentDto) {
        const { page = DEFAULT_PAGING.PAGE, size = DEFAULT_PAGING.LIMIT} = dto;
        const departments = await this.departmentRepos.find({order: {ctime: 'ASC'}, skip: (page-1) * size, take: size})

        return {result: departments, ...paginate(departments.length, Number(page), Number(size))}
    }
    

    async getDepartment(id: string) {
        const department = await this.departmentRepos.findOne({where: { id }});

        if(!department) {
            throw new Error('Department not found')
        }

        return department
    }

    async createDepartment(dto: CreateDepartmentDto) {
        const { leader } = dto;

        if(leader) {
            await this.userService.getUser(leader);
        }
        const department = await this.departmentRepos.save({
            id: this.generatorService.randomNumber(6),
            ...dto
        });

        return department;
    }

    async updateDepartment(id: string, dto: UpdateDepartmentDto) {
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