import { HttpException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import {
  Unauthorized,
  InternalServerError,
} from 'src/Common/translate/Error.Translate';
import { TokenService } from '../../token.service';
import { GetATokenUserQuery } from './getTokenUser.query';

@QueryHandler(GetATokenUserQuery)
export class GetATokenUserQueryHandler
  implements IQueryHandler<GetATokenUserQuery>
{
  GetATokenUserQuery;
  constructor(private readonly tokenservice: TokenService) {}
  async execute(query: GetATokenUserQuery): Promise<any> {
    try {
      const { system_name, system_password, userId } = query;
      const existingSystem = await this.tokenservice.findSystem(
        system_name,
        system_password,
      );

      if (existingSystem) {
        const token = await this.tokenservice.findTokenUser(
          userId,
          system_name,
          system_password,
        );
        return token;
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
