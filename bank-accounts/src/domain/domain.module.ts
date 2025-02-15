import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccount } from './aggregates/bank-accounts/bank-account.entity';
import { Balance } from './aggregates/balances/balance.entity';
import { Transaction } from './aggregates/transactions/transaction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BankAccount, Balance, Transaction])],
    exports: [TypeOrmModule]
})
export class DomainModule {}