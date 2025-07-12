import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface authRequest extends Request {
  user?: { userId: string };
}

export const authMiddleWare = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {};
