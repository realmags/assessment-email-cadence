import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { Step } from '@email-cadence/temporal-workflow';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollment: EnrollmentService) {}

  @Post()
  enroll(@Body() body: { cadenceId: string; contactEmail: string }) {
    return this.enrollment.enroll(body.cadenceId, body.contactEmail);
  }

  @Get()
  getEnrollments() {
    return this.enrollment.getEnrollments();
  }

  @Get(':id')
  getStatus(@Param('id') id: string) {
    return this.enrollment.getStatus(id);
  }

  @Post(':id/update-cadence')
  updateWorkflow(@Param('id') id: string, @Body() body: { steps: Step[] }) {
    return this.enrollment.updateWorkflow(id, body.steps);
  }
}
