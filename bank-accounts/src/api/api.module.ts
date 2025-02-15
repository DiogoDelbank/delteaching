import { DomainModule } from '@domain/domain.module';
import { InfraModule } from '@infra/infra.module';
import { Module } from '@nestjs/common';

@Module({
    imports: [ApiModule, DomainModule, InfraModule]
})
export class ApiModule {}
