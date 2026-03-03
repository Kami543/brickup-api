import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsUUID, 
  IsNotEmpty,
  MinLength,
  MaxLength 
} from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @IsUUID()
  @IsOptional()
  userId?: string;
}