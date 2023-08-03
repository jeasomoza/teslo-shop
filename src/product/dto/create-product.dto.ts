import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'El título debe ser un texto' })
  @MinLength(3, { message: 'El título es muy corto' })
  title: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe ser un número' },
  )
  @IsPositive({ message: 'El precio debe ser mayor que 0' })
  @IsOptional({ message: 'El precio es opcional' })
  price?: number;

  @IsString({ message: 'La descripción debe ser un texto' })
  @MinLength(10, {
    message:
      'La descripción es muy corta, minimo tiene que ser de 10 caracteres',
  })
  @IsOptional({ message: 'La descripción es opcional' })
  description?: string;

  @IsString({ message: 'El slug debe ser un texto' })
  @IsOptional({ message: 'El slug es opcional' })
  slug: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El stock debe ser un número' })
  @IsPositive({ message: 'El stock debe ser mayor que 0' })
  @IsOptional({ message: 'El stock es opcional' })
  stock?: number;

  @IsString({ each: true, message: 'El tamaño debe ser un texto' })
  @IsArray({ message: 'El tamaño debe ser un arreglo' })
  sizes: string[];

  @IsIn(['hombre', 'mujer', 'niño', 'niña', 'unisex'], {
    message: 'El género debe ser hombre, mujer, niño, niña o unisex',
  })
  gender: string;
}
