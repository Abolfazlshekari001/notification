import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class SubscriptionDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDg0MTIwNTAsImV4cCI6MTcwODQxMjA2MH0.aJlMkm1M2iLCbN-SUD2bKXP7EAds6P88-PiafUdfYp3',
  })
  @IsArray()
  @IsOptional()
  @IsNotEmpty()
  tokens: string[];

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
export class SubscriptionResponseDto {
  @ApiProperty()
  @IsBoolean()
  success: boolean;
  @ApiProperty({ type: SubscriptionDto })
  result: SubscriptionDto;
  @ApiProperty()
  @IsString()
  message: string;
}
