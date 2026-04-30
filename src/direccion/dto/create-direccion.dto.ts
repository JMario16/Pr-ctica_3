import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateDireccionDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    pais!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(5)
    cp!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    calle!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    numero!: number;
}