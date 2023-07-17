import { Body, Controller, Param, Query, Get, Post, Patch, UseGuards, Req } from "@nestjs/common";
import { ProposalService } from "./proposal.service";
import { Request, query } from "express";
import { ListProposalDto } from "./dto/list-proposal.dto";
import { CreateProposalDto } from "./dto/create-proposal.dto";
import { JwtAuthGuard } from "src/core/guards";

@Controller('proposal')
export class ProposalController {
    constructor(private readonly proposalService: ProposalService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/')
    async listProposal(@Req() req: Request, @Query() query: ListProposalDto) {
        const user = req["user"];
        const result = await this.proposalService.listProposal(user["role"], query);

        return result;
    }

    @Get('/:id')
    async getProposal(@Param('id') id:number) {
        const result = await this.proposalService.getProposal(id);

        return result;
    }

    @Post('/')
    async createProposal(@Body() dto: CreateProposalDto) {
        const result = await this.proposalService.createProposal(dto);

        return result;
    }

    @Patch('/:id')
    async updateProposal(@Param('id') id: number, @Body() dto: any) {
        await this.proposalService.updateProposal(id, dto);

        return true;
    }
}