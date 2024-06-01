import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionCommand } from './subescribe.command';
import { InjectRepository } from '@nestjs/typeorm';
import { topicsEntity } from 'src/Domain/Entities/Topic.entities';
import { In, IsNull, Repository } from 'typeorm';
import { TopicService } from '../topic.service';
import { DeviceEntity } from 'src/Domain/Entities/Registered-Devices.entity';
import { HttpException } from '@nestjs/common';
import { SubscriptionEntity } from 'src/Domain/Entities/Subscription.entities';
import { Request_Was_Successful } from 'src/Common/translate/Successful.Translate';
import {
  InternalServerError,
  NoContent,
  Token_Is_Subescribed,
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
    const { topic_name, tokens, system_name, system_password } = command;
    try {
      const existingSystem = await this.topicservice.findSystem(
        system_name,
        system_password,
      );

      if (existingSystem) {
        const existingTokens = await this.deviceRepository.find({
          where: {
            token_Device: In(tokens),
            deletedAt: IsNull(),
            system: existingSystem,
          },
        });

        const existingTopic = await this.topicRepository.findOne({
          where: {
            topicName: topic_name,
            system: existingSystem,
            deletedAt: IsNull(),
          },
        });

        if (existingTokens.length > 0 && existingTopic) {
          const existingSubs = await this.subRepository.find({
            where: {
              topic: { id: existingTopic.id },
              device: { id: In(existingTokens.map((token) => token.id)) },
              system: { id: existingSystem.id },
              unSubscribed_date: IsNull(),
            },
          });

          if (existingSubs.length == 0) {
            const tokensToSubscribe = existingTokens.filter(
              (token) =>
                !existingSubs.some((sub) => sub.device.id === token.id),
            );
            if (tokensToSubscribe.length > 0) {
              await this.firebaseAdmin.messagingService
                .subscribeToTopic(
                  tokensToSubscribe.map((token) => token.token_Device),
                  topic_name,
                )
                .then((response) => {
                  console.log('Successfully subscribed to topic:', response);
                })
                .catch((error) => {
                  console.log('Error subscribing to topic:', error);
                });

              for (const token of tokensToSubscribe) {
                const result = new SubscriptionEntity();
                result.device = token;
                result.topic = existingTopic;
                result.system = existingSystem;
                result.subscribed_Date = new Date();
                await this.subRepository.save(result);
              }

              existingTopic.countSubescribe += tokensToSubscribe.length;
              await this.topicRepository.save(existingTopic);

              throw new HttpException(
                Request_Was_Successful,
                Request_Was_Successful.status_code,
              );
            } else {
              const NoContentErr = NoContent(
                'درخواست حاوی پاسخ نمیباشد',
                'The response is empty',
              );
              throw new HttpException(NoContentErr, NoContentErr.status_code);
            }
          } else {
            throw new HttpException(
              Token_Is_Subescribed,
              Token_Is_Subescribed.status_code,
            );
          }
        } else {
          const NoContentErr = NoContent(
            'درخواست حاوی پاسخ نمیباشد',
            'The response is empty',
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
