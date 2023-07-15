import { Body, Controller, Param, Query, Get, Post, Patch } from "@nestjs/common";
import { ProposalService } from "./proposal.service";
import { query } from "express";
import { ListProposalDto } from "./dto/list-proposal.dto";
import { CreateProposalDto } from "./dto/create-proposal.dto";

@Controller('proposal')
export class ProposalController {
    constructor(private readonly proposalService: ProposalService) {}

    @Get('/')
    async listProposal(@Query() query: ListProposalDto) {
        const result = await this.proposalService.listProposal(query);

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