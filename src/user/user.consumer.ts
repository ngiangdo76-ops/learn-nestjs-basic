import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueName } from 'src/app.interface';

import { UserService } from './user.service';
let number = 0;
@Processor(QueueName.EMAIL)
export class UsersConsumer extends WorkerHost {
  constructor(private readonly userService: UserService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`Running job ${job.id}`);
    if (job.name == 'send-welcome-email') {
      const result = await this.sendWelcomeEmail(job.data.email);
      console.log(result);
    }

    if (job.name == 'send-email') {
      const result = await this.sendEmail(
        job.data.email,
        job.data.subject,
        job.data.message,
      );

      console.log(result);
    }
  }
  //
  async sendWelcomeEmail(email: string): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        number++;

        if (number < 3) {
          reject(`Send welcome email to ${email} failed`);
        } else {
          resolve(`Welcome email sent to ${email}`);
        }
      }, 1000);
    });
  }

  async sendEmail(to: string, subject: string, message: string): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        number++;
        if (number < 3) {
          reject(`Send to ${to} failed`);
        } else {
          resolve(
            `Email sent to ${to}, subject: ${subject}, message: ${message}`,
          );
        }
      }, 3000);
    });
  }
}
