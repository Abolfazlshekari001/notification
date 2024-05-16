import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class topicDto {
  @ApiProperty({ example: 'news' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  topic_name: string;

  @ApiProperty({ example: 'news for blockpost' })
  @IsOptional()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  decriptions_topic: string;

  @ApiProperty({ example: 'javad' })
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
  @ApiProperty()
  @IsString()
  result: topicDto;
  @ApiProperty()
  @IsString()
  message: string;
}
