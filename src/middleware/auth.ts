import * as jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export class AuthMiddleware {

  constructor() {
  }

  /**
   * Realiza la autorización
   */
  public auth = (req: any, res: Response, next: NextFunction) => {

    let jwtToken = req.header('Authorization');
    if (!jwtToken) return res.status(401).json({ success: false, message: 'Token not found' });

    try {
      let payload = jwt.verify(jwtToken, process.env.SECRET_KEY_JWT_API!);
      req.user = payload;
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Invalid token' });
    }
  }
  
}