import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsNotEmpty({ message: 'Senha obrigatória' })
  @MinLength(6, { message: 'Senha precisa ter no mínimo 6 caracteres' })
  password: string;
}