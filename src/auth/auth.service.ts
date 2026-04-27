import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  repoUser: any;
  jwtService: any;
  constructor(@InjectRepository(User) private usersRepository: Repository<User>,) {}

  // ================
  // Registro
  // ================
  async create(createUserDto: CreateUserDto) {
    const {email, password} = createUserDto;

    // 1.- Verificamos que no existe un usuario con el mismo correo
    const emailExist = await this.repoUser.findOneByEmail({email});
    if (emailExist) {
      const error = {
        "statusCode": 409,
        "error": "Conflict",
        "message": ["El email ya existe"]
      }

      //Si se cumple la condición, el usuario existe en la base de datos
      throw new ConflictException(error);
    }
    
    // 2.- Encriptamos el password
    const numRound = 10;
    const hashPassword = await bcrypt.hash(password, numRound)

    createUserDto.password = hashPassword;

    // 3.- Y guardamos en base de datos
    return this.repoUser.save(createUserDto);
  }

  // ================
  // Inicio de sesión
  // ================
  async login(loginUserDto: LoginUserDto) {
    const {email, password} = loginUserDto;

    // 1.- Verificar que el email existe
    const emailExist = await this.repoUser.findOneByEmail({email});
    if (!emailExist) {
      const error = {
        "statusCode": 404,
        "error": "Not Found",
        "message": ["El usuario no existe"]
      }

      //Si se cumple la condición, el usuario existe en la base de datos
      throw new NotFoundException(error);
    }

    // 2.- Comparar contraseñas hasheadas
    const matchPassword = await bcrypt.compare(password, emailExist.password)
    if (!matchPassword) {
      const error = {
        "statusCode": 401,
        "error": "Unauthorized",
        "message": ["Contraseña incorrecta"]
      }

      throw new UnauthorizedException(error);
    }
    
    // 3.- Regresar el token JWT (JSON Web Token)
    // El token es la credencial
    // Datos significativos

    // Subject (sujeto) - Identifica de manera única
    const payload = {
      sub: emailExist.id,
      name: emailExist.name,
      email: emailExist.email
    }

    const token = await this.jwtService.signAsync(payload);
    return {token};
  }

  findOneByEmail(email:string): Promise<User | null>{
    return this.usersRepository.findOneBy({ email });
  }
}
