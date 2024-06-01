import { InjectRepository } from '@nestjs/typeorm';
import { topicsEntity } from 'src/Domain/Entities/Topic.entities';
import { TopicService } from '../../topic.service';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import {
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllSubForTopicQuery } from './getAllSubForOneTopic.query';

@QueryHandler(GetAllSubForTopicQuery)
export class GetAllSubForTopicQueryHandler
  implements IQueryHandler<GetAllSubForTopicQuery>
{

  constructor(

    private readonly topicservice: TopicService,
  ) {}
  async execute(query: GetAllSubForTopicQuery): Promise<any> {
    try {
      const { system_name, system_password, topic_name } = query;

      const result =
        await this.topicservice.getTopicSubscriptionsWithDeviceDetails(
          topic_name,
          system_name,
          system_password,
        );
      if (result.length != 0) {
        return result;
      } else {
        const NoContentErr = NoContent(
          'درخواست حاوی پاسخ نمیباشد',
          'The response is empty ',
        );
        throw new HttpException(NoContentErr, NoContentErr.status_code);
      }
    } catch (error) {
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else throw error;
    }
  }
}
