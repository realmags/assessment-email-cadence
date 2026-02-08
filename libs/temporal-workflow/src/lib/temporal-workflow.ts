import {
  proxyActivities,
  sleep,
  defineSignal,
  defineQuery,
  setHandler,
} from '@temporalio/workflow';
import {
  Step,
  WorkflowState,
  CadenceWorkflowArgs,
  WorkflowStatus,
} from './types';
import { Activities } from './activities';

const { sendEmail } = proxyActivities<Activities>({
  startToCloseTimeout: '1 minute',
});

export const updateCadenceSignal = defineSignal<[Step[]]>('updateCadence');
export const getStateQuery = defineQuery<WorkflowState>('getState');

export async function cadenceWorkflow(args: CadenceWorkflowArgs) {
  const { cadence, contactEmail } = args;
  let currentStepIndex = 0;
  let stepsVersion = 0;
  let status: WorkflowStatus = WorkflowStatus.Running;

  setHandler(getStateQuery, () => ({
    currentStepIndex,
    stepsVersion,
    status,
  }));

  setHandler(updateCadenceSignal, (newSteps: Step[]) => {
    cadence.steps = newSteps;
    stepsVersion++;

    if (newSteps.length <= currentStepIndex) {
      status = WorkflowStatus.Completed;
    }
  });

  try {
    while (
      currentStepIndex < cadence.steps.length &&
      status === WorkflowStatus.Running
    ) {
      const step = cadence.steps[currentStepIndex];

      if (step.type === 'WAIT' && step.seconds) {
        await sleep(step.seconds * 1000);
      } else if (step.type === 'SEND_EMAIL') {
        await sendEmail(contactEmail, step.subject || '', step.body || '');
      }

      currentStepIndex++;

      if (currentStepIndex >= cadence.steps.length) {
        status = WorkflowStatus.Completed;
      }
    }
    status = WorkflowStatus.Completed;
  } catch (err) {
    status = WorkflowStatus.Completed;
    throw err;
  }
}
