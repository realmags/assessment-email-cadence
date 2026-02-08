import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { CadenceService } from './cadence.service';
import { Cadence } from '@email-cadence/temporal-workflow';

@Controller('cadences')
export class CadenceController {
  constructor(private readonly cadence: CadenceService) {}

  @Post()
  create(@Body() cadence: Cadence) {
    return this.cadence.create(cadence);
  }

  @Get()
  findAll() {
    return this.cadence.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cadence.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() cadence: Cadence) {
    return this.cadence.update(id, cadence);
  }
}
