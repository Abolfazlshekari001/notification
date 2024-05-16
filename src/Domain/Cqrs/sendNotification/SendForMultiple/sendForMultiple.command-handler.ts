import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendToMultipleTopicsCommand } from './sendForMultiple.command';
import { HttpException, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SendNotificationService } from '../send-notification.service';
import {
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { topicsEntity } from 'src/Domain/Entities/Topic.entities';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FirebaseService } from 'src/Configs/fireBase/firebase.service';
@CommandHandler(SendToMultipleTopicsCommand)
export class SendToMultipleTopicsCommandHandler
  implements ICommandHandler<SendToMultipleTopicsCommand>
{
  constructor(
    private firebaseMessaging:FirebaseService,
    private readonly notificationService: SendNotificationService,
    @InjectRepository(topicsEntity)
    private readonly topicRepository: Repository<topicsEntity>,
  ) {}

  async execute(command: SendToMultipleTopicsCommand): Promise<any> {
    const { title, message, topics, system_name, system_password } = command;
    try {
      let topicsArray: string[];
      if (typeof topics === 'string') {
        topicsArray = topics.split(',');
      } else if (Array.isArray(topics)) {
        topicsArray = topics;
      } else {
        throw new Error(
          'Invalid topics type. Expected string or string array.',
        );
      }
      const existingSystem = await this.notificationService.findSystem(
        system_name,
        system_password,
      );
      if (existingSystem) {
        const existingTopics = await this.topicRepository.find({
          where: {
            topicName: In(topicsArray),
          },
        });

        if (existingTopics) {
          const condition = topicsArray
            .map((topic: string) => `'${topic}' in topics`)
            .join(' || ');
            const payload = {
              notification: {
                title: title,
                body: message,
              },
            };
            const response = await this.firebaseMessaging.messagingService.sendToCondition(condition, payload);
          console.log('Successfully sent message:', response);
          return response;
        } else {
          const NoContentErr = NoContent(
            'درخواست حاوی پاسخ نمیباشد',
            'The response is empty ',
          );
          throw new HttpException(NoContentErr, NoContentErr.status_code);
        }
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
      } else {
        throw error;
      }
    }
  }
}
