import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import {
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { deleteTokensCommand } from './deleteToken.command';
import { TokenService } from '../../token.service';
import { DeviceEntity } from 'src/domains/Entities/Registered-Devices.entity';

@CommandHandler(deleteTokensCommand)
export class deleteTokensCommandHandler
  implements ICommandHandler<deleteTokensCommand>
{
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private readonly tokenService: TokenService,
  ) {}
  async execute(command: deleteTokensCommand): Promise<any> {
    const { id_token, system_name, system_password } = command;
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
      const token = await this.tokenService.findOneToken(
        id_token,
        system_name,
        system_password,
      );
      if (!token) {
        const NoContentErr = NoContent(
          'درخواست حاوی پاسخ نمیباشد',
          'The response is empty ',
        );
        throw new HttpException(NoContentErr, NoContentErr.status_code);
      }
      token.deletedAt = new Date();
      await this.deviceRepository.save(token);
      return {
        tokenId: id_token,
        message: 'The token has been successfully deleted.',
      };
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
