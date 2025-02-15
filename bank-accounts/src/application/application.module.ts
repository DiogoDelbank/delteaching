import { DomainModule } from '@domain/domain.module';
import { Module } from '@nestjs/common';
import { CreateBankAccountUseCase } from './use-cases/create-bank-account/create-bank-account.usecase';
import { GetBankAccountUseCase } from './use-cases/get-bank-account/get-bank-account.usecase';
import { UpdateHolderEmailUseCase } from './use-cases/update-holder-email/update-holder-email.usecase';
import { UpdateBankAccountStatusUseCase } from './use-cases/update-bank-account-status/update-bank-account.usecase';

@Module({
    imports: [DomainModule],
    exports: [CreateBankAccountUseCase, GetBankAccountUseCase, UpdateHolderEmailUseCase, UpdateBankAccountStatusUseCase],
    providers: [CreateBankAccountUseCase, GetBankAccountUseCase, UpdateHolderEmailUseCase, UpdateBankAccountStatusUseCase]
})
export class ApplicationModule {}
