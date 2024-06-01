import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { saveTokensCommand } from './saveToken.command';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity } from 'src/Domain/Entities/Registered-Devices.entity';
import { In, IsNull, Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import {
  InternalServerError,
  Token_Already_Exists,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { Request_Was_Successful } from 'src/Common/translate/Successful.Translate';
import { System } from 'src/Domain/Entities/System.entity';
import { TokenService } from '../token.service';

@CommandHandler(saveTokensCommand)
export class saveTokensCommandHandler
  implements ICommandHandler<saveTokensCommand>
{
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private readonly tokenservice: TokenService,
  ) {}
  async execute(command: saveTokensCommand): Promise<any> {
    const { tokens, system_name, system_password } = command;

    try {
      const existingSystem = await this.tokenservice.findSystem(
        system_name,
        system_password,
      );

      if (existingSystem) {
        const existingDevices = await this.deviceRepository.find({
          where: {
            token_Device: In(tokens.map((tokenData) => tokenData.token)),
            system: existingSystem,
          },
        });
        const existingTokens = new Set(
          existingDevices.map((device) => device.token_Device),
        );
        const newDevices = tokens
          .filter((tokenData) => !existingTokens.has(tokenData.token))
          .map((tokenData) => {
            const device = new DeviceEntity();
            device.token_Device = tokenData.token;
            device.platform = tokenData.platform;
            device.system = existingSystem;
            return device;
          });
        if (newDevices.length < tokens.length) {
          throw new HttpException(
            Token_Already_Exists,
            Token_Already_Exists.status_code,
          );
        }
        if (newDevices.length > 0) {
          await this.deviceRepository.save(newDevices);
          throw new HttpException(
            Request_Was_Successful,
            Request_Was_Successful.status_code,
          );
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
