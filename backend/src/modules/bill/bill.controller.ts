import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CreateBillDto } from "./dto/create-bill.dto";
import { BillService } from "./bill.service";
import { ListBillDto } from "./dto/list-bill.dto";

@Controller('bill')
export class BillController {
    constructor(
        private readonly billService: BillService,
    ) {}

    @Post('/')
    async createPost(@Body() dto: CreateBillDto) {
        const result = await this.billService.createBill(dto);

        return result;
    }


    @Get('/:id')
    async getBill(@Param('id') id: string) {
        const result = await this.billService.getBill(id);

        return result;
    }


    @Get('/')
    async listBill(@Query() dto: ListBillDto) {
        const result = await this.billService.listBill(dto);

        return result;
    }
}