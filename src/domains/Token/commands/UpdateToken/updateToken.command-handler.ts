import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { updateTokenCommand } from './updateToken.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HttpException } from '@nestjs/common';
import {
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { DeviceEntity } from 'src/domains/Entities/Registered-Devices.entity';
import { TokenService } from '../../token.service';

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
      if (!existingSystem) {
        const unauthorizedErr = Unauthorized(
          'سیستم نامعتبر است',
          'The system is invalid',
        );
        throw new HttpException(unauthorizedErr, unauthorizedErr.status_code);
      }
      const _token = await this.tokenService.findOneToken(
        id_token,
        system_name,
        system_password,
      );
      if (!_token) {
        const NoContentErr = NoContent(
          'درخواست حاوی پاسخ نمیباشد',
          'The response is empty',
        );
        throw new HttpException(NoContentErr, NoContentErr.status_code);
      }
      _token.token_Device = token;
      _token.platform = platform;
      const result = await this.deviceRepository.save(_token);
      delete result['system'];
      return result;
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
