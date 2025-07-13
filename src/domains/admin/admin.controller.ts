import { Body, Controller, Post, Req } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddSystemCommandCommand } from './cqrs/commands/addSystem/addSystem.command';
import { AddSystemDto, AddSystemResponseDto } from './dto/create.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('notification/admin')
@ApiTags('admin')
export class AdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('create-system')
  async create(
    @Req() req: Request,
    @Body() body: AddSystemDto,
  ): Promise<AddSystemResponseDto> {
    const result = await this.commandBus.execute(
      new AddSystemCommandCommand(req, body),
    );
    return result as AddSystemResponseDto;
  }
}
