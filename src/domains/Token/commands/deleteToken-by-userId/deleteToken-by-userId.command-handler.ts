import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Unauthorized,
  NoContent,
  InternalServerError,
} from 'src/Common/translate/Error.Translate';
import { DeviceEntity } from 'src/domains/Entities/Registered-Devices.entity';
import { Repository } from 'typeorm';
import { TokenService } from '../../token.service';
import { DeleteTokensByUserIdCommand } from './deleteToken-by-userId.command';

@CommandHandler(DeleteTokensByUserIdCommand)
export class DeleteTokensByUserIdCommandHandler
  implements ICommandHandler<DeleteTokensByUserIdCommand>
{
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private readonly tokenService: TokenService,
  ) {}
  async execute(command: DeleteTokensByUserIdCommand): Promise<any> {
    const { userId, system_name, system_password } = command;
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
      const token = await this.tokenService.findTokenUser(
        userId,
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
      await this.deviceRepository.remove(token);
      return {
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
