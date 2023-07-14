import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Feedback } from "src/databases/entities";
import { Repository } from "typeorm";
import { ListFeedbackDto } from "./dto/list-feedback.dto";
import { DEFAULT_PAGING } from "src/common/constants/paging";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { ClassService } from "../class";
import { UserService } from "../user";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";

@Injectable()
export class FeedbackService {
    constructor(
        @InjectRepository(Feedback) private readonly feedbackRepos: Repository<Feedback>,
        private readonly userService: UserService,
        private readonly classService: ClassService,
    ) { }

    async listFeedback(dto: ListFeedbackDto) {
        const { page = DEFAULT_PAGING.PAGE, size = DEFAULT_PAGING.LIMIT, ...rest } = dto;
        let filter = {} as any;
        for (const [k, v] of Object.entries(rest)) {
            if (k == 'classId') {
                filter["class_id"] = v;
            } else {
                filter[k] = v;
            }
        }

        let feedbacks = await this.feedbackRepos.find({
            where: filter,
            relations: ['fromUser', 'toUser', 'classes'],
            order: { id: 'ASC' },
            skip: (page - 1) * size,
            take: size,
        })

        let result = [];
        for (const f of feedbacks) {
            const { fromUser, toUser, classes, ...rest } = f;
            const item = {
                ...rest,
                fromUser: fromUser.name,
                fromId: fromUser.id,
                toUser: toUser.name,
                toId: toUser.id,
                className: classes.name
            }

            result.push(item);
        }

        return result;
    }

    async getFeedback(id: number) {
        const feedback = await this.feedbackRepos.findOne({
            where: { id },
            relations: ['fromUser', 'toUser', 'classes'],
        })

        if (!feedback) {
            throw new Error('Khong tim thay feedback co id:' + id)
        }

        const { fromUser, toUser, classes, ...rest } = feedback;
        const result = {
            ...rest,
            fromUser: fromUser.name,
            fromId: fromUser.id,
            toUser: toUser.name,
            toId: toUser.id,
            className: classes.name
        }

        return result;
    }

    async createFeedback(dto: CreateFeedbackDto) {
        await this.userService.getUser(dto.from);
        await this.userService.getUser(dto.to);
        await this.classService.getClass(dto.classId);

        const result = await this.feedbackRepos.save(dto);

        return this.getFeedback(result.id);
    }

    async updateFeedback(id: number, dto: UpdateFeedbackDto) {
        const feedback = await this.feedbackRepos.findOne({
            where: {id}
        })

        if(!feedback) {
            throw new Error('Khong tim thay feedback co id:' + id)
        }

        const doc = {
            ...feedback,
            ...dto,
        }

        await this.feedbackRepos.save({id: id, ...doc});

        return this.getFeedback(id);
    }
}