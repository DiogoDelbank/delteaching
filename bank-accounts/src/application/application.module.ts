import { DomainModule } from '@domain/domain.module';
import { Module } from '@nestjs/common';
import { CreateBankAccountUseCase } from './use-cases/create-bank-account/create-bank-account.usecase';
import { GetBankAccountUseCase } from './use-cases/get-bank-account/get-bank-account.usecase';
import { UpdateHolderEmailUseCase } from './use-cases/update-holder-email/update-holder-email.usecase';

@Module({
    imports: [DomainModule],
    exports: [CreateBankAccountUseCase, GetBankAccountUseCase, UpdateHolderEmailUseCase],
    providers: [CreateBankAccountUseCase, GetBankAccountUseCase, UpdateHolderEmailUseCase]
})
export class ApplicationModule {}
