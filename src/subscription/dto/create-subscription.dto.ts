import { IsEnum, IsOptional, IsString, IsDate } from 'class-validator';
import { SubscriptionStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateSubscriptionDto {
  @IsString()
  organizationId: string;

  @IsString()
  planId: string;

  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  endDate?: Date;
}

export class UpdateSubscriptionDto {
  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  endDate?: Date;
}