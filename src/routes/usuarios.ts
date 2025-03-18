import { Router, Request, Response, NextFunction } from "express";
import { IRequest } from './../helper/const';
import { Controller } from "../controllers/usuarios";
import { AuthMiddleware } from "../middleware/auth";

const authM = new AuthMiddleware();

const router = Router();
const controller = new Controller();

router.get('/', [authM.auth],
  (req: Request, res: Response, next: NextFunction) => controller.getAll(req as IRequest, res, next))

router.post('/login_user', [],
  (req: Request, res: Response, next: NextFunction) => controller.loginUser(req as IRequest, res, next))
  

export default router;