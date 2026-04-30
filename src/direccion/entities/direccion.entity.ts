import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Direccion {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id!: number;

    @ApiProperty()
    @Column()
    idUser!: number;

    @ApiProperty()
    @Column()
    pais!: string;

    @ApiProperty()
    @Column()
    cp!: string;

    @ApiProperty()
    @Column()
    calle!: string;

    @ApiProperty()
    @Column()
    numero!: number;
}