import { Injectable } from "@nestjs/common";
import { GetBankAccountDetailsQuery } from "./get-bank-account-details.query";
import { BankAcocuntDto } from "@domain/dtos/bank-account.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { BankAccount } from "@domain/aggregates/bank-accounts/bank-account.entity";
import { Repository } from "typeorm";

@Injectable()
export class GetBankAccountDetailsUseCase {
    constructor(
        @InjectRepository(BankAccount)
        private readonly bankAccountRepository: Repository<BankAccount>
    ) {}

    public async execute(query: GetBankAccountDetailsQuery): Promise<BankAccount> {
        const bankAccount = await this.bankAccountRepository.findOne({
            where: {
                number: query.bankAccountNumber
            },
            relations: ['Balances']
        });
        return bankAccount;
    }
}