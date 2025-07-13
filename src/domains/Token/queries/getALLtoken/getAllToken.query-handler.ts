import { HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InternalServerError,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { IsNull, Repository } from 'typeorm';
import { GetAllTokenQuery } from './getAllToken.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TokenService } from '../../token.service';
import { DeviceEntity } from 'src/domains/Entities/Registered-Devices.entity';
import { System } from 'src/domains/Entities/System.entity';

@QueryHandler(GetAllTokenQuery)
export class GetAllTokenQueryHandler
  implements IQueryHandler<GetAllTokenQuery>
{
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRpository: Repository<DeviceEntity>,
    @InjectRepository(System)
    private readonly SystemRpository: Repository<System>,
    private readonly tokenservice: TokenService,
  ) {}
  async execute(query: GetAllTokenQuery): Promise<any> {
    try {
      const { system_name, system_password } = query;

      const existingSystem = await this.tokenservice.findSystem(
        system_name,
        system_password,
      );
      if (existingSystem) {
        let { limit, offset } = query.req.query;
        limit = limit ? limit : 100;
        offset = offset ? offset : 0;
        const AllToken = await this.deviceRpository.find({
          take: limit,
          skip: offset,
          where: {
            system: existingSystem,
            deletedAt: IsNull(),
          },
        });
        if (AllToken.length != 0) {
          return AllToken;
        } else {
          return [];
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
