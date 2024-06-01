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

export class TokenData {
  @ApiProperty({ example: 'cansAD9BVs_FnkE1MOLrgC' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'Windows' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  platform: string;
}
export class TokenDto {
  [x: string]: any;
  @ApiProperty({
    type: [TokenData],
    description: 'Array of token data objects',
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TokenData)
  tokens: TokenData[];

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDg0MTIwNTAsImV4cCI6MTcwODQxMjA2MH0.aJlMkm1M2iLCbN-SUD2bKXP7EAds6P88-IpodUdfYp3',
  })
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

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  Mute: boolean;

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
export class TokenResponseDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  success: boolean;
  @ApiProperty({ type: TokenDto })
  result: TokenDto;
  @ApiProperty()
  @IsString()
  message: string;
}
