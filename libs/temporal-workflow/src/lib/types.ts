export type Step = {
  id: string;
  type: 'SEND_EMAIL' | 'WAIT';
  subject?: string;
  body?: string;
  seconds?: number;
};

export type Cadence = {
  id: string;
  name: string;
  steps: Step[];
};

export enum WorkflowStatus {
  Started = 'STARTED',
  Running = 'RUNNING',
  Completed = 'COMPLETED',
}

export type WorkflowState = {
  currentStepIndex: number;
  stepsVersion: number;
  status: WorkflowStatus;
};

export type CadenceWorkflowArgs = {
  cadence: Cadence;
  contactEmail: string;
};

export type SendEmailResponse = {
  success: boolean;
  messageId: string;
  timestamp: number;
};

export type Enrollment = {
  cadenceId: string;
  contactEmail: string;
  workflowId: string;
  createdAt: number;
};
