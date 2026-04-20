import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length, Matches, MinLength } from 'class-validator';

export class SmsRequestDto {
  @ApiProperty({ example: '+79881234567' })
  @IsString()
  @Matches(/^\+7\d{10}$/, { message: 'Телефон в формате +7XXXXXXXXXX' })
  phone!: string;
}

export class SmsVerifyDto extends SmsRequestDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @Matches(/^\d{6}$/)
  code!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(2, 80)
  name?: string;
}

export class StaffLoginDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  password!: string;

  @ApiProperty({ required: false, example: '123456' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/)
  totp?: string;
}

export class TotpConfirmDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @Matches(/^\d{6}$/)
  code!: string;
}
