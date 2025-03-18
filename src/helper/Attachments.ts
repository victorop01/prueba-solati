import multer from 'multer';
import path from 'path';
import * as dotenv from "dotenv";
dotenv.config({ path: `./environments/.${process.env.ENV || 'local'}.env` });

const fileFilter = (req:any, file:any, cb:any) => {
    const allowedExts = ['.png', '.jpg', '.jpeg', '.gif', '.pdf', '.xlsx', '.docx', '.doc', '.xls'];
    const fileParts = file.originalname.split('.');
    const fileType = `.${fileParts[fileParts.length - 1]}`;

    if (allowedExts.includes(fileType)) {
        return cb(null, true);
    }

    return cb(new Error('Formato de archivo no válido'), false);
};

// Configuración de multer para especificar la carpeta de destino y el nombre del archivo
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, process.env.RUTA_ADJUNTOS??''); // Carpeta de destino
    },
    filename: function (req, file, cb) {
      // Obtiene la extensión del archivo
      const extname = path.extname(file.originalname);
      // Genera un nombre único para el archivo usando la fecha actual
      const uniqueSuffix = file.originalname + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + extname);
      //cb(null, file.originalname); // Nombre del archivo original
    }
  });
  
  export const upload = multer({fileFilter, storage: storage });

  module.exports = {
    upload
};