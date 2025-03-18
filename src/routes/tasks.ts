import { Router, Request, Response, NextFunction } from "express";
import { IRequest } from './../helper/const';
import { Controller } from "../controllers/tasks";
import { AuthMiddleware } from "../middleware/auth";

const authM = new AuthMiddleware();

const router = Router();
const controller = new Controller();

router.get('/', [authM.auth],
  (req: Request, res: Response, next: NextFunction) => controller.getAll(req as IRequest, res, next))

router.get('/:id', [authM.auth],
  (req: Request, res: Response, next: NextFunction) => controller.get(req as IRequest, res, next))

router.post('/create_task', [authM.auth],
  (req: Request, res: Response, next: NextFunction) => controller.createTask(req as IRequest, res, next))

router.put('/update_task/:id', [authM.auth],
  (req: Request, res: Response, next: NextFunction) => controller.updateTask(req as IRequest, res, next))

router.delete('/:id', [authM.auth],
  (req: Request, res: Response, next: NextFunction) => controller.deleteTask(req as IRequest, res, next))

export default router;