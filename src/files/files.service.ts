import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getStaticProductImage(fileName: string) {
    const path = join(__dirname, '../../static/uploads', fileName);

    if (!existsSync(path))
      throw new BadRequestException('Imagen no encontrada llamada ' + fileName);
    
    return path;
  }
}
