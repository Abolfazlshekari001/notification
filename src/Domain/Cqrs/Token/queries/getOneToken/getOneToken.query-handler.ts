import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetOneTokenQuery } from "./getOneToken.query";
import { InjectRepository } from "@nestjs/typeorm";
import { DeviceEntity } from "src/Domain/Entities/Registered-Devices.entity";
import { System } from "src/Domain/Entities/System.entity";
import { IsNull, Repository } from "typeorm";
import { TokenService } from "../../token.service";
import { InternalServerError, NoContent, Unauthorized } from "src/Common/translate/Error.Translate";
import { HttpException } from "@nestjs/common";

@QueryHandler(GetOneTokenQuery)
export class GetOneTokenQueryHandler
  implements IQueryHandler<GetOneTokenQuery>
{
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRpository: Repository<DeviceEntity>,
    @InjectRepository(System)
    private readonly SystemRpository: Repository<System>,
    private readonly tokenservice: TokenService,
  ) {}
  async execute(query:GetOneTokenQuery ): Promise<any> {
    try {
      const { system_name, system_password,id_token } = query;
      const existingSystem = await this.tokenservice.findSystem(
        system_name,
        system_password,
      );

      if (existingSystem) {
        const OneToken = await this.deviceRpository.findOne({
          where: {
            id:id_token,
            systems: existingSystem,
            deletedAt: IsNull(),
          },
        });
        if (OneToken != null) {
            return OneToken;
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
