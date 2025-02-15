import { BankAccount } from "@domain/aggregates/bank-accounts/bank-account.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GetBankAccountQuery } from "./get-bank-account.query";
import { BankAcocuntDto } from "@domain/dtos/bank-account.dto";
import { BankAccountTypeLabel } from "@domain/aggregates/bank-accounts/bank-account-type.enum";
import { HolderTypeLabel } from "@domain/aggregates/bank-accounts/holder-type.enum";

@Injectable()
export class GetBankAccountUseCase {
    constructor(
        @InjectRepository(BankAccount)
        private readonly bankAccountRepository: Repository<BankAccount>
    ) {}

    public async execute(command: GetBankAccountQuery): Promise<BankAcocuntDto[]> {
        const bankAccounts = await this.bankAccountRepository.findBy({ 
            number: command.bankAccountNumber, 
            branch: command.branch,
            holderDocument: command.holderDocument
        });
        
        return this.bankAccountMapper(bankAccounts);
    }

    private bankAccountMapper(bankAccounts: BankAccount[]): BankAcocuntDto[] {
        return bankAccounts.map((bankAccount: BankAccount) => ({
            number: bankAccount.number,
            branch: bankAccount.branch,
            type: BankAccountTypeLabel[bankAccount.type],
            createdAt: bankAccount.createdAt,
            updatedAt: bankAccount.updatedAt,
            holder: {
                name: bankAccount.holderName,
                email: bankAccount.holderEmail,
                document: bankAccount.holderDocument,
                type: HolderTypeLabel[bankAccount.holderType]
            }
        }));
    }
}