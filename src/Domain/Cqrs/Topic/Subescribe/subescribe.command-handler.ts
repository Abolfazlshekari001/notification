import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionCommand } from './subescribe.command';
import { InjectRepository } from '@nestjs/typeorm';
import { topicsEntity } from 'src/Domain/Entities/Topic.entities';
import { IsNull, Not, Repository } from 'typeorm';
import { TopicService } from '../topic.service';
import { DeviceEntity } from 'src/Domain/Entities/Registered-Devices.entity';
import * as admin from 'firebase-admin';
import { HttpException, Inject } from '@nestjs/common';
import { SubscriptionEntity } from 'src/Domain/Entities/Subscription.entities';
import { Request_Was_Successful } from 'src/Common/translate/Successful.Translate';
import {
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { FirebaseService } from 'src/Configs/fireBase/firebase.service';

@CommandHandler(SubscriptionCommand)
export class SubscriptionCommandHandler
  implements ICommandHandler<SubscriptionCommand>
{
  constructor(
    @InjectRepository(topicsEntity)
    private readonly topicRepository: Repository<topicsEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subRepository: Repository<SubscriptionEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private readonly topicservice: TopicService,
    private readonly firebaseAdmin: FirebaseService,
  ) {}
  async execute(command: SubscriptionCommand): Promise<any> {
    const { topic_name, token, system_name, system_password } = command;
    try {
      const existingSystem = await this.topicservice.findSystem(
        system_name,
        system_password,
      );
      if (existingSystem) {
        const existingToken = await this.deviceRepository.findOne({
          where: {
            token_Device: token,
            deletedAt: IsNull(),
            systems: existingSystem,
          },
        });
        const existingTopic = await this.topicRepository.findOne({
          where: {
            topicName: topic_name,
            system: existingSystem,
            deletedAt: IsNull(),
          },
        });
        
        const existingSub = await this.subRepository.findOne({
          where: {
            topic: { id: existingTopic.id },
            device: { id: existingToken.id },
            system: { id: existingSystem.id },
            unSubscribed_date: Not(IsNull()),
          },
        });
        if (existingToken && existingTopic && existingSub === null ) {
          await this.firebaseAdmin.messagingService
            .subscribeToTopic(token, topic_name)
            .then((response) => {
              console.log('Successfully subscribed to topic:', response);
            })
            .catch((error) => {
              console.log('Error subscribing to topic:', error);
            });
          const result = new SubscriptionEntity();
          result.device = existingToken;
          result.topic = existingTopic;
          result.system = existingSystem;
          result.subscribed_Date = new Date();
          await this.subRepository.save(result);
          throw new HttpException(
            Request_Was_Successful,
            Request_Was_Successful.status_code,
          );
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
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else {
        throw error;
      }
    }
  }
}
