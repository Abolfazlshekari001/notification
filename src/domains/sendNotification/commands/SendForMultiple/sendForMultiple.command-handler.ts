import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendToMultipleTopicsCommand } from './sendForMultiple.command';
import { HttpException } from '@nestjs/common';

import {
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FirebaseService } from 'src/config/fireBase/firebase.service';
import { topicsEntity } from 'src/domains/Entities/Topic.entities';
import { SendNotificationService } from '../../send-notification.service';
@CommandHandler(SendToMultipleTopicsCommand)
export class SendToMultipleTopicsCommandHandler
  implements ICommandHandler<SendToMultipleTopicsCommand>
{
  constructor(
    private firebaseMessaging: FirebaseService,
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
      if (!existingSystem) {
        const unauthorizedErr = Unauthorized(
          'سیستم نامعتبر است',
          'The system is invalid',
        );
        throw new HttpException(unauthorizedErr, unauthorizedErr.status_code);
      }

      const existingTopics = await this.topicRepository.find({
        where: {
          topicName: In(topicsArray),
        },
      });

      const existingTopicNames = existingTopics.map((topic) => topic.topicName);
      const missingTopics = topicsArray.filter(
        (topic) => !existingTopicNames.includes(topic),
      );
      if (missingTopics.length > 0) {
        console.warn(
          `The following topics do not exist: ${missingTopics.join(', ')}. Proceeding with existing topics.`,
        );
      }

      if (existingTopicNames.length === 0) {
        const noContentErr = NoContent(
          'هیچ تاپیکی برای ارسال نوتیفیکیشن یافت نشد',
          'No topics found for sending notification',
        );
        throw new HttpException(noContentErr, noContentErr.status_code);
      }
      const condition = existingTopicNames
        .map((topic: string) => `'${topic}' in topics`)
        .join(' || ');

      const payload = {
        notification: {
          title: title,
          body: message,
        },
        data: {},
      };
      const response = await this.firebaseMessaging.sendToCondition(
        condition,
        payload,
        existingSystem.firebaseServiceAccountPath,
      );

      return {
        success: true,
        message: 'Notification sent successfully',
        sentToTopics: existingTopicNames,
        notificationId: response.response,
      };
    } catch (error) {
      if (error.code && error.code.startsWith('messaging/')) {
        if (error.code === 'messaging/unknown-error') {
          console.error(
            'Unknown Firebase error. Raw server response:',
            error.message,
          );
          console.error(
            'Check Firebase configuration, condition, and service account.',
          );
        }
        const firebaseError = new Error(
          `Firebase Messaging Error: ${error.message}`,
        );
        firebaseError.name = error.code as string;
        throw firebaseError;
      } else if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else {
        throw error;
      }
    }
  }
}
