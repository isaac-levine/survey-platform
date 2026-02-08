import {
  HttpException,
  HttpStatus,
  Logger,
  RawBodyRequest,
} from '@nestjs/common';
import { Request } from 'express';
import { Webhook } from 'svix';

export abstract class BaseWebhookController {
  protected abstract readonly logger: Logger;

  protected verifyWebhook(
    req: RawBodyRequest<Request>,
    body: any,
    svixId: string,
    svixTimestamp: string,
    svixSignature: string,
    secret: string,
  ): void {
    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new HttpException('Missing webhook headers', HttpStatus.UNAUTHORIZED);
    }

    try {
      const wh = new Webhook(secret);
      // req.rawBody is available when NestJS rawBody option is enabled
      if (!req.rawBody) {
        throw new HttpException('Raw body not available', HttpStatus.BAD_REQUEST);
      }

      wh.verify(req.rawBody.toString(), {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Webhook verification failed: ${errorMessage}`);
      throw new HttpException('Invalid webhook signature', HttpStatus.UNAUTHORIZED);
    }
  }
}
