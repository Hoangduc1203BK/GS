import { AuthModule } from "./auth/auth.module";
import { ClassModule } from "./class";
import { DepartmentModule } from "./department";
import { SubjectModule } from "./subject";
import { UserModule } from "./user";

export const MODULES = [
    UserModule,
    DepartmentModule,
    SubjectModule,
    AuthModule,
    ClassModule,
]