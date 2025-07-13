import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { sendNotificationTopicCommand } from './notification-topic.command';
import { HttpException } from '@nestjs/common';

import {
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FirebaseService } from 'src/config/fireBase/firebase.service';
import { topicsEntity } from 'src/domains/Entities/Topic.entities';
import { TopicService } from '../../topic.service';

@CommandHandler(sendNotificationTopicCommand)
export class sendNotificationTopicCommandHandler
  implements ICommandHandler<sendNotificationTopicCommand>
{
  constructor(
    @InjectRepository(topicsEntity)
    private readonly topicRepository: Repository<topicsEntity>,
    private readonly topicservice: TopicService,
    private readonly firebaseAdmin: FirebaseService,
  ) {}
  async execute(command: sendNotificationTopicCommand): Promise<any> {
    const { title, message, topic_name, system_name, system_password } =
      command;
    try {
      const existingSystem = await this.topicservice.findSystem(
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
      const existingTopics = await this.topicservice.findOneTopicByName(
        topic_name,
        system_name,
        system_password,
      );
      if (!existingTopics) {
        const NoContentErr = NoContent(
          'درخواست حاوی پاسخ نمیباشد',
          'The response is empty ',
        );
        throw new HttpException(NoContentErr, NoContentErr.status_code);
      }
      const payload = {
        notification: {
          title: title,
          body: message,
        },
      };
      const response = await this.firebaseAdmin.sendToTopic(
        topic_name,
        payload,
        existingSystem.firebaseServiceAccountPath,
      );
      return {
        topicName: topic_name,
        notificationId: response,
      };
    } catch (error) {
      console.log('Error sending message :', error);
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else {
        throw error;
      }
    }
  }
}
