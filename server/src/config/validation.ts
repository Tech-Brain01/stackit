import { z } from "zod";

export const UserSignupSchema = z.object({
  username: z.string(),
  password: z.string().min(6, "Enter password with min 6characters"),
  email: z.string().email("Enter a valid email"),
});

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type UserSignupType = z.infer<typeof UserSignupSchema>;
export type UserLoginType = z.infer<typeof UserLoginSchema>;
