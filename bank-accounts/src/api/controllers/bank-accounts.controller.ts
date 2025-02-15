import { CreateBankaAccountCommand } from "@application/use-cases/create-bank-account/create-bank-account.command";
import { CreateBankAccountUseCase } from "@application/use-cases/create-bank-account/create-bank-account.usecase";
import { GetBankAccountQuery } from "@application/use-cases/get-bank-account/get-bank-account.query";
import { GetBankAccountUseCase } from "@application/use-cases/get-bank-account/get-bank-account.usecase";
import { UpdateHolderEmailUseCase } from "@application/use-cases/update-holder-email/update-holder-email.usecase";
import { UpdateHolderEmailCommand } from "@application/use-cases/update-holder-email/update-holder-email.command";
import { BankAcocuntDto } from "@domain/dtos/bank-account.dto";
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { UpdateBankAccountStatusCommand } from "@application/use-cases/update-bank-account-status/update-bank-account-status.command";
import { UpdateBankAccountStatusUseCase } from "@application/use-cases/update-bank-account-status/update-bank-account.usecase";
import { GetBankAccountDetailsUseCase } from "@application/use-cases/get-bank-account-details/get-bank-account-details.usecase";
import { GetBankAccountDetailsQuery } from "@application/use-cases/get-bank-account-details/get-bank-account-details.query";

@Controller('/api/bank-accounts')
export class BankAccountsController {
    constructor(
        private readonly createBankAccountUseCase: CreateBankAccountUseCase,
        private readonly getBankAccountUseCase: GetBankAccountUseCase,
        private readonly updateHolderEmailUseCase: UpdateHolderEmailUseCase,
        private readonly updateBankAccountStatusUseCase: UpdateBankAccountStatusUseCase,
        private readonly getBankAccountDetailsUseCase: GetBankAccountDetailsUseCase
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    public async create(
        @Body() command: CreateBankaAccountCommand
    ): Promise<void> {
        await this.createBankAccountUseCase.execute(command);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAll(
        @Query('bankAccountNumber') bankAccountNumber: string, 
        @Query('branch') branch: string,
        @Query('holderDocument') holderDocument: string
    ): Promise<BankAcocuntDto[]> {
        const query: GetBankAccountQuery = { bankAccountNumber, branch, holderDocument }
        const result = await this.getBankAccountUseCase.execute(query);
        return result;
    }

    @Get('/:bankAccountNumber')
    @HttpCode(HttpStatus.OK)
    public async getDetails(
        @Param('bankAccountNumber') bankAccountNumber: string
    ) {
        const query: GetBankAccountDetailsQuery = { bankAccountNumber }
        return await this.getBankAccountDetailsUseCase.execute(query);
    }

    @Patch('/:bankAccountNumber/contacts')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async updateEmail(
        @Param('bankAccountNumber') bankAccountNumber: string, 
        @Body() command: UpdateHolderEmailCommand
    ): Promise<void> {
        command.bankAccountNumber = bankAccountNumber;
        await this.updateHolderEmailUseCase.execute(command);
    }

    @Patch('/:bankAccountNumber/status')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async updateStatus(
        @Param('bankAccountNumber') bankAccountNumber: string, 
        @Body() command: UpdateBankAccountStatusCommand
    ) {
        command.bankAccountNumber = bankAccountNumber;
        await this.updateBankAccountStatusUseCase.execute(command);
    }
}