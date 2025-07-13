import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { updateTopicCommand } from './updateTopic.command';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { topicsEntity } from 'src/domains/Entities/Topic.entities';
import { NoContent, Unauthorized } from 'src/Common/translate/Error.Translate';
import { TopicService } from '../../topic.service';

@CommandHandler(updateTopicCommand)
export class updateTopicCommandHandler
  implements ICommandHandler<updateTopicCommand>
{
  constructor(
    @InjectRepository(topicsEntity)
    private readonly topicRepository: Repository<topicsEntity>,
    private readonly topicservice: TopicService,
  ) {}
  async execute(command: updateTopicCommand): Promise<any> {
    const {
      id_topic,
      system_name,
      system_password,
      topic_name,
      decriptions_topic,
    } = command;
    const existingSystem = await this.topicservice.findSystem(
      system_name,
      system_password,
    );
    if (existingSystem) {
      const existingTopic = await this.topicRepository.findOne({
        where: {
          id: id_topic,
          system: existingSystem,
          deletedAt: IsNull(),
        },
      });
      if (existingTopic) {
        if (existingTopic.topicName != undefined) {
          existingTopic.topicName = topic_name;
        }
        if (existingTopic.decriptions != undefined) {
          existingTopic.decriptions = decriptions_topic;
        }
        await this.topicRepository.save(existingTopic);
        return existingTopic;
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
    return;
  }
}
