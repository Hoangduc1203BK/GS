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
        let classId;
        if(req.query.classId) {
            classId = req.query.classId
        }else if(req.body.classId) {
            classId = req.body.classId
        }
        if (!classId) {
            throw new Error('Lớp không tồn tại với id:' + classId)
        }

        const schedules = await this.timeRepos.find({ where: { classId: classId } });
        if (schedules && schedules.length > 0) {
            const strSchedule = schedules.reduce((init, curr) => {
                const {date, start, end} = curr
                let mess = `${start}h-${end}h thứ ${+date+1}`
                return [...init,mess]
            },[] as any)
            const errorMessage = strSchedule.join(', ')
            const currentDay = new Date().getDay();
            const schedule = schedules.find(el => Number(el.date) == currentDay);
            if (!schedule) {
                throw new Error('Hiện không phải thời gian điểm danh của lớp với id:' + classId + `\n Thời gian điểm danh là ${errorMessage}`);
            }

            let currentTime = new Date().toLocaleTimeString('it-IT');
            let time = moment.duration(currentTime).asHours();
            if (time >= schedule.start && time <= schedule.end) {
                return true
            } else {
                throw new Error('Hiện không phải thời gian điểm danh của lớp với id:' + classId + `\n Thời gian điểm danh là ${errorMessage}`)
            }
        }

        return false
    }
}