import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { UpdateDireccionDto } from './dto/update-direccion.dto';
import { Direccion } from './entities/direccion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DireccionService {
  constructor(@InjectRepository(Direccion) private repoDireccion: Repository<Direccion>) {}

  async create(userId: number, dto: CreateDireccionDto): Promise<Direccion> {
    const direccion = this.repoDireccion.create({...dto, idUser: userId});

    return await this.repoDireccion.save(direccion);
  }

  findAll(userId: number): Promise<Direccion[]> {
    return this.repoDireccion.find({ where: { idUser: userId } });
  }

  async findOne(userId: number, id: number): Promise<Direccion> {
    const direccion = await this.repoDireccion.findOne({ where: { id, idUser: userId } });

    if (!direccion) {
      throw new NotFoundException('Dirección no encontrada');
    }

    return direccion;
  }

  async update(userId: number, dto: UpdateDireccionDto, id: number): Promise<Direccion> {
    const direccion = await this.findOne(userId, id);
    const updated = this.repoDireccion.merge(direccion, dto);

    return await this.repoDireccion.save(updated);
  }

  async remove(userId: number, id: number): Promise<void> {
    const direccion = await this.findOne(userId, id);

    await this.repoDireccion.remove(direccion);
  }
}
