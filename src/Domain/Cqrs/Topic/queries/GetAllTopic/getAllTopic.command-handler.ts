import { InjectRepository } from "@nestjs/typeorm";
import { GetAllTopicQuery } from "./getAllTopic.command";
import { topicsEntity } from "src/Domain/Entities/Topic.entities";
import { TopicService } from "../../topic.service";
import { IsNull, Repository } from "typeorm";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InternalServerError, NoContent, Unauthorized } from "src/Common/translate/Error.Translate";
import { HttpException } from "@nestjs/common";

@QueryHandler(GetAllTopicQuery)
export class GetAllTopicQueryHandler
  implements IQueryHandler<GetAllTopicQuery>
{
  constructor(
    @InjectRepository(topicsEntity)
    private readonly topicRpository: Repository<topicsEntity>,
    private readonly topicservice: TopicService,
  ) {}
  async execute(query: GetAllTopicQuery): Promise<any> {
    try {
      const { system_name, system_password } = query;
      const existingSystem = await this.topicservice.findSystem(
        system_name,
        system_password,
      );

      if (existingSystem) {
        let { limit, offset } = query.req.query;
        limit = limit ? limit : 3;
        offset = offset ? offset : 0;
        const AllTopic = await this.topicRpository.find({
          take: limit,
          skip: offset,
          where: {
            system: existingSystem,
            deletedAt: IsNull(),
          },
        });
        if (AllTopic.length != 0) {
          return AllTopic;
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
      } else throw error;
    }
  }
}
