import { Response, NextFunction, Request } from "express";
import * as boom from "@hapi/boom";
import { Common } from '../helper/common';

export class ErrorMiddleware {

  public logErrors = (err: object, req: Request, res: Response, next: NextFunction) => {
    // Si es un error
    if (!(err as { status: boolean }).status) {
      new Common().showLogMessage('Error controlado', err, 'error');
    }
    next(err);
  };

  public wrapErrors = (err: object, req: Request, res: Response, next: NextFunction) => {
    if (!(err as { isBoom: boolean }).isBoom) {
      next(boom.badImplementation("Error en el servidor", err));
    }
    else next(err);
  };

  public errorHandler = (err: boom.Boom, req: Request, res: Response) => {

    // Si no es error
    if (err.data && err.data.status) return res.status(err.data.code_status || 500).json(err.data);

    const { output: { statusCode, payload }, message, data } = err;

    const rt: { data?: object, payload?: object } = {};

    // Establece el código de respuesta
    const code_status = data ? data.status_code || statusCode : statusCode;

    // Si estaba la propiedad de 'status_code' la elimina de la respuesta
    if (data && data.status_code) delete data.status_code;

    // Si hay data la agrega
    if (data) rt.data = data;
    else rt.payload = payload;

    return res.status(code_status).json({
      status: 'error',
      error: rt,
      message
    });
  }
}