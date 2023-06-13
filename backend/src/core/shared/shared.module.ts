import { Global, Module } from "@nestjs/common";
import { ApiConfigService } from "./services/api-config.service";
import { GeneratorService } from "./services/generator.service";

const providers = [GeneratorService, ApiConfigService];

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: providers,
    exports: [...providers]
})
export class SharedModule{};