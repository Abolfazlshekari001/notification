import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import {
  DataNotFound2,
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { unSubscriptionCommand } from './unSubescribe.command';
import { FirebaseService } from 'src/config/fireBase/firebase.service';
import { DeviceEntity } from 'src/domains/Entities/Registered-Devices.entity';
import { SubscriptionEntity } from 'src/domains/Entities/Subscription.entities';
import { topicsEntity } from 'src/domains/Entities/Topic.entities';
import { TopicService } from '../../topic.service';
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
    const { topic_name, tokens, system_name, system_password, ids } = command;
    try {
      const existingSystem = await this.topicService.findSystem(
        system_name,
        system_password,
      );
      if (existingSystem) {
        const existingTokens = await this.deviceRepository.find({
          where: {
            token_Device: In(tokens),
            system: existingSystem,
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

        if (existingTokens.length > 0 && existingTopic) {
          const existingSubs = await this.subRepository.find({
            where: {
              id: In(ids),
              topic: { id: existingTopic.id },
              device: { id: In(existingTokens.map((token) => token.id)) },
              system: { id: existingSystem.id },
              unSubscribed_date: IsNull(),
            },
            relations: ['device'],
          });
          if (existingSubs.length > 0) {
            const tokensToUnsubscribe = existingTokens.map(
              (token) => token.token_Device,
            );

            if (tokensToUnsubscribe.length > 0) {
              await this.firebaseService.unsubscribeFromTopic(
                tokensToUnsubscribe,
                topic_name,
                existingSystem.firebaseServiceAccountPath,
              );

              const subsToUpdate = existingSubs
                .map((sub) => ({
                  sub,
                  token: sub.device?.token_Device,
                }))
                .filter(({ token }) => tokensToUnsubscribe.includes(token))
                .map(({ sub }) => sub);
              for (const sub of subsToUpdate) {
                sub.unSubscribed_date = new Date();
                await this.subRepository.save(sub);
                existingTopic.countSubescribe -= 1;
                await this.topicRepository.save(existingTopic);
              }

              return {
                unsubscribed_tokens: tokensToUnsubscribe,
              };
            } else {
              const NoContentErr = NoContent(
                'درخواست حاوی پاسخ نمیباشد',
                'The response is empty ',
              );
              throw new HttpException(NoContentErr, NoContentErr.status_code);
            }
          } else {
            throw new HttpException(DataNotFound2, DataNotFound2.status_code);
          }
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
