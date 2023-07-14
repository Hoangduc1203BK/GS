import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Feedback } from "src/databases/entities";
import { Repository } from "typeorm";

@Injectable()
export class FeedbackService{
    constructor(
        @InjectRepository(Feedback) private readonly feedbackRepos: Repository<Feedback>,
    ) {}

    async listFeedback() {
        
    }
}