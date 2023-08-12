import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attendance, Bill, Classes, HistoryPrice, SubAttendance, SubBill, UserClass } from "src/databases/entities";
import { BillService } from "./bill.service";
import { UserModule } from "../user";
import { ClassModule } from "../class";
import { BillController } from "./bill.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([SubBill, Bill, Classes, Attendance, SubAttendance, UserClass, HistoryPrice]),
        forwardRef(() => UserModule),
        forwardRef(() => ClassModule),
    ],
    controllers: [BillController],
    providers: [BillService],
    exports:[BillService]
})
export class BillModule{};