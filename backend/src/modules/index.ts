import { AssigmentModule } from "./assigment";
import { AuthModule } from "./auth/auth.module";
import { ClassModule } from "./class";
import { DepartmentModule } from "./department";
import { ExamModule } from "./exam";
import { ProposalModule } from "./proposals";
import { SubjectModule } from "./subject";
import { TestLearningModule } from "./test-learning";
import { UserModule } from "./user";
import { FeedbackModule } from "./feedback";
import { BillModule } from "./bill";

export const MODULES = [
    UserModule,
    DepartmentModule,
    SubjectModule,
    AuthModule,
    ClassModule,
    ExamModule,
    TestLearningModule,
    ProposalModule,
    AssigmentModule,
    FeedbackModule,
    BillModule,
]