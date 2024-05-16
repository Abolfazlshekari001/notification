import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

class TokenData {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  platform: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}
export class TokenDto {
  [x: string]: any;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TokenData)
  tokens: TokenData[];
  

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDg0MTIwNTAsImV4cCI6MTcwODQxMjA2MH0.aJlMkm1M2iLCbN-SUD2bKXP7EAds6P88-IphfUdfYp3' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  token: string;
  
  @ApiProperty({ example: 'IOS' })
  @IsOptional()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  platform: string;

  @ApiProperty({ example: 'uuid' })
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  user_id: string;

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
export class TokenResponseDto {
  @ApiProperty()
  @IsBoolean()
  success: boolean;
  @ApiProperty()
  @IsString()
  result: TokenDto;
  @ApiProperty()
  @IsString()
  message: string;
}
