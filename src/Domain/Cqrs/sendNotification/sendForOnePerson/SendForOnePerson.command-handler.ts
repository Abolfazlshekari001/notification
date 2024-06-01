import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { sendForOnePersonCommand } from './SendForOnePerson.command';
import { SendNotificationService } from '../send-notification.service';
import {
  DataNotFound2,
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { HttpException } from '@nestjs/common';
import { FirebaseService } from 'src/Configs/fireBase/firebase.service';
import { Request_Was_Successful } from 'src/Common/translate/Successful.Translate';
import { DeviceEntity } from 'src/Domain/Entities/Registered-Devices.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

@CommandHandler(sendForOnePersonCommand)
export class sendForOnePersonCommandHandler
  implements ICommandHandler<sendForOnePersonCommand>
{
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private firebaseMessaging: FirebaseService,
    private readonly notificationService: SendNotificationService,
  ) {}
  async execute(command: sendForOnePersonCommand): Promise<any> {
    const { title, message, token, system_name, system_password } = command;
    try {
      const existingSystem = await this.notificationService.findSystem(
        system_name,
        system_password,
      );
      if (existingSystem) {
        const existingToken = await this.deviceRepository.findOne({
          where: {
            token_Device: token,
            system: existingSystem,
            MuteNotification: false,
            deletedAt: IsNull(),
          },
        });
        if (existingToken) {
          const payload = {
            notification: {
              title: title,
              body: message,
            },
          };
          const res = await this.firebaseMessaging.sendNotification(
            token,
            payload,
          );
          
          if (res) {
            throw new HttpException(
              Request_Was_Successful,
              Request_Was_Successful.status_code,
            );
          } else {
            throw new HttpException(DataNotFound2, DataNotFound2.status_code);
          }
        } else {
          const NoContentErr = NoContent(
            'درخواست حاوی پاسخ نمیباشد',
            'The response is empty ',
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
      console.error('Error sending message:', error);
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else throw error;
    }
  }
}
