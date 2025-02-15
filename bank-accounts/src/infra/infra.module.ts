import { Module } from '@nestjs/common';
import { AppDataSource } from './data/datasource';
import { ApplicationModule } from '@application/application.module';
import { DomainModule } from '@domain/domain.module';

@Module({
    imports: [AppDataSource, ApplicationModule, DomainModule]
})
export class InfraModule {}
