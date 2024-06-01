import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { updateTokenCommand } from './updateToken.command';
import { DeviceEntity } from 'src/Domain/Entities/Registered-Devices.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { TokenService } from '../token.service';
import { Request_Was_Successful } from 'src/Common/translate/Successful.Translate';
import { HttpException } from '@nestjs/common';
import {
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';

@CommandHandler(updateTokenCommand)
export class updateTokensCommandHandler
  implements ICommandHandler<updateTokenCommand>
{
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private readonly tokenService: TokenService,
  ) {}
  async execute(command: updateTokenCommand): Promise<any> {
    const { id_token, system_name, system_password } = command;
    const { token, platform } = command.req;
    try {
      const existingSystem = await this.tokenService.findSystem(
        system_name,
        system_password,
      );
      if (existingSystem) {
        const result = await this.deviceRepository.findOne({
          where: {
            id: id_token,
            system:existingSystem,
            deletedAt: IsNull(),
          },
        });
        if (result) {
          result.token_Device = token;
          result.platform = platform;
          await this.deviceRepository.save(result);
          throw new HttpException(
            Request_Was_Successful,
            Request_Was_Successful.status_code,
          );
        } else {
          const NoContentErr = NoContent(
            'درخواست حاوی پاسخ نمیباشد',
            'The response is empty',
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
