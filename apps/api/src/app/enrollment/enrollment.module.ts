import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { CadenceModule } from '../cadence/cadence.module';
import { TemporalModule } from '../temporal/temporal.module';

@Module({
    imports: [CadenceModule, TemporalModule],
    controllers: [EnrollmentController],
    providers: [EnrollmentService],
})
export class EnrollmentModule { }
