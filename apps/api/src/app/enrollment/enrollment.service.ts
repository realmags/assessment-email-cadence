import { Injectable } from '@nestjs/common';
import { TemporalService } from '../temporal/temporal.service';
import { CadenceService } from '../cadence/cadence.service';
import {
  cadenceWorkflow,
  updateCadenceSignal,
  getStateQuery,
  Step,
  Enrollment,
  WorkflowStatus,
} from '@email-cadence/temporal-workflow';

@Injectable()
export class EnrollmentService {
  private enrollments: Enrollment[] = [];

  constructor(
    private readonly temporal: TemporalService,
    private readonly cadence: CadenceService,
  ) {}

  async enroll(cadenceId: string, contactEmail: string) {
    const cadence = this.cadence.findOne(cadenceId);
    const validCadence = JSON.parse(JSON.stringify(cadence));

    const client = this.temporal.getClient();
    const workflowId = `workflow-${cadenceId}-${contactEmail}-${Date.now()}`;

    await client.workflow.start(cadenceWorkflow, {
      taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'cadence-email-queue',
      workflowId,
      args: [{ cadence: validCadence, contactEmail }],
    });

    const enrollment = {
      cadenceId,
      contactEmail,
      workflowId,
      createdAt: Date.now(),
    };

    this.enrollments.push(enrollment);

    return { workflowId, status: WorkflowStatus.Started };
  }

  getEnrollments() {
    return this.enrollments;
  }

  async getStatus(workflowId: string) {
    const client = this.temporal.getClient();
    const handle = client.workflow.getHandle(workflowId);

    return await handle.query(getStateQuery);
  }

  async updateWorkflow(workflowId: string, steps: Step[]) {
    const client = this.temporal.getClient();
    const handle = client.workflow.getHandle(workflowId);

    await handle.signal(updateCadenceSignal, steps);

    return { success: true };
  }
}
