import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class topicDto {
  @ApiProperty({ example: 'news' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Topic name cannot be empty' })
  @Matches(/^[a-zA-Z0-9-_.~%]+$/, {
    message: 'Topic name contains invalid characters',
  })
  topic_name: string;

  @ApiProperty({ example: 'news for blockpost' })
  @IsOptional()
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  decriptions_topic: string;

  @ApiProperty({ example: 'simorgh' })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  system_name: string;

  @ApiProperty({ example: 'aa111aa' })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  system_password: string;
}
export class topicResponseDto {
  @ApiProperty()
  @IsBoolean()
  success: boolean;
  @ApiProperty({ type: topicDto })
  result: topicDto;
  @ApiProperty()
  @IsString()
  message: string;
}
