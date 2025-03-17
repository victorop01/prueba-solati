import { Response, NextFunction } from "express";
import { Transaction, Sequelize } from 'sequelize';
import { IRequest } from "../helper/const";
import { Connection } from "../db/connection";
import { Common } from "../helper/common";
import UsuarioModel, { IUsuario } from "../models/usuarios";
import * as bcrypt from 'bcryptjs';
import ldap from "ldapjs";
import * as dotenv from "dotenv";
import { AuthUtils } from "../helper/AuthUtils";
dotenv.config({ path: `./environments/.${process.env.ENV || 'local'}.env` });

export class Controller {
  async getAll(req: IRequest, res: Response, next: NextFunction) {
    try {
      const page: number = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit: number = req.query.limit ? parseInt(req.query.limit as string) : 500;
      const offset = (page - 1) * limit;
      const where = new Common().setWhere<IUsuario>(req.query, (req.query.op as "or" | "and" | undefined));

      const results = await UsuarioModel().findAndCountAll({
        where,
        limit,
        offset
      });

      const rpt = {
        data: results.rows,
        meta: {
          total: results.count,
          page
        }
      }

      return res.json({ ...rpt });
    } catch (error) {
      new Common().showLogMessage('Error controlado', error, 'error');
      next({
        message: 'Ha ocurrido un error en nuestro sistema, intenta nuevamente',
        error,
        code: 10
      });
    }
  }

  async loginUser(req: IRequest, res: Response, next: NextFunction) {
    const { body } = req;
    const password = body.password;
   
    // Obtiene datos del usuario
    const userFind: any = await UsuarioModel().findOne({
      where: {
        username: body.username
      },
    });
    // Si no existe el usuario
    if (!userFind) {
      return res.status(404).json({ message: 'Aún no te encuentras registrado ¡Regístrate! y/o Inactivo', success: false, });
    }

    try {
      if(password == userFind.password){
        const internalToken = await AuthUtils.generateToken(
          body.username,
          userFind.id,
          userFind.username
        );

        return res.status(200).json({
          success: true,
          id: userFind.id,
          user: body.username,
          nombre_completo: userFind.fullname,
          token: internalToken.internalToken
        });
      } else {
        return res.status(404).json({ 
          success: false,
          message: 'Correo o contraseña incorrecta. Vuelve a intentarlo! ',  
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Ha ocurrido un error en nuestro sistema, intenta nuevamente",
        success: false,
      });
    }
    
  }
}