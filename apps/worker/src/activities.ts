import {
  Activities,
  SendEmailResponse,
} from '@email-cadence/temporal-workflow';
import { randomUUID } from 'crypto';

export const createActivities = (): Activities => ({
  async sendEmail(
    email: string,
    subject: string,
    body: string,
  ): Promise<SendEmailResponse> {
    console.log(
      `[ACTIVITY] sending email recipient=${email}`,
      `subject=${subject}`,
      `body=${body}`,
    );

    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      messageId: `msg_${randomUUID()}`,
      timestamp: Date.now(),
    };
  },
});
