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

export const questionSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10),
  tags: z.array(z.string()).optional(),
});
export const answerSchema = z.object({
  content: z.string().min(10),
  questionId: z.string(),
});

export type AnswerType = z.infer<typeof answerSchema>;

export type QuestionsType = z.infer<typeof questionSchema>;
export type UserSignupType = z.infer<typeof UserSignupSchema>;
export type UserLoginType = z.infer<typeof UserLoginSchema>;
