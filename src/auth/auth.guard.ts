import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Aqui se maneja la lógica de verificación
    
    // 1.- Que se envie un token
      
    // 1.1 Obtener a solicitud del cliente
    const request = context.switchToHttp().getRequest();
    // 1.2 Obtener token
    const token = this.extractTokenFromHeader(request);
    
    // 2.- Que sea un token valido

    // 2.1 Verificar que si se mando el token
    if (!token) {
      throw new UnauthorizedException('Falta el token requerido');
    }
    // 2.2 Verificar que sea un token valido
    try {
      // payload - Carga util
      const payload = await this.jwtService.verifyAsync(token);
      // Agregamos el usuario que verificamos a la solicitud
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token expirado o no valido');
    }

    return true;
  }

  // Verificar si la solicitud tiene un token
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}