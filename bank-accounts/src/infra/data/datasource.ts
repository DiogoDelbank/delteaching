import * as dotenv from "dotenv";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Balance } from "../../domain/aggregates/balances/balance.entity";
import { BankAccount } from "../../domain/aggregates/bank-accounts/bank-account.entity";
import { Transaction } from "../../domain/aggregates/transactions/transaction.entity";

dotenv.config();

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            synchronize: false,
            logging: false,
            entities: [BankAccount, Transaction, Balance]
        })
    ]
})
export class AppDataSource {}