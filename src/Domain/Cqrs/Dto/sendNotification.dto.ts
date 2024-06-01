import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsBoolean,
  IsArray,
  IsNumber,
} from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({ example: 'salam' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'test shomareh 33' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    type: [String],
    example: [
      'cansAD9BVs_FnkE1MOLrgC:APA91bENP_bevyC5kRhETr4c473qNxYF8kCLsCshnBsH_wzKHsq3keGiTvKg5vX3zpKE4IWlG1_wrWWrNm3DcqfoX9jj-9J3Dq2mKWX11Mtt886_ceTzIhhWcv_53MrvjlTIz40Y9xzd',
      'dN-gZm7_CtUVHU3VqsSt0O:APA91bFAIExbkBWhOgiBryq42WSJ5IrgG9xJimZjAyjWHrwfgluBcKZHY_2T3UP9bZrEQT0GnyJwN68zV3FymkmdNr-Auk93NhnV_OGTi_7oROlI40YmBILLjr_e9_7AmQdW5wje7bUR',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  tokens: string[];

  @ApiPropertyOptional({
    example:
      'cansAD9BVs_FnkE1MOLrgC:APA91bENP_bevyC5kRhETr4c473qNxYF8kCLsCshnBsH_wzKHsq3keGiTvKg5vX3zpKE4IWlG1_wrWWrNm3DcqfoX9jj-9J3Dq2mKWX11Mtt886_ceTzIhhWcv_53MrvjlTIz40Y9xzd',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'simorgh' })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  system_name: string;

  @ApiProperty({ example: '1234' })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  system_password: string;

  @ApiProperty({ example: 'sport' })
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  topics: string[];
}
export class SendNotificationResponseDto {
  @ApiProperty()
  @IsBoolean()
  success: boolean;
  @ApiProperty({ type: SendNotificationDto })
  result: SendNotificationDto;
  @ApiProperty()
  @IsString()
  message: string;
}
