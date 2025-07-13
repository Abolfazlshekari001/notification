import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionCommand } from './subescribe.command';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { TopicService } from '../../topic.service';
import { HttpException } from '@nestjs/common';
import {
  InternalServerError,
  NoContent,
  Token_Is_Subescribed,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { FirebaseService } from 'src/config/fireBase/firebase.service';
import { DeviceEntity } from 'src/domains/Entities/Registered-Devices.entity';
import { SubscriptionEntity } from 'src/domains/Entities/Subscription.entities';
import { topicsEntity } from 'src/domains/Entities/Topic.entities';

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

      if (!existingSystem) {
        const unauthorizedErr = Unauthorized(
          'سیستم نامعتبر است',
          'The system is invalid',
        );
        throw new HttpException(unauthorizedErr, unauthorizedErr.status_code);
      }
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
            (token) => !existingSubs.some((sub) => sub.device.id === token.id),
          );
          if (tokensToSubscribe.length > 0) {
            await this.firebaseAdmin.subscribeToTopic(
              tokensToSubscribe.map((token) => token.token_Device),
              topic_name,
              existingSystem.firebaseServiceAccountPath,
            );

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
            return {
              topic: topic_name,
              subscribed_tokens: tokensToSubscribe.length,
              total_subscribers: existingTopic.countSubescribe,
            };
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
