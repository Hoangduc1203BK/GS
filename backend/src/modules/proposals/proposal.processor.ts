import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { PROPOSAL_TYPE, QUEUE_JOB } from 'src/common/constants';
import { MailService } from 'src/core/shared/services/mail/mail.service';
import { ProposalStrategy } from 'src/common/interfaces/proposals';
import { TeacherRegisterClass } from './teacher-register-class.service';
import { TeacherTakeBrake } from './teacher-take-break.service';
import { StudentRegisterClass } from './student-register-class.service';
import { StudentTerminateClass } from './student-terminate-class.service';
import { ClassService } from '../class/class.service';
import { UserService } from '../user';
import { InjectRepository } from '@nestjs/typeorm';
import { Proposals } from 'src/databases/entities';
import { Repository } from 'typeorm';
import { AssigmentService } from '../assigment';

@Processor(QUEUE_JOB.SEND_MAIL)
export class ProposalConsumer {
    private proposalStrategy: ProposalStrategy
	constructor(
        @InjectRepository(Proposals) private readonly proposalRepos: Repository<Proposals>,
        private readonly userService: UserService,
        private readonly classService: ClassService,
        private readonly mailService: MailService,
        private readonly assigmentService: AssigmentService,
        ) {}

	@Process()
	async sendMail(job: Job) {
		const { dto, proposal } = job.data;

        switch (proposal.type) {
            case PROPOSAL_TYPE.TEACHER_REGISTER_CLASS:
                this.proposalStrategy = new TeacherRegisterClass(this.proposalRepos, this.userService, this.mailService, this.classService);
                break;
            case PROPOSAL_TYPE.TEACHER_TAKE_BRAKE:
                this.proposalStrategy = new TeacherTakeBrake(this.proposalRepos, this.userService, this.mailService, this.classService);
                break;
            case PROPOSAL_TYPE.STUDENT_REGISTER_CLASS:
                this.proposalStrategy = new StudentRegisterClass(this.proposalRepos, this.classService, this.mailService, this.userService, this.assigmentService);
                break;
            case PROPOSAL_TYPE.STUDENT_TERMINATE_CLASS:
                this.proposalStrategy = new StudentTerminateClass(this.proposalRepos, this.classService, this.mailService, this.userService);
            default:
                break;
        }

        if (proposal.type == PROPOSAL_TYPE.TEACHER_TAKE_BRAKE) {
            await this.proposalStrategy.handleProposal(dto, proposal, dto.subData);
        } else {
            await this.proposalStrategy.handleProposal(dto, proposal);
        }
	}
}
