import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneTopicQuery } from './getOneTopic.query';
import {
  InternalServerError,
  NoContent,
} from 'src/Common/translate/Error.Translate';
import { HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { topicsEntity } from 'src/Domain/Entities/Topic.entities';
import { TopicService } from '../../topic.service';
import { IsNull, Repository } from 'typeorm';
import e from 'express';

@QueryHandler(GetOneTopicQuery)
export class GetOneTopicQueryHandler
  implements ICommandHandler<GetOneTopicQuery>
{
  constructor(
    @InjectRepository(topicsEntity)
    private readonly topicRpository: Repository<topicsEntity>,
    private readonly topicservice: TopicService,
  ) {}
  async execute(command: GetOneTopicQuery): Promise<any> {
    const { id_topic, system_name, system_password } = command;

    try {
      const existingSystem = await this.topicservice.findSystem(
        system_name,
        system_password,
      );
      if (existingSystem) {
        const existingTopic = await this.topicRpository.findOne({
          where: {
            id: id_topic,
            system: existingSystem,
            deletedAt: IsNull(),
          },
        });
        if (existingTopic) {
          return existingTopic;
        } else {
          const NoContentErr = NoContent(
            'درخواست حاوی پاسخ نمیباشد',
            'The response is empty ',
          );
          throw new HttpException(NoContentErr, NoContentErr.status_code);
        }
      }
    } catch (error) {
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else throw error;
    }
  }
}
