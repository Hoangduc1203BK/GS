import { CanActivate, ExecutionContext, Injectable, mixin } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { ClassService } from "src/modules/class";
import { GeneratorService } from "../shared/services";
import { InjectRepository } from "@nestjs/typeorm";
import { Classes, TimeTable } from "src/databases/entities";
import { Repository } from "typeorm";
import * as moment from 'moment';
import { Console } from "console";
@Injectable()
export class AttendanceGuard implements CanActivate {
    constructor(
        @InjectRepository(TimeTable) private readonly timeRepos: Repository<TimeTable>,
        @InjectRepository(Classes) private readonly classRepos: Repository<Classes>
    ) { }
    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        let classId;
        if (req.query.classId) {
            classId = req.query.classId
        } else if (req.body.classId) {
            classId = req.body.classId
        }
        if (!classId) {
            throw new Error('Lớp không tồn tại với id:' + classId)
        }

        // const classes = await this.classRepos.findOne({
        //     where: { id: classId }
        // })
        // const { teacherId } = req.body

        // if (teacherId != classes.teacherOfDay) {
        //     console.log(1)
        //     const strMess = `Bạn không phải giáo viên của buổi học ngày hôm nay, không thể điểm danh`;
        //     req["errorMessage"] = strMess;

        //     return true;
        // }

        const schedules = await this.timeRepos.find({ where: { classId: classId } });
        if (schedules && schedules.length > 0) {
            const strSchedule = schedules.reduce((init, curr) => {
                let { date, start, end } = curr
                let formatStart = moment.utc(start * 3600 * 1000).format('HH:mm')
                let formatEnd = moment.utc(end * 3600 * 1000).format('HH:mm')
                let mess = `${formatStart}-${formatEnd} ${date == '7' ? 'chủ nhật' : 'thứ ' + (+date + 1)}.`
                return [...init, mess]
            }, [] as any)
            const errorMessage = strSchedule.join(', ')
            const currentDay = new Date().getDay();
            const schedule = schedules.find(el => Number(el.date) == currentDay);
            if (!schedule) {
                const strMess = `Hiện không phải thời gian điểm danh của lớp. Thời gian điểm danh là ${errorMessage}.`;
                req["errorMessage"] = strMess;

                return true;

                // throw new Error('Hiện không phải thời gian điểm danh của lớp với id:' + classId + `\n Thời gian điểm danh là ${errorMessage}`);
            }
            let currentTime = new Date().toLocaleTimeString('it-IT');
            let time = moment.duration(currentTime).asHours();
            if (time >= schedule.start && time <= schedule.end) {
                return true
            } else {
                const strMess = `Hiện không phải thời gian điểm danh của lớp. Thời gian điểm danh là ${errorMessage}`;
                req["errorMessage"] = strMess;

                return true;
                // throw new Error(`Hiện không phải thời gian điểm danh của lớp. Thời gian điểm danh là ${errorMessage}`)
            }
        }

        return false
    }
}