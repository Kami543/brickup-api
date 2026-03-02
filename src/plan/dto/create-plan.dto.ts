import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PlanType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreatePlanDto {
  @IsEnum(PlanType)
  name: PlanType;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  description?: string;
}