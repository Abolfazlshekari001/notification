import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TokenService } from './token.service';
import { saveTokensCommand } from './SaveToken/saveToken.command';
import { TokenDto, TokenResponseDto } from '../Dto/Token.dto';
import { deleteTokensCommand } from './DeletedToken/deleteToken.command';
import { GetAllTokenQuery } from './queries/getALLtoken/getAllToken.query';
import { GetOneTokenQuery } from './queries/getOneToken/getOneToken.query';

@Controller('token')
export class TokenController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly tokenService: TokenService,
  ) {}

  @Post('TokenRegistration')
  async save(@Body() body: TokenDto, @Req() req): Promise<TokenResponseDto> {
    const result = await this.commandBus.execute(
      new saveTokensCommand(body, req),
    );
    return result as TokenResponseDto;
  }

  @Delete('DeleteToken/:id_token')
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

  @Get('getAllToken')
  async getAll(@Req() req, @Body() body: TokenDto): Promise<TokenResponseDto> {
    const result = await this.queryBus.execute(new GetAllTokenQuery(req, body));
    return result as TokenResponseDto;
  }

  @Get('getOneToken/:id_token')
  async getOne(@Req() req,
  @Body() body: TokenDto,
  @Param('id_token') id_token: string
): Promise<TokenResponseDto> {
    const result = await this.queryBus.execute(
      new GetOneTokenQuery(req,body,id_token),
    );
    return result as TokenResponseDto;
  }
}
