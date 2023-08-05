import { v4 as uuidv4 } from 'uuid';

export const fileNameHelper = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('Archivo no enviado'), false);
  const fileExtension = file.mimetype.split('/')[1];
  const filename = `${uuidv4()}.${fileExtension}`;
  callback(null, filename);
};
