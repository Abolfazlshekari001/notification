import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { Request_Was_Successful } from 'src/Common/translate/Successful.Translate';
import { deleteTopicCommand } from './deleteTopic.command';
import { InjectRepository } from '@nestjs/typeorm';
import { topicsEntity } from 'src/Domain/Entities/Topic.entities';
import { IsNull, Repository } from 'typeorm';
import { TopicService } from '../topic.service';

@CommandHandler(deleteTopicCommand)
export class deleteTopicCommandHandler
  implements ICommandHandler<deleteTopicCommand>
{
  constructor(
    @InjectRepository(topicsEntity)
    private readonly topicRpository: Repository<topicsEntity>,
    private readonly topicservice: TopicService,
  ) {}
  async execute(command: deleteTopicCommand): Promise<any> {
    const { id_topic, system_name, system_password } = command;
    try {
        //todo transaction for sub 
      const existingSystem = await this.topicservice.findSystem(
        system_name,
        system_password,
      );
      if (existingSystem) {
        const result = await this.topicRpository.findOne({
          where: {
            id: id_topic,
            system: existingSystem,
            deletedAt: IsNull(),
          },
        });
        if (result) {
          result.deletedAt = new Date();
          await this.topicRpository.save(result);
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
