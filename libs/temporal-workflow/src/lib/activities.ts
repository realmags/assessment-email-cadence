import { SendEmailResponse } from './types';

export interface Activities {
    sendEmail(email: string, subject: string, body: string): Promise<SendEmailResponse>;
}
