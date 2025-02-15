import { Module } from '@nestjs/common';
import { DomainModule } from './domain/domain.module';
import { ApplicationModule } from './application/application.module';
import { InfraModule } from './infra/infra.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [DomainModule, ApplicationModule, InfraModule, ApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
