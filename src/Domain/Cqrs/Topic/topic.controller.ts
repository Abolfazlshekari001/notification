
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
  } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {TopicService } from'./topic.service'
import { topicDto, topicResponseDto } from '../Dto/Topic.dto';
import { addTopicCommand } from './AddTopic/AddTopic.command';
import { deleteTopicCommand } from './DeleteTopic/deleteTopic.command';
import { updateTopicCommand } from './UpdateTopic/updateTopic.command';
import { GetAllTopicQuery } from './queries/GetAllTopic/getAllTopic.command';
import { SubscriptionCommand } from './Subescribe/subescribe.command';
import { SubscriptionDto, SubscriptionResponseDto } from '../Dto/subescribe.dto';
import { unSubscriptionCommand } from './UnSubescribe/unSubescribe.command';
import { GetAllSubForTopicQuery } from './queries/GetAllSubForOneTopic/getAllSubForOneTopic.command-handler';
import { sendNotificationResponseDto, sendNotificationTopicDto } from '../Dto/sendForTopic.dto';
import { sendNotificationTopicCommand } from './SendNotificationsTopic.ts/notification-topic.command';
@Controller('topic')
export class TopicController {
constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly TopicService: TopicService,
){}

@Post('addTopic')
async add(@Body() body: topicDto, @Req() req): Promise<topicResponseDto> {
  const result = await this.commandBus.execute(
    new addTopicCommand(body, req),
  );
  return result as topicResponseDto;
}


@Post('subescribe')
async subescribe(@Req() req,
@Body() body: SubscriptionDto,
): Promise<SubscriptionResponseDto> {
  const result = await this.commandBus.execute(
    new SubscriptionCommand(body,req),
  );
  return result as SubscriptionResponseDto;
}

@Post('unSubescribe/:id_sub')
async unSubescribe(@Req() req,
@Body() body: SubscriptionDto,
@Param('id_sub') id_sub: string,
): Promise<SubscriptionResponseDto> {
  const result = await this.commandBus.execute(
    new unSubscriptionCommand(body,req,id_sub),
  );
  return result as SubscriptionResponseDto;
}


@Post('sendNotification')
async send(@Req() req,
@Body() body: sendNotificationTopicDto,
): Promise<sendNotificationResponseDto> {
  const result = await this.commandBus.execute(
    new sendNotificationTopicCommand(req,body),
  );
  return result as sendNotificationResponseDto;
}

@Delete('DeleteTopic/:id_topic')
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



@Get('getAllTopic')
async getAll(@Req() req,
@Body() body: topicDto,
): Promise<topicResponseDto> {
  const result = await this.queryBus.execute(
    new GetAllTopicQuery(req,body),
  );
  return result as topicResponseDto;
}


@Get('getAllSubFotTopic')
async getAllSubFotTopic(@Req() req,
@Body() body: topicDto,

): Promise<topicResponseDto> {
  const result = await this.queryBus.execute(
    new GetAllSubForTopicQuery(req,body),
  );
  return result as topicResponseDto;
}

}
