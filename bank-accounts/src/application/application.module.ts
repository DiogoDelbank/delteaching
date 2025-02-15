import { DomainModule } from '@domain/domain.module';
import { Module } from '@nestjs/common';

@Module({
    imports: [DomainModule]
})
export class ApplicationModule {}
