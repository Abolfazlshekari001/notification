import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { addTopicCommand } from './AddTopic.command';
import { InjectRepository } from '@nestjs/typeorm';
import { System } from 'src/Domain/Entities/System.entity';
import { IsNull, LEGAL_TCP_SOCKET_OPTIONS, Not, Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import {
  Unauthorized,
  InternalServerError,
} from 'src/Common/translate/Error.Translate';
import {
  Request_Was_Successful1,
} from 'src/Common/translate/Successful.Translate';
import { topicsEntity } from 'src/Domain/Entities/Topic.entities';
import { TopicService } from '../topic.service';
import { getConnection } from 'typeorm';
@CommandHandler(addTopicCommand)
export class addTopicCommandHandler
  implements ICommandHandler<addTopicCommand>
{
  constructor(
    @InjectRepository(topicsEntity)
    private readonly topicRepository: Repository<topicsEntity>,
    private readonly topicservice: TopicService,
  ) {}

  async execute(command: addTopicCommand): Promise<any> {
    const { topic_name, decriptions_topic, system_name, system_password } =
      command;

    try {
      const existingSystem = await this.topicservice.findSystem(
        system_name,
        system_password,
      );
      if (existingSystem) {
        const existingTopic = await this.topicRepository.findOne({
          where: {
            topicName: topic_name,
            system: existingSystem,
          },
          withDeleted: true,
        });

        if (existingTopic) {
          if (existingTopic.deletedAt) {
            existingTopic.deletedAt = null;
            await this.topicRepository.save(existingTopic);
            const response = Request_Was_Successful1(
              `Reactivated topic: ${existingTopic.id}`,
            );
            throw new HttpException(response, response.status_code);
          } else {
            return { message: 'Topic already exists and is active' };
          }
        } else {
          const newTopic = new topicsEntity();
          newTopic.topicName = topic_name;
          newTopic.descriptions = decriptions_topic;
          newTopic.system = existingSystem;
          await this.topicRepository.save(newTopic);
          const additional_info = `topicId:${newTopic.id}`;
          const response = Request_Was_Successful1(additional_info);
          throw new HttpException(response, response.status_code);
        }
      } else {
        const unauthorizedErr = Unauthorized(
          'سیستم نامعتبر است',
          'The system is invalid',
        );
        throw new HttpException(unauthorizedErr, unauthorizedErr.status_code);
      }
    } catch (error) {
      if (!error.status) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else {
        throw error;
      }
    }
  }
}
