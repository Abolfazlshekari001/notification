import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { addTopicCommand } from './AddTopic.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import {
  Unauthorized,
  InternalServerError,
} from 'src/Common/translate/Error.Translate';
import { TopicService } from '../../topic.service';
import { topicsEntity } from 'src/domains/Entities/Topic.entities';
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
      if (!existingSystem) {
        const unauthorizedErr = Unauthorized(
          'سیستم نامعتبر است',
          'The system is invalid',
        );
        throw new HttpException(unauthorizedErr, unauthorizedErr.status_code);
      }
      const existingTopic = await this.topicservice.findOneTopicByName(
        topic_name,
        system_name,
        system_password,
      );
      let result;
      if (existingTopic) {
        if (existingTopic.deletedAt) {
          existingTopic.deletedAt = null;
          result = await this.topicRepository.save(existingTopic);
          delete result['system'];
          return result;
        } else {
          return { message: 'Topic already exists and is active' };
        }
      } else {
        const newTopic = new topicsEntity();
        newTopic.topicName = topic_name;
        if (decriptions_topic != undefined) {
          newTopic.descriptions = decriptions_topic;
        }
        newTopic.system = existingSystem;
        result = await this.topicRepository.save(newTopic);
        delete result['system'];
        return result;
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
