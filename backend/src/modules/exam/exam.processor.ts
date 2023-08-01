import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { QUEUE_JOB } from "src/common/constants";
import { MailService } from "src/core/shared/services/mail/mail.service";

@Processor(QUEUE_JOB.SEND_MAIL)
export class ExamConsumer {
	constructor(
        private readonly mailService: MailService,
        ) {}

	@Process()
	async sendMail(job: Job) {
		const { mail, name, date, hour, roomId, subjects} = job.data;
		const description = `Lịch thi thử sẽ diễn ra vào ${hour} ngày ${date}, phòng thi ${roomId} \n. Học sinh sẽ làm bài thi các môn ${subjects.join(',')}. Học sinh lưu ý đến đúng giờ thi để kì thi diễn ra tốt đẹp. `

		await this.mailService.sendMail(mail, 'Thông báo lịch thi thử đầu vào', './exam', {
			name: name,
			description:  description
		})
	}
}
