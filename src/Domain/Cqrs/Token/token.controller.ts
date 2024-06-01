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
import { TokenService } from './token.service';
import { saveTokensCommand } from './SaveToken/saveToken.command';
import { TokenDto, TokenResponseDto } from '../Dto/Token.dto';
import { deleteTokensCommand } from './DeletedToken/deleteToken.command';
import { GetAllTokenQuery } from './queries/getALLtoken/getAllToken.query';
import { GetOneTokenQuery } from './queries/getOneToken/getOneToken.query';
import { updateTokenCommand } from './UpdateToken/updateToken.command';
import { MuteNotificationCommand } from './settings/setting.command';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('token')
export class TokenController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly tokenService: TokenService,
  ) {}
  @ApiBearerAuth()
  @Post('TokenRegistration')
  @ApiOperation({
    summary: 'this api will Registration tokens',
    description: 'this api Registration and save  token to database ',
  })
  @ApiBody({
    type: TokenDto,
    examples: {
      example1: {
        value: {
          tokens: [
            {
              token:
                'dN-gZm7_CtUVHU3VqsSt0O:APA91bFAIExbkBWhOgiBryq42WSJ5IrgG9xJimZjAyjWHrwfgluBcKZHY_2T3UP9bZrEQT0GnyJwN68zV3FymkmdNr-Auk93NhnV_OGTi_7oROlI40YmBILLjr_e9_7AmQdW5wje7bUR',
              platform: 'windows',
            },
            {
              token:
                'cansAD9BVs_FnkE1MOLrgC:APA91bGXa67LCj_adxFvS9G7pO-NGNNt8FQTkLoxekxUn_qYQqCoKbZSLV8lM2g85j5XOVeQB010pt5jzMPlg2uAO1nqCyvqpyzNvNgQI25qTD7_Y0W3ju3dEvMe9fKRXoZZZZZ666ZZ32232a2322323ZZZZZ',
              platform: 'windows',
            },
          ],
          system_name: 'simorgh',
          system_password: '1234',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: TokenResponseDto })
  @ApiResponse({ status: 409, description: 'The response is empty' })
  @ApiResponse({ status: 401, description: 'The system is invalid' })
  async save(@Body() body: TokenDto, @Req() req): Promise<TokenResponseDto> {
    const result = await this.commandBus.execute(
      new saveTokensCommand(body, req),
    );
    return result as TokenResponseDto;
  }

  @Delete('DeleteToken/:id_token')
  @ApiOperation({
    summary: 'Delete a token by ID',
    description: 'This API endpoint deletes a token identified by its ID.',
  })
  @ApiParam({
    name: 'id_token',
    description: 'ID of the token to delete',
    type: 'string',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e',
  })
  @ApiBody({
    type: TokenDto,
    examples: {
      example1: {
        value: {
          system_name: 'simorgh',
          system_password: '1234',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Token deleted successfully',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Token not found',
  })
  @ApiResponse({ status: 201, type: TokenResponseDto })
  @ApiResponse({ status: 409, description: 'The response is empty' })
  @ApiResponse({ status: 401, description: 'The system is invalid' })
  async delete(
    @Body() body: TokenDto,
    @Req() req,
    @Param('id_token') id_token: string,
  ): Promise<TokenResponseDto> {
    const result = await this.commandBus.execute(
      new deleteTokensCommand(body, req, id_token),
    );
    return result as TokenResponseDto;
  }
  @Put('updateToken/:id_token')
  @ApiOperation({
    summary: 'Update a token by ID',
    description: 'This API endpoint updates a token identified by its ID.',
  })
  @ApiParam({
    name: 'id_token',
    description: 'ID of the token to update',
    type: 'string',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e',
  })
  @ApiResponse({
    status: 404,
    description: 'Token not found',
  })
  @ApiBody({
    type: TokenDto,
    examples: {
      example1: {
        value: {
          token:
            'fynSzRbkg4vdSYKrPhrMZl:APA91bGWFkWUHU8aoLCNIY755tffVpepswXSNo6_Izp2yGhQx-91b6HISPID2Illy9MhHxS2Fow713YVlQ66YpP3rUeFpkw4baba8ALyQJ0tGMailIxAA-pppppppppppppooppppp',
          platform: 'windows',
          system_name: 'simorgh',
          system_password: '1234',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: TokenResponseDto })
  @ApiResponse({ status: 409, description: 'The response is empty' })
  @ApiResponse({ status: 401, description: 'The system is invalid' })
  async update(
    @Req() req,
    @Body() body: TokenDto,
    @Param('id_token') id_token: string,
  ): Promise<TokenResponseDto> {
    const result = await this.commandBus.execute(
      new updateTokenCommand(req, body, id_token),
    );
    return result as TokenResponseDto;
  }

  @Put('muteNotification/:id_token')
  @ApiOperation({
    summary: 'Mute notification for a token',
    description:
      'This API endpoint mutes notification for a token identified by its ID.',
  })
  @ApiParam({
    name: 'id_token',
    description: 'ID of the token to mute notifications',
    type: 'string',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e',
  })
  @ApiResponse({
    status: 201,
    description: 'Notification muted successfully',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Token not found',
  })
  @ApiBody({
    type: TokenDto,
    examples: {
      example1: {
        value: {
          Mute: true,
          platform: 'windows',
          system_name: 'simorgh',
          system_password: '1234',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: TokenResponseDto })
  @ApiResponse({ status: 409, description: 'The response is empty' })
  @ApiResponse({ status: 401, description: 'The system is invalid' })
  async mute(
    @Req() req,
    @Body() body: TokenDto,
    @Param('id_token') id_token: string,
  ): Promise<TokenResponseDto> {
    const result = await this.commandBus.execute(
      new MuteNotificationCommand(req, body, id_token),
    );
    return result as TokenResponseDto;
  }
  @Get('getAllToken')
  @ApiOperation({
    summary: 'this api will get All tokens',
    description: 'this api get All tokens for system',
    responses: {
      200: {
        description: 'Successful operation',
        content: {
          'text/plain': {
            schema: {
              type: 'string',
              examples: {
                id: '0ca7ef62-8ed6-4743-b9ba-4a8aa35a3d31',
                token_Device:
                  'cansAD9BVs_FnkE1MOLrgC:APA91bGXa67LCj_adxFvS9G7pO-NGNNt8FQTkLoxekxUn_qYQqCoKbZSLV8lM2g85j5XOVeQB010pt5jzMPlg2uAO1nqCyvqpyzNvNgQI25qTD7_Y0W3ju3dEvMrrrrrrrrrrrrrrrrrrrr',
                platform: 'windows',
                MuteNotification: false,
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
  @ApiResponse({
    status: 404,
    description: 'No tokens found',
  })
  @ApiResponse({ status: 200, type: TokenResponseDto })
  @ApiResponse({ status: 401, description: 'The system is invalid' })
  async getAll(
    @Req() req,
    @Query('system_name') system_name: string,
    @Query('system_password') system_password: string,
  ): Promise<TokenResponseDto> {
    const result = await this.queryBus.execute(
      new GetAllTokenQuery(req, system_name, system_password),
    );
    return result as TokenResponseDto;
  }
  @Get('getOneToken/:id_token')
  @ApiParam({
    name: 'id_token',
    description:
      'Here, the token ID is entered in the parameters for getOneToken ',
    type: 'string',
    example: 'ade65d4f-0611-4f9e-98c9-a849936d2d5e ',
  })
  @ApiOperation({
    summary: 'this api will get one token',
    description: 'this api get one token for system',
    responses: {
      200: {
        description: 'Successful operation',
        content: {
          'text/plain': {
            schema: {
              type: 'string',
              examples: {
                id: '0ca7ef62-8ed6-4743-b9ba-4a8aa35a3d31',
                token_Device:
                  'cansAD9BVs_FnkE1MOLrgC:APA91bGXa67LCj_adxFvS9G7pO-NGNNt8FQTkLoxekxUn_qYQqCoKbZSLV8lM2g85j5XOVeQB010pt5jzMPlg2uAO1nqCyvqpyzNvNgQI25qTD7_Y0W3ju3dEvMrrrrrrrrrrrrrrrrrrrr',
                platform: 'windows',
                MuteNotification: false,
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
  @ApiResponse({ status: 200, type: TokenResponseDto })
  @ApiResponse({ status: 401, description: 'The system is invalid' })
  async getOne(
    @Req() req,
    @Param('id_token') id_token: string,
    @Query('system_name') system_name: string,
    @Query('system_password') system_password: string,
  ): Promise<TokenResponseDto> {
    const result = await this.queryBus.execute(
      new GetOneTokenQuery(req, id_token, system_name, system_password),
    );
    return result as TokenResponseDto;
  }
}
