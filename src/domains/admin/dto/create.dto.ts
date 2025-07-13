import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';

export class AddSystemDto {
  @IsString()
  @MinLength(3, { message: 'نام سامانه باید حداقل ۳ کاراکتر باشد.' })
  @MaxLength(50, { message: 'نام سامانه نباید بیشتر از ۵۰ کاراکتر باشد.' })
  systemName: string;

  @IsString()
  @MinLength(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد.' })
  @MaxLength(100, { message: 'رمز عبور نباید بیشتر از ۱۰۰ کاراکتر باشد.' })
  systemPassword: string;

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

  @ApiProperty({
    example: './credentials/app1.json',
    description: 'مسیر فایل serviceAccount مربوط به Firebase',
  })
  @IsString({ message: 'مسیر فایل باید یک رشته باشد.' })
  @MinLength(5, { message: 'مسیر فایل بسیار کوتاه است.' })
  firebaseServiceAccountPath: string;
}

export class AddSystemResponseDto {
  @ApiProperty()
  @IsBoolean()
  success: boolean;
  @ApiProperty({ type: AddSystemDto })
  result: AddSystemDto;
  @ApiProperty()
  @IsString()
  message: string;
}
