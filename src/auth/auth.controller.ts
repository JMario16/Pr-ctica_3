import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // - - - NO PROTEGIDAS - - -

  @ApiBody({type: CreateUserDto}) // Indica que requiere un body
  @ApiCreatedResponse({type: User, description: 'Cuando el registro es exitoso'})
  @ApiBadRequestResponse({description: 'Cuando falta un campo, o el formato es incorrecto'})
  @ApiConflictResponse({description: 'Correo existente'})
  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiBody({type: LoginUserDto}) // Indica que requiere un body
  @ApiCreatedResponse({description: 'Cuando el acceso es correcto', schema: {example: {token: 'Token generado'}}})
  @ApiNotFoundResponse({description: 'Usuario no encontrado'})
  @ApiUnauthorizedResponse({description: 'Contraseña incorrecta'})
  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}