import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { deleteTopicCommand } from './deleteTopic.command';
import { Connection } from 'typeorm';
import { TopicService } from '../../topic.service';

@CommandHandler(deleteTopicCommand)
export class deleteTopicCommandHandler
  implements ICommandHandler<deleteTopicCommand>
{
  constructor(
    private readonly topicservice: TopicService,
    private readonly connection: Connection,
  ) {}
  async execute(command: deleteTopicCommand): Promise<any> {
    const { id_topic, system_name, system_password } = command;
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
      const topic = await this.topicservice.findOneTopicById(
        id_topic,
        system_name,
        system_password,
      );
      if (!topic) {
        const NoContenttErr = NoContent(
          'درخواست حاوی پاسخ نمیباشد',
          'The response is empty ',
        );
        throw new HttpException(NoContenttErr, NoContenttErr.status_code);
      }
      const queryRunner = this.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        topic.deletedAt = new Date();
        await queryRunner.manager.save(topic);
        for (const subscribe of topic.subscribe) {
          subscribe.unSubscribed_date = new Date();
          await queryRunner.manager.save(subscribe);
        }
        await queryRunner.commitTransaction();
        return { topicId: id_topic };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
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
