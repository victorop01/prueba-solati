import { Response, NextFunction } from "express";
import { Transaction, Sequelize, Op } from 'sequelize';
import { IRequest } from "../helper/const";
import { Connection } from "../db/connection";
import { Common } from "../helper/common";
import TaskModel, { ITask } from "../models/tasks";

export class Controller {
    async getAll(req: IRequest, res: Response, next: NextFunction) {
        try {
          const page: number = req.query.page ? parseInt(req.query.page as string) : 1;
          const limit: number = req.query.limit ? parseInt(req.query.limit as string) : 500;
          const offset = (page - 1) * limit;
          const where = new Common().setWhere<ITask>(req.query, (req.query.op as "or" | "and" | undefined));
    
          const results = await TaskModel().findAndCountAll({
            where,
            limit,
            offset,
            order: [
              ['id', 'ASC']
            ]
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

    async get(req: IRequest, res: Response, next: NextFunction) {
      const { id } = req.params;

      try {
        const page: number = req.query.page ? parseInt(req.query.page as string) : 1;
        const limit: number = req.query.limit ? parseInt(req.query.limit as string) : 500;
        const offset = (page - 1) * limit;
        const where = new Common().setWhere<ITask>(req.query, (req.query.op as "or" | "and" | undefined));
  
        const results = await TaskModel().findAndCountAll({
          where: {
            id
          },
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

    async createTask(req: IRequest, res: Response, next: NextFunction) {
        const { body } = req;
        let transaction: Transaction | null = null;
    
        try {
          // Inicia una transacción
          transaction = await (Connection.getInstance().db as Sequelize).transaction();
    
          const reg = await TaskModel().create(body, { transaction });
    
          // Commit a los cambios
          await transaction.commit();
    
          return res.json(reg);
    
        } catch (error) {
          // Rollback a los cambios
          if (transaction !== null) await transaction.rollback().catch(() => null);
    
          new Common().showLogMessage('Error controlado', error, 'error');
          next({
            message: 'Ha ocurrido un error en nuestro sistema, intenta nuevamente',
            error,
            code: 10
          });
        }
    }

    async updateTask(req: IRequest, res: Response, next: NextFunction) {
    
        const { id } = req.params;
        const { body } = req;
        let transaction: Transaction | null = null;
    
        try {
          const reg = await TaskModel().findByPk(id);
          if (!reg) {
            return res.status(404).json({
              message: `No se encuentra la tarea con el id ${id}`,
              error: 'Not found',
              code: 40
            });
          }
    
          // Inicia una transacción
          transaction = await (Connection.getInstance().db as Sequelize).transaction();
    
          await reg.update(body, {
            where: {
              id
            },
            transaction
          });
    
          // Commit a los cambios
          await transaction.commit();
    
          return res.json(reg);    
        } catch (error) {
          // Rollback a los cambios
          if (transaction !== null) await transaction.rollback().catch(() => null);
          new Common().showLogMessage('Error controlado', error, 'error');
          next({
            message: 'Ha ocurrido un error en nuestro sistema, intenta nuevamente',
            error,
            code: 10
          });
        }
    }

}