import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity } from 'src/Domain/Entities/Registered-Devices.entity';
import { SubscriptionEntity } from 'src/Domain/Entities/Subscription.entities';
import { topicsEntity } from 'src/Domain/Entities/Topic.entities';
import { IsNull, Not, Repository } from 'typeorm';
import { TopicService } from '../topic.service';
import { HttpException, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Request_Was_Successful } from 'src/Common/translate/Successful.Translate';
import {
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { unSubscriptionCommand } from './unSubescribe.command';
import { FirebaseService } from 'src/Configs/fireBase/firebase.service';
@CommandHandler(unSubscriptionCommand)
export class unSubscriptionCommandHandler
  implements ICommandHandler<unSubscriptionCommand>
{
  constructor(
    @InjectRepository(topicsEntity)
    private readonly topicRepository: Repository<topicsEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subRepository: Repository<SubscriptionEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private readonly topicService: TopicService,
    private readonly firebaseService: FirebaseService,
  ) {}
  async execute(command: unSubscriptionCommand): Promise<any> {
    const { topic_name, token, system_name, system_password, id_sub } = command;
    try {
      const existingSystem = await this.topicService.findSystem(
        system_name,
        system_password,
      );
      if (existingSystem) {
        const existingToken = await this.deviceRepository.findOne({
          where: {
            token_Device: token,
            systems: existingSystem,
            deletedAt: IsNull(),
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
            id: id_sub,
            topic: { id: existingTopic.id },
            device: { id: existingToken.id },
            system: { id: existingSystem.id },
            unSubscribed_date: IsNull(),
          },
        });
        console.log(existingSub);
        if (existingToken && existingTopic && existingSub) {
          await this.firebaseService.messagingService
            .unsubscribeFromTopic(token, topic_name)
            .then((response) => {
              console.log('Successfully unsubscribed to topic:', response);
            })
            .catch((error) => {
              console.log('Error unsubscribing to topic:', error);
            });
          existingSub.unSubscribed_date = new Date();
          await this.subRepository.save(existingSub);
          throw new HttpException(
            Request_Was_Successful,
            Request_Was_Successful.status_code,
          );
        } else {
          const NoContenttErr = NoContent(
            'درخواست حاوی پاسخ نمیباشد',
            'The response is empty ',
          );
          throw new HttpException(NoContenttErr, NoContenttErr.status_code);
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
