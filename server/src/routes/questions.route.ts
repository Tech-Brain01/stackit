import { Router } from "express";
import { authMiddleWare, authRequest } from "../middlewares/auth.guard";
import { QuestionsService } from "../services/questions.service";
import { questionSchema } from "../config/validation";

export const questionsRouter = Router();

questionsRouter.post(
  "/",
  authMiddleWare,
  async (req: authRequest, res, next) => {
    try {
      const { success, data } = questionSchema.safeParse(req.body);
      if (!success) throw new Error("Invalid format. Try Again");
      const userId = req.user?.userId!;
      console.log(userId);
      const question = await QuestionsService.createQuestion(userId, data);
      res.json(question);
    } catch (error) {
      next(error);
    }
  }
);

questionsRouter.get("/", async (req, res, next) => {
  try {
    const questions = await QuestionsService.getQuestions();
    res.json(questions);
  } catch (error) {
    next(error);
  }
});

questionsRouter.get("/:id", async (req, res, next) => {
  try {
    const question = await QuestionsService.getQuestion(req.params.id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json(question);
  } catch (error) {
    next(error);
  }
});
