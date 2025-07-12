import { prisma } from "../config/prisma";
import { UserLoginType, UserSignupType } from "../config/validation";
import * as bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export class UserService {
  static async signup({ username, email, password }: UserSignupType) {
    const existed = await prisma.user.findUnique({ where: { email } });

    if (existed) {
      throw new Error("Account already exists");
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
      message: "Welcome to StackIt",
    };
  }

  static async login({ email, password }: UserLoginType) {
    const exist = await prisma.user.findUnique({ where: { email } });

    if (!exist) throw new Error("Invalid Credentials");

    const validated = bcryptjs.compare(password, exist.password);

    if (!validated) throw new Error("Invalid Credentials");

    const token = jwt.sign(
      { id: exist.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1hr" }
    );

    return {
      user: { id: exist.id, email: exist.email, username: exist.username },
      token,
    };
  }
}
