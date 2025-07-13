import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { saveTokensCommand } from './saveToken.command';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import {
  InternalServerError,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { DeviceEntity } from 'src/domains/Entities/Registered-Devices.entity';
import { TokenService } from '../../token.service';
import { SubscriptionCommand } from 'src/domains/Topic/commands/Subescribe/subescribe.command';

@CommandHandler(saveTokensCommand)
export class saveTokensCommandHandler
  implements ICommandHandler<saveTokensCommand>
{
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private readonly tokenservice: TokenService,
    private readonly commandBus: CommandBus,
  ) {}
  async execute(command: saveTokensCommand): Promise<any> {
    const { tokens, system_name, system_password, topic_name, req } = command;
    try {
      const existingSystem = await this.tokenservice.findSystem(
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
          device.userId = tokenData.userId;
          device.system = existingSystem;
          return device;
        });
      let allDevices: DeviceEntity[] = [...existingDevices];

      if (newDevices.length > 0) {
        const saved = await this.deviceRepository.save(newDevices);
        allDevices = [...allDevices, ...saved];
      }

      if (topic_name) {
        await this.commandBus.execute(
          new SubscriptionCommand(
            allDevices.map((d) => d.token_Device),
            topic_name,
            system_name,
            system_password,
            req,
          ),
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const sanitized = allDevices.map(({ system, ...d }) => d);
      return sanitized;
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
