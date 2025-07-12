import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface authRequest extends Request {
  user?: { userId: string };
}

export const authMiddleWare = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);

  if (!token) {
    return res.status(401).json({ error: true, message: "Unauthorize" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET || "secrert") as {
      id: string;
    };
    console.log(decode);
    req.user = { userId: decode.id };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
