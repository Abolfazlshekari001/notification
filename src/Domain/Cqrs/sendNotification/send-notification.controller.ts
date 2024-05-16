import { Body, Controller, Post, Req } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { sendForOnePersonCommand } from './sendForOnePerson/SendForOnePerson.command';
import { SendNotificationDto, SendNotificationResponseDto } from '../Dto/sendNotification.dto';
import { SendToMultipleTopicsCommand } from './SendForMultiple/sendForMultiple.command';

@Controller('sendNotification')
export class SendNotificationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('sendForOnePerson')
  async sendOne(@Req() req, @Body() body: SendNotificationDto): Promise<SendNotificationResponseDto> {
    const result = await this.commandBus.execute(
      new sendForOnePersonCommand(req,body),
    );
    return result as SendNotificationResponseDto;
  }

  @Post('sendForMultiple')
  async sendMultiple(@Req() req, @Body() body: SendNotificationDto): Promise<SendNotificationResponseDto> {
    const result = await this.commandBus.execute(
      new SendToMultipleTopicsCommand(req,body),
    );
    return result as SendNotificationResponseDto;
  }
}
