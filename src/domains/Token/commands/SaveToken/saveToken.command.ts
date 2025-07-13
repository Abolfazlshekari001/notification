import { Type } from 'class-transformer';
import { ValidateNested, IsString, IsNotEmpty } from 'class-validator';
import { TokenDto } from 'src/domains/Token/dto/Token.dto';

export class saveTokensCommand {
  constructor(body: any, req: any) {
    this.req = req;
    this.tokens = body.tokens;
    this.system_name = body.system_name;
    this.system_password = body.system_password;
    this.topic_name = body.topic_name;
  }
  req: any;
  @ValidateNested()
  @Type(() => TokenDto)
  tokens: TokenDto;

  @IsString()
  @IsNotEmpty()
  system_name: string;

  @IsString()
  @IsNotEmpty()
  system_password: string;

  topic_name?: string;
}
