import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { addTopicCommand } from './AddTopic.command';
import { InjectRepository } from '@nestjs/typeorm';
import { System } from 'src/Domain/Entities/System.entity';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import {
  Unauthorized,
  InternalServerError,
} from 'src/Common/translate/Error.Translate';
import { Request_Was_Successful } from 'src/Common/translate/Successful.Translate';
import { topicsEntity } from 'src/Domain/Entities/Topic.entities';
import { TopicService } from '../topic.service';

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
    const { topic_name,  decriptions_topic, system_name, system_password } =
      command;
    try {
      console.log();
      const existingSystem = await this.topicservice.findSystem(
        system_name,
        system_password,
      );
      if (existingSystem) {
        const result = new topicsEntity();
        result.topicName = topic_name;
        result.descriptions = decriptions_topic;
        result.system = existingSystem;
        await this.topicRepository.insert(result);
        throw new HttpException(
          Request_Was_Successful,
          Request_Was_Successful.status_code,
        );
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
