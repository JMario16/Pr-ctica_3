import { Controller, Get, Post, Body, Patch, Delete, UseGuards, Param, Req } from '@nestjs/common';
import { DireccionService } from './direccion.service';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { UpdateDireccionDto } from './dto/update-direccion.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Direccion } from './entities/direccion.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('direccion')
export class DireccionController {
  constructor(private readonly direccionService: DireccionService) {}

  @ApiBody({type: CreateDireccionDto}) // Indica que requiere un body
  @ApiCreatedResponse({type: Direccion, description: 'Cuando la creación es exitosa'})
  @ApiBadRequestResponse({description: 'Cuando falta un campo, o el formato es incorrecto'})
  @ApiUnauthorizedResponse({ description: 'No autorizado (token inválido o inexistente)' })
  @Post()
  postDireccion(@Req() req, @Body() createDireccionDto: CreateDireccionDto) {
    const userId = req.user.sub;
    return this.direccionService.create(userId, createDireccionDto);
  }
  
  @ApiOkResponse({type: [Direccion], description: 'Lista de direcciones del usuario'})
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @Get()
  getDireccion(@Req() req) {
    const userId = req.user.sub;
    return this.direccionService.findAll(userId);
  }

  @ApiOkResponse({type: Direccion, description: 'Dirección encontrada'})
  @ApiNotFoundResponse({description: 'Dirección no encontrada'})
  @ApiUnauthorizedResponse({description: 'No autorizado'})
  @Get(':id')
  getDireccionById(@Req() req, @Param('id') id: string) { 
    const userId = req.user.sub;
    return this.direccionService.findOne(userId, +id);
  }

  @ApiBody({type: UpdateDireccionDto}) // Indica que requiere un body
  @ApiOkResponse({type: Direccion, description: 'Dirección actualizada correctamente'})
  @ApiBadRequestResponse({description: 'Datos inválidos'})
  @ApiNotFoundResponse({description: 'Dirección no encontrada'})
  @ApiUnauthorizedResponse({description: 'No autorizado'})
  @Patch(':id')
  updateDireccion(@Req() req, @Param('id') id: string, @Body() updateDireccionDto: UpdateDireccionDto) {
    const userId = req.user.sub;
    return this.direccionService.update(userId, updateDireccionDto, +id);
  }

  @ApiNoContentResponse({description: 'Dirección eliminada correctamente'})
  @ApiNotFoundResponse({description: 'Dirección no encontrada'})
  @ApiUnauthorizedResponse({description: 'No autorizado'})
  @Delete(':id')
  deleteDireccion(@Req() req, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.direccionService.remove(userId, +id);
  }
}