import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CadenceModule } from './cadence/cadence.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { TemporalModule } from './temporal/temporal.module';

@Module({
  imports: [CadenceModule, EnrollmentModule, TemporalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
