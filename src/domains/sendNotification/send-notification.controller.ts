import { Body, Controller, Post, Req } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  SendNotificationDto,
  SendNotificationResponseDto,
} from './dto/sendNotification.dto';
import { sendForMultipleDeviceCommand } from './commands/SendMultipleForDevice/SendMultipleForDevice.command';
import { SendDataCommand } from './commands/SendDataForNotification/SendData.command';
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendToMultipleTopicsCommand } from './commands/SendForMultiple/sendForMultiple.command';
import { sendForOnePersonCommand } from './commands/sendForOnePerson/SendForOnePerson.command';
import { sendForMultipleUserCommand } from './commands/sendforMultiUser/sendforMultiUser.command';
import { SendUsersDto } from './dto/sendUser.dto';

@Controller('notification/sendNotification')
@ApiTags('sendNotification')
export class SendNotificationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Post('sendForOnePerson')
  @ApiOperation({
    summary: 'this api will send to one person',
    description: 'this api send pushNotification for one device ',
  })
  @ApiBody({
    type: SendNotificationDto,
    examples: {
      example1: {
        value: {
          title: 'salam',
          message: 'test shomareh 33',
          token:
            'cansAD9BVs_FnkE1MOLrgC:APA91bENP_bevyC5kRhETr4c473qNxYF8kCLsCshnBsH_wzKHsq3keGiTvKg5vX3zpKE4IWlG1_wrWWrNm3DcqfoX9jj-9J3Dq2mKWX11Mtt886_ceTzIhhWcv_53MrvjlTIz40Y9xzd',
          system_name: 'simorgh',
          system_password: '1234',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: SendNotificationResponseDto })
  @ApiResponse({ status: 409, description: 'The response is empty' })
  @ApiResponse({ status: 401, description: 'The system is invalid' })
  async sendOne(
    @Req() req,
    @Body() body: SendNotificationDto,
  ): Promise<SendNotificationResponseDto> {
    const result = await this.commandBus.execute(
      new sendForOnePersonCommand(req, body),
    );
    return result as SendNotificationResponseDto;
  }
  @Post('sendForMultiple')
  @ApiOperation({
    summary: 'this api will send to Multiple',
    description: 'this api send pushNotification for Multiple topic ',
  })
  @ApiBody({
    type: SendNotificationDto,
    examples: {
      example1: {
        value: {
          title: 'salam',
          message: 'test shomareh 33',
          topics: ['test1', 'test2'],
          system_name: 'simorgh',
          system_password: '1234',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: SendNotificationResponseDto })
  @ApiResponse({ status: 409, description: 'The response is empty' })
  @ApiResponse({ status: 401, description: 'The system is invalid' })
  async sendMultiple(
    @Req() req,
    @Body() body: SendNotificationDto,
  ): Promise<SendNotificationResponseDto> {
    const result = await this.commandBus.execute(
      new SendToMultipleTopicsCommand(req, body),
    );
    return result as SendNotificationResponseDto;
  }
  @Post('sendForMultipleDevice')
  @ApiOperation({
    summary: 'this api will send to Multiple2',
    description: 'this api send pushNotification for Multiple device ',
  })
  @ApiBody({
    type: SendNotificationDto,
    examples: {
      example1: {
        value: {
          title: 'salam',
          message: 'test shomareh 33',
          tokens: [
            'cansAD9BVs_FnkE1MOLrgC:APA91bENP_bevyC5kRhETr4c473qNxYF8kCLsCshnBsH_wzKHsq3keGiTvKg5vX3zpKE4IWlG1_wrWWrNm3DcqfoX9jj-9J3Dq2mKWX11Mtt886_ceTzIhhWcv_53MrvjlTIz40Y9xzd',
            'dN-gZm7_CtUVHU3VqsSt0O:APA91bFAIExbkBWhOgiBryq42WSJ5IrgG9xJimZjAyjWHrwfgluBcKZHY_2T3UP9bZrEQT0GnyJwN68zV3FymkmdNr-Auk93NhnV_OGTi_7oROlI40YmBILLjr_e9_7AmQdW5wje7bUR',
          ],
          system_name: 'simorgh',
          system_password: '1234',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: SendNotificationResponseDto })
  @ApiResponse({ status: 409, description: 'The response is empty' })
  @ApiResponse({ status: 401, description: 'The system is invalid' })
  async sendMultipleDevice(
    @Req() req,
    @Body() body: SendNotificationDto,
  ): Promise<SendNotificationResponseDto> {
    const result = await this.commandBus.execute(
      new sendForMultipleDeviceCommand(req, body),
    );
    return result as SendNotificationResponseDto;
  }
  @Post('sendData')
  @ApiOperation({
    summary: 'this api will send to dataCustom',
    description: 'this api send dataCustom for messageNotifications',
  })
  @ApiBody({
    type: SendNotificationDto,
    examples: {
      example1: {
        value: {
          token:
            'cansAD9BVs_FnkE1MOLrgC:APA91bENP_bevyC5kRhETr4c473qNxYF8kCLsCshnBsH_wzKHsq3keGiTvKg5vX3zpKE4IWlG1_wrWWrNm3DcqfoX9jj-9J3Dq2mKWX11Mtt886_ceTzIhhWcv_53MrvjlTIz40Y9xzd',
          data: {
            type: 'new_message',
            timeToLive: '60',
          },
          system_name: 'simorgh',
          system_password: '1234',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: SendNotificationResponseDto })
  @ApiResponse({ status: 409, description: 'The response is empty' })
  @ApiResponse({ status: 401, description: 'The system is invalid' })
  async sendData(
    @Req() req,
    @Body() body: SendNotificationDto,
    @Body('data') data: any,
  ): Promise<SendNotificationResponseDto> {
    const result = await this.commandBus.execute(
      new SendDataCommand(req, body, data),
    );
    return result as SendNotificationResponseDto;
  }

  @Post('send-multiple/users')
  @ApiBody({
    type: SendNotificationDto,
    examples: {
      example1: {
        value: {
          title: 'salam',
          message: 'test shomareh 33',
          userIds: ['user1-uuid', 'user2-uuid'],
          system_name: 'simorgh',
          system_password: '1234',
        },
      },
    },
  })
  async sendNotificationToMultipleUsers(
    @Req() req,
    @Body() body: SendUsersDto,
  ): Promise<any> {
    const command = new sendForMultipleUserCommand(req, body);
    return await this.commandBus.execute(command);
  }
}
