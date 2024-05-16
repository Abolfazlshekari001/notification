import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { sendForOnePersonCommand } from './SendForOnePerson.command';
import { SendNotificationService } from '../send-notification.service';
import {
  InternalServerError,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { HttpException, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseService } from 'src/Configs/fireBase/firebase.service';
@CommandHandler(sendForOnePersonCommand)
export class sendForOnePersonCommandHandler
  implements ICommandHandler<sendForOnePersonCommand>
{
  constructor(

    private firebaseMessaging: FirebaseService,
    private readonly notificationService: SendNotificationService,
  ) {}
  async execute(command: sendForOnePersonCommand): Promise<any> {
    const { title, message, token, system_name, system_password } = command;
    try {
      const existingSystem = await this.notificationService.findSystem(
        system_name,
        system_password,
      );
      if (existingSystem) {
        const payload = {
          token: token,
          notification: {
            title: title,
            body: message, 
          },
        };
        const response = await this.firebaseMessaging.messagingService.send(payload)
        console.log('Successfully sent message:', response);
        return response;
      } else {
        const unauthorizedErr = Unauthorized(
          'سیستم نامعتبر است',
          'The system is invalid',
        );
        throw new HttpException(unauthorizedErr, unauthorizedErr.status_code);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else throw error;
    }
  }
}
