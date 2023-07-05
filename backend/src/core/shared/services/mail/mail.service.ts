import { Injectable } from "@nestjs/common";
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService
    ) {}

    async sendMail(to: string, subject: string, templateDir: string, data: any) {
        await this.mailerService.sendMail({
            to: to,
            subject: subject,
            template: templateDir,
            context: data
        })
    }
} 