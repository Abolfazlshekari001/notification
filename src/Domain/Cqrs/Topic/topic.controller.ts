import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TopicService } from './topic.service';
import { topicDto, topicResponseDto } from '../Dto/Topic.dto';
import { addTopicCommand } from './AddTopic/AddTopic.command';
import { deleteTopicCommand } from './DeleteTopic/deleteTopic.command';
import { updateTopicCommand } from './UpdateTopic/updateTopic.command';
import { GetAllTopicQuery } from './queries/GetAllTopic/getAllTopic.query';
import { SubscriptionCommand } from './Subescribe/subescribe.command';
import {
  SubscriptionDto,
  SubscriptionResponseDto,
} from '../Dto/subescribe.dto';
import { unSubscriptionCommand } from './UnSubescribe/unSubescribe.command';
import {
  sendNotificationResponseDto,
  sendNotificationTopicDto,
} from '../Dto/sendForTopic.dto';
import { sendNotificationTopicCommand } from './SendNotificationsTopic.ts/notification-topic.command';
import { GetOneTopicQuery } from './queries/GetOneTopic/getOneTopic.query';
import { GetAllSubForTopicQuery } from './queries/GetAllSubForOneTopic/getAllSubForOneTopic.query';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
@Controller('topic')
export class TopicController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly TopicService: TopicService,
  ) {}
  @Post('addTopic')
  @ApiOperation({
    summary: 'this api will Add topic',
    description: 'this api Add topic And save to database',
  })
  @ApiBody({
    type: topicDto,
    examples: {
      example1: {
        value: {
          topic_name: 'khabari',
          decriptions_topic: 'The latest news',
          system_name: 'simorgh',
          system_password: '1234',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: topicResponseDto })
  @ApiResponse({ status: 409, description: 'The response is empty' })
  @ApiResponse({ status: 401, description: 'The system is invalid' })
  async add(@Body() body: topicDto, @Req() req): Promise<topicResponseDto> {
    const result = await this.commandBus.execute(
      new addTopicCommand(body, req),
    );
    return result as topicResponseDto;
  }

  @Delete('DeleteTopic/:id_topic')
  @ApiOperation({
    summary: 'this api will deleted topic',
    description: 'this api deleted topic And Logical Deleted to database',
  })
  @ApiParam({
    name: 'id_topic',
    description:
      'Here,the topic ID is entered in the parameters for DeleteTopic ',
    type: 'string',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e ',
  })
  @ApiBody({
    type: topicDto,
    examples: {
      example1: {
        value: {
          system_name: 'simorgh',
          system_password: '1234',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: topicResponseDto })
  @ApiResponse({ status: 409, description: 'The response is empty' })
  @ApiResponse({ status: 401, description: 'The system is invalid' })
  async delete(
    @Body() body: topicDto,
    @Req() req,
    @Param('id_topic') id_topic: string,
  ): Promise<topicResponseDto> {
    const result = await this.commandBus.execute(
      new deleteTopicCommand(body, req, id_topic),
    );
    return result as topicResponseDto;
  }
  @Put('updateTopic/:id_topic')
  @ApiOperation({
    summary: 'this api will Update topic',
    description: 'this api Update topic And update to database',
  })
  @ApiParam({
    name: 'id_topic',
    description:
      'Here,the topic ID is entered in the parameters for updateTopic ',
    type: 'string',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e ',
  })
  @ApiBody({
    type: topicDto,
    examples: {
      example1: {
        value: {
          topic_name: 'test3',
          decriptions_topic: 'The latest news and sport news',
          system_name: 'simorgh',
          system_password: '1234',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: topicResponseDto })
  @ApiResponse({ status: 409, description: 'The response is empty' })
  @ApiResponse({ status: 401, description: 'The system is invalid' })
  async update(
    @Body() body: topicDto,
    @Req() req,
    @Param('id_topic') id_topic: string,
  ): Promise<topicResponseDto> {
    const result = await this.commandBus.execute(
      new updateTopicCommand(body, req, id_topic),
    );
    return result as topicResponseDto;
  }
  @Get('getOneTopic/:id_topic')
  @ApiParam({
    name: 'id_topic',
    description:
      'Here,the topic ID is entered in the parameters for getOneTopic ',
    type: 'string',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e ',
  })
  @ApiOperation({
    summary: 'this api will get one topic',
    description: 'this api get one topic for system',
    responses: {
      200: {
        description: 'Successful operation',
        content: {
          'text/plain': {
            schema: {
              type: 'string',
              examples: {
                id: '0ca7ef62-8ed6-4743-b9ba-4a8aa35a3d31',
                topicName: 'khabari',
                descriptions: 'The latest news',
                countSubescribe: 1,
                deletedAt: null,
                created_at: '2024-04-20T01:34:55.487Z',
                updated_at: '2024-04-20T01:35:39.030Z',
              },
            },
          },
        },
      },
      401: {
        description: 'Unauthorized',
      },
    },
  })
  @ApiResponse({ status: 200, type: topicResponseDto })
  @ApiResponse({ status: 409, description: 'The response is empty' })
  @ApiResponse({ status: 401, description: 'The system is invalid' })
  async getOne(
    @Req() req,
    @Param('id_topic') id_topic: string,
    @Query('system_name') system_name: string,
    @Query('system_password') system_password: string,
  ): Promise<topicResponseDto> {
    const result = await this.queryBus.execute(
      new GetOneTopicQuery(req, id_topic, system_name, system_password),
    );
    return result as topicResponseDto;
  }
  @Get('getAllTopic')
  @ApiOperation({
    summary: 'this api will get All topic',
    description: 'this api get All topic for system',
    responses: {
      200: {
        description: 'Successful operation',
        content: {
          'text/plain': {
            schema: {
              type: 'string',
              examples: {
                id: '0ca7ef62-8ed6-4743-b9ba-4a8aa35a3d31',
                topicName: 'khabari',
                descriptions: 'The latest news',
                countSubescribe: 1,
                deletedAt: null,
                created_at: '2024-04-20T01:34:55.487Z',
                updated_at: '2024-04-20T01:35:39.030Z',
              },
              example: {
                id: 'ads2344-8ed6-4743-b9ba-4a8aa35a3d31',
                topicName: 'sport',
                descriptions: 'The latest news for sport',
                countSubescribe: 4,
                deletedAt: null,
                created_at: '2024-04-20T01:34:55.487Z',
                updated_at: '2024-04-20T01:35:39.030Z',
              },
            },
          },
        },
      },
      401: {
        description: 'Unauthorized',
      },
    },
  })
  @ApiResponse({ status: 200, type: topicResponseDto })
  @ApiResponse({ status: 409, description: 'The response is empty' })
  @ApiResponse({ status: 401, description: 'The system is invalid' })
  async getAll(
    @Req() req,
    @Query('system_name') system_name: string,
    @Query('system_password') system_password: string,
  ): Promise<topicResponseDto> {
    const result = await this.queryBus.execute(
      new GetAllTopicQuery(req, system_name, system_password),
    );
    return result as topicResponseDto;
  }
  @Post('subescribe')
  @ApiOperation({
    summary: 'this api will subescribe to topic',
    description: 'this api is subescribe token to topic And save to database',
  })
  @ApiBody({
    type: SubscriptionDto,
    examples: {
      example1: {
        value: {
          topic_name: 'khabari',
          tokens: [
            'cansAD9BVs_FnkE1MOLrgC:APA91bGXa67LCj_adxFvS9G7pO-NGNNt8FQTkLoxekxUn_qYQqCoKbZSLV8lM2g85j5XOVeQB010pt5jzMPlg2uAO1nqCyvqpyzNvNgQI25qTD7_Y0W3ju3dEvMrrrrrrrrrrrrrrrrrrrr',
            'cansAD9BVs_FnkE1MOLrgC:APA91bENP_bevyC5kRhETr4c473qNxYF8kCLsCshnBsH_wzKHsq3keGiTvKg5vX3zpKE4IWlG1_wrWWrNm3DcqfoX9jj-9J3Dq2mKWX11Mtt886_ceTzIhhWcv_53MrvjlTIz40Y9xzd',
          ],
          system_name: 'simorgh',
          system_password: '1234',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: SubscriptionResponseDto })
  @ApiResponse({ status: 409, description: 'The response is empty' })
  @ApiResponse({ status: 401, description: 'The system is invalid' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  async subescribe(
    @Req() req,
    @Body() body: SubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    const result = await this.commandBus.execute(
      new SubscriptionCommand(body, req),
    );
    return result as SubscriptionResponseDto;
  }
  @Post('unSubescribe/:ids_sub')
  @ApiOperation({
    summary: 'this api will Unsubscribe to topic',
    description: 'this api is Unsubscribe token to topic And save to database',
  })
  @ApiParam({
    name: 'ids_sub',
    description:
      'Here,the topic ID is entered in the parameters for unSubescribe ',
    type: 'string',
    example: [
      'ade65d4f-0611-4f9e-98c9-a849936d2d5e ',
      's34sd342-0611-4f9e-98c9-a849936d276e',
    ],
  })
  @ApiBody({
    type: SubscriptionDto,
    examples: {
      example1: {
        value: {
          topic_name: 'khabari',
          tokens: [
            'cansAD9BVs_FnkE1MOLrgC:APA91bGXa67LCj_adxFvS9G7pO-NGNNt8FQTkLoxekxUn_qYQqCoKbZSLV8lM2g85j5XOVeQB010pt5jzMPlg2uAO1nqCyvqpyzNvNgQI25qTD7_Y0W3ju3dEvMrrrrrrrrrrrrrrrrrrrr',
            'cansAD9BVs_FnkE1MOLrgC:APA91bENP_bevyC5kRhETr4c473qNxYF8kCLsCshnBsH_wzKHsq3keGiTvKg5vX3zpKE4IWlG1_wrWWrNm3DcqfoX9jj-9J3Dq2mKWX11Mtt886_ceTzIhhWcv_53MrvjlTIz40Y9xzd',
          ],
          system_name: 'simorgh',
          system_password: '1234',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: SubscriptionResponseDto })
  @ApiResponse({ status: 409, description: 'The response is empty' })
  @ApiResponse({ status: 401, description: 'The system is invalid' })
  async unSubescribe(
    @Req() req,
    @Body() body: SubscriptionDto,
    @Param('ids_sub') ids_sub: string,
  ): Promise<SubscriptionResponseDto> {
    const ids = ids_sub.split(',');
    const result = await this.commandBus.execute(
      new unSubscriptionCommand(body, req, ids),
    );
    return result as SubscriptionResponseDto;
  }
  @Get('getAllSubFotTopic')
  @ApiOperation({
    summary: 'Get all subscriptions for a topic',
    description: 'This API retrieves all subscriptions for a specified topic',
  })
  @ApiBody({
    type: topicDto,
    examples: {
      example1: {
        value: {
          topic_name: 'khabari',
          system_name: 'simorgh',
          system_password: '1234',
        },
      },
    },
  })
  @ApiResponse({ status: 200, type: topicResponseDto })
  @ApiResponse({ status: 409, description: 'The response is empty' })
  @ApiResponse({ status: 401, description: 'The system is invalid' })
  async getAllSubFotTopic(
    @Req() req,
    @Body() body: topicDto,
  ): Promise<topicResponseDto> {
    const result = await this.queryBus.execute(
      new GetAllSubForTopicQuery(req, body),
    );
    return result as topicResponseDto;
  }
  @Post('sendNotification')
  @ApiOperation({
    summary: 'Send notification to topic',
    description:
      'This API sends a notification to all subscribers of a specified topic',
  })
  @ApiBody({
    type: sendNotificationTopicDto,
    examples: {
      example1: {
        value: {
          title: 'salam',
          message: 'test3333',
          topic_name: 'khabari',
          system_name: 'simorgh',
          system_password: '1234',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: sendNotificationResponseDto })
  @ApiResponse({ status: 409, description: 'The response is empty' })
  @ApiResponse({ status: 401, description: 'The system is invalid' })
  async send(
    @Req() req,
    @Body() body: sendNotificationTopicDto,
  ): Promise<sendNotificationResponseDto> {
    const result = await this.commandBus.execute(
      new sendNotificationTopicCommand(req, body),
    );
    return result as sendNotificationResponseDto;
  }
}
