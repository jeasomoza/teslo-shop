export const fileFilterHelper = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  // console.log(file);
  if(!file) return callback(new Error('Archivo no enviado'), false);

  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Solo se permiten imagenes'), false);
  }
  callback(null, true);
};
