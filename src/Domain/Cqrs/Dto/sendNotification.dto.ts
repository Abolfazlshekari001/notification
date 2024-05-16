import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({ example: 'news' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'news' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDg0MTIwNTAsImV4cCI6MTcwODQxMjA2MH0.aJlMkm1M2iLCbN-SUD2bKXP7EAds6P88-PiafUdfYp3',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  token: string;

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

  @ApiProperty({ example: 'aa111aa' })
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  topics: string[];
}
export class SendNotificationResponseDto {
  @ApiProperty()
  @IsBoolean()
  success: boolean;
  @ApiProperty()
  @IsString()
  result: SendNotificationDto;
  @ApiProperty()
  @IsString()
  message: string;
}
