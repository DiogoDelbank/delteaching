import { DomainModule } from '@domain/domain.module';
import { InfraModule } from '@infra/infra.module';
import { Module } from '@nestjs/common';
import { BankAccountsController } from './controllers/bank-accounts.controller';
import { ApplicationModule } from '@application/application.module';

@Module({
    imports: [ApiModule, ApplicationModule, DomainModule, InfraModule],
    controllers: [BankAccountsController]
})
export class ApiModule {}
