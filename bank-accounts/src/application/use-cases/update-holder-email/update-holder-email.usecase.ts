import { BankAccount } from "@domain/aggregates/bank-accounts/bank-account.entity";
import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateHolderEmailCommand } from "./update-holder-email.command";
import { DomainException } from "@domain/common/domain-exception";

@Injectable()
export class UpdateHolderEmailUseCase {
    constructor(
        @InjectRepository(BankAccount)
        private readonly bankAccountRepository: Repository<BankAccount>
    ) {}

    public async execute(command: UpdateHolderEmailCommand) {
        const bankAccount = await this.bankAccountRepository.findOneBy({ number: command.bankAccountNumber })
        if (!bankAccount)
            throw new DomainException(`Conta bancária ${command.bankAccountNumber} não encontrada.`, HttpStatus.NOT_FOUND);

        bankAccount.updateEmail(command.holderEmail);
        await this.bankAccountRepository.save(bankAccount);
    }
}