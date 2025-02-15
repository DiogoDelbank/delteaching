import { InjectRepository } from "@nestjs/typeorm";
import { UpdateBankAccountStatusCommand } from "./update-bank-account-status.command";
import { BankAccount } from "@domain/aggregates/bank-accounts/bank-account.entity";
import { Repository } from "typeorm";
import { DomainException } from "@domain/common/domain-exception";
import { HttpStatus } from "@nestjs/common";

export class UpdateBankAccountStatusUseCase {
    constructor(
        @InjectRepository(BankAccount)
        private readonly bankAccountRepository: Repository<BankAccount>
    ) { }

    public async execute(command: UpdateBankAccountStatusCommand) {
        const bankAccount = await this.bankAccountRepository.findOneBy({ number: command.bankAccountNumber })
        if (!bankAccount)
            throw new DomainException(`Conta bancária ${command.bankAccountNumber} não encontrada.`, HttpStatus.NOT_FOUND);

        bankAccount.updateStatus(command.status);
        
        await this.bankAccountRepository.save(bankAccount);
    }
}