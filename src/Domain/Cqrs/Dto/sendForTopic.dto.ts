import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class sendNotificationTopicDto {
  @ApiProperty({ example: 'news' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'salam test' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDg0MTIwNTAsImV4cCI6MTcwODQxMjA2MH0.aJlMkm1M2iLCbN-SUD2bKXP7EAds6P88-IphfUdfYp3',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'news' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  topic_name: string;

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

export class sendNotificationResponseDto {
  @ApiProperty()
  @IsBoolean()
  success: boolean;
  @ApiProperty({ type: sendNotificationTopicDto })
  result: sendNotificationTopicDto;
  @ApiProperty()
  @IsString()
  message: string;
}
