import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateOrganizationDto {
    @IsString()
    @IsNotEmpty({ message: 'O nome da organização é obrigatório' })
    name: string;
  
    @IsString()
    @IsNotEmpty({ message: 'O slug da organização é obrigatório' })
    slug: string;
  }

export class UpdateOrganizationDto {
    @IsString()
    @IsOptional()
    name?: string;
  
    @IsString()
    @IsOptional()
    slug?: string;
}