import { Router } from "express";
import { UserLoginSchema, UserSignupSchema } from "../config/validation";
import { UserService } from "../services/user.service";

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const body = req.body;
    const success = UserSignupSchema.safeParse(body);

    if (!success) {
      throw new Error("Invalid Detials");
    }

    const result = await UserService.signup(body);
    res.json(result);
  } catch (e: any) {
    res.json({ error: true, message: e.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const body = req.body;
    const success = UserLoginSchema.safeParse(body);

    if (!success) throw new Error("Invalid Details");

    const result = await UserService.login(body);
    res.json(result);
  } catch (e: any) {
    res.json({ error: true, message: e.message });
  }
});
