import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { ClassService } from "src/modules/class";
import { GeneratorService } from "../shared/services";
import { InjectRepository } from "@nestjs/typeorm";
import { Classes, TimeTable } from "src/databases/entities";
import { Repository } from "typeorm";
import * as moment from 'moment';
@Injectable()
export class AttendanceGuard implements CanActivate {
    constructor(@InjectRepository(TimeTable) private readonly timeRepos: Repository<TimeTable>) { }
    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const { classId } = req.query;
        if (!classId) {
            throw new Error('Lớp không tồn tại với id:' + classId)
        }

        const schedules = await this.timeRepos.find({ where: { classId: classId } });
        if (schedules && schedules.length > 0) {
            const currentDay = new Date().getDay();
            const schedule = schedules.find(el => Number(el.date) == currentDay);
            if (!schedule) {
                throw new Error('Hiện không phải thời gian điểm danh của lớp với id:' + classId);
            }

            let currentTime = new Date().toLocaleTimeString('it-IT');
            let time = moment.duration(currentTime).asHours();
            if (time >= schedule.start && time <= schedule.end) {
                return true
            } else {
                throw new Error('Hiện không phải thời gian điểm danh của lớp với id:' + classId)
            }
        }

        return false
    }
}