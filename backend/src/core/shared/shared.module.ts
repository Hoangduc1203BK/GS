import { Global, Module } from "@nestjs/common";
import { ApiConfigService } from "./services/api-config.service";
import { GeneratorService } from "./services/generator.service";
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from "path";
import { MailService } from "./services/mail/mail.service";
const providers = [GeneratorService, ApiConfigService, MailService];
@Global()
@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (config: ApiConfigService) => ({
                transport: {
                    host: config.getMailConfig().host,
                    secure: false,
                    auth: {
                        user: config.getMailConfig().user,
                        pass: config.getMailConfig().pass,
                    }
                },
                defaults: {
                    from: `"Host" <${config.getMailConfig().from}>`
                },
                template: {
                    dir: 'src/core/shared/services/mail/template',
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    }
                }
            }),
            inject: [ApiConfigService]
        })
    ],
    controllers: [],
    providers: providers,
    exports: [...providers]
})
export class SharedModule{};