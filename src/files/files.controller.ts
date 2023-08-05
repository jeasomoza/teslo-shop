import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { fileFilterHelper, fileNameHelper } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:fileName')
  async findProductImage(
    @Res() res: Response,
    @Param('fileName') fileName: string,
  ) {
    const path = await this.filesService.getStaticProductImage(fileName);
    res.sendFile(path);
    return path;
  }

  @Post('products')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilterHelper,
      // limits: { fileSize: 1000 },
      storage: diskStorage({
        destination: './static/uploads',
        filename: fileNameHelper,
      }),
    }),
  )
  create(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Archivo no enviado');

    const secureURL =
      this.configService.get('HOST_API') + '/files/product/' + file.filename;

    return { url: secureURL };
  }
}
