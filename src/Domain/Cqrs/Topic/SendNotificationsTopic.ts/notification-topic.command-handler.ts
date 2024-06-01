import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { sendNotificationTopicCommand } from './notification-topic.command';
import { TopicService } from '../topic.service';
import * as admin from 'firebase-admin';
import { HttpException, Inject } from '@nestjs/common';
import { clearScreenDown } from 'readline';
import {
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { FirebaseService } from 'src/Configs/fireBase/firebase.service';
import { InjectRepository } from '@nestjs/typeorm';
import { topicsEntity } from 'src/Domain/Entities/Topic.entities';
import { IsNull, Repository } from 'typeorm';
import { Request_Was_Successful1 } from 'src/Common/translate/Successful.Translate';

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
      if (existingSystem) {
        const existingTopics = await this.topicRepository.findOne({
          where: {
            topicName: topic_name,
            deletedAt: IsNull(),
          },
        });
        if (existingTopics) {
          const payload = {
            notification: {
              title: title,
              body: message,
            },
          };

          const response =
            await this.firebaseAdmin.messagingService.sendToTopic(
              topic_name,
              payload,
            );

            
          const additional_info = response;
          const result = Request_Was_Successful1(additional_info);
          throw new HttpException(result, result.status_code);
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
