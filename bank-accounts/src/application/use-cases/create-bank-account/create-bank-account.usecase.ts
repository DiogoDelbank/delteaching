import { BankAccount } from "@domain/aggregates/bank-accounts/bank-account.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateBankaAccountCommand } from "./create-bank-account.command";
import { Balance } from "@domain/aggregates/balances/balance.entity";

@Injectable()
export class CreateBankAccountUseCase {
    constructor(
        @InjectRepository(BankAccount)
        private readonly bankAccountRepository: Repository<BankAccount>,
    ) {}
    
    public async execute(command: CreateBankaAccountCommand): Promise<void> {
        const bankAccount = new BankAccount().create({
            bankAccountNumber: command.bankAccountNumber,
            holderName: command.holderName,
            holderDocument: command.holderDocument,
            holderEmail: command.holderEmail,
            holderType: command.holderType,
            type: command.bankAccountType,
            branch: command.branch
        });

        const balance = new Balance().create(bankAccount);

        const queryRunner = this.bankAccountRepository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.save(bankAccount);
            await queryRunner.manager.save(balance);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}