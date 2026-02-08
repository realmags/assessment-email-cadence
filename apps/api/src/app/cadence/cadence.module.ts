import { Module } from '@nestjs/common';
import { CadenceService } from './cadence.service';
import { CadenceController } from './cadence.controller';

@Module({
    controllers: [CadenceController],
    providers: [CadenceService],
    exports: [CadenceService],
})
export class CadenceModule { }
