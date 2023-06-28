import { AuthModule } from "./auth/auth.module";
import { DepartmentModule } from "./department";
import { SubjectModule } from "./subject";
import { UserModule } from "./user";

export const MODULES = [
    UserModule,
    DepartmentModule,
    SubjectModule,
    AuthModule,
]