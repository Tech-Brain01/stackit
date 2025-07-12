import { Router } from "express";
import { authMiddleWare, authRequest } from "../middlewares/auth.guard";
import { AnswerService } from "../services/answer.service";
import { answerSchema } from "../config/validation";

export const answerRouter = Router();

answerRouter.post("/", authMiddleWare, async (req: authRequest, res, next) => {
  try {
    const { success, data } = answerSchema.safeParse(req.body);
    if (!success) throw new Error("Invalid answer");

    const answer = await AnswerService.createAnswer(req.user!.userId, data);
    res.json(answer);
  } catch (error) {
    next(error);
  }
});

answerRouter.post(
  "/:id/vote",
  authMiddleWare,
  async (req: authRequest, res, next) => {
    try {
      const { voteType } = req.body;
      const votes = await AnswerService.voteAnswer(
        req.user!.userId,
        req.params.id,
        voteType
      );
      res.json(votes);
    } catch (error) {
      next(error);
    }
  }
);

answerRouter.post(
  "/:id/comment",
  authMiddleWare,
  async (req: authRequest, res, next) => {
    try {
      const { content } = req.body;
      const comment = await AnswerService.commentOnAnswer(
        req.user!.userId,
        req.params.id,
        content
      );
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }
);
