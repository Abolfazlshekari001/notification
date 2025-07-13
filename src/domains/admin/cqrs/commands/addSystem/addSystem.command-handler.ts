import { HttpException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  InternalServerError,
  Invalid_Input,
} from 'src/Common/translate/Error.Translate';
import { AddSystemCommandCommand } from './addSystem.command';
import { AdminService } from 'src/domains/admin/admin.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { System } from 'src/domains/Entities/System.entity';
import { addTopicCommand } from 'src/domains/Topic/commands/AddTopic/AddTopic.command';

@CommandHandler(AddSystemCommandCommand)
export class AddSystemCommandCommandHandler
  implements ICommandHandler<AddSystemCommandCommand>
{
  constructor(
    private readonly adminService: AdminService,
    @InjectRepository(System)
    private readonly SystemRpository: Repository<System>,
    private readonly commandBus: CommandBus,
  ) {}
  async execute(command: AddSystemCommandCommand): Promise<any> {
    const {
      systemName,
      systemPassword,
      topic_name,
      decriptions_topic,
      firebaseServiceAccountPath,
    } = command.body;
    try {
      const _system = await this.adminService.findSystem(
        systemName,
        systemPassword,
      );
      if (_system) {
        const err = Invalid_Input(
          'این سامانه قبلاً ثبت شده است.',
          'This system is already registered.',
        );
        throw new HttpException(err, err.status_code);
      }
      const system = new System();
      system.systemName = systemName;
      system.systemPassword = systemPassword;
      system.firebaseServiceAccountPath = firebaseServiceAccountPath;
      const result = await this.SystemRpository.save(system);
      const topic = await this.commandBus.execute(
        new addTopicCommand(
          topic_name,
          decriptions_topic,
          systemName,
          systemPassword,
        ),
      );
      delete result['id'];
      return {
        ...system,
        topicName: topic.topicName,
        descriptionsTopic: topic.descriptions ? topic.descriptions : null,
      };
    } catch (error) {
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else throw error;
    }
  }
}
