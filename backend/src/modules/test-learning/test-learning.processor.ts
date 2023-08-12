import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { QUEUE_JOB } from "src/common/constants";
import { MailService } from "src/core/shared/services/mail/mail.service";

@Processor(QUEUE_JOB.TEST_LEARNING)
export class TestLearningConsumer {
	constructor(
        private readonly mailService: MailService,
        ) {}

	@Process()
	async sendMail(job: Job) {
		const { name, className, date, day, mail, password} = job.data;
		await this.mailService.sendMail(mail, 'Thông báo lịch thi thử đầu vào', './test-learning', {
			name: name,
			className,
            date,
            day,
            mail,
            password
		})
	}
}
