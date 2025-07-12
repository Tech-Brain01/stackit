import { prisma } from "../config/prisma";
import { AnswerType } from "../config/validation";
import { createNotification } from "./notification.service";

export class AnswerService {
  static async createAnswer(
    userId: string,
    { content, questionId }: AnswerType
  ) {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) {
      throw new Error("Question not found");
    }

    const answer = await prisma.answer.create({
      data: {
        content: content,
        questionId: questionId,
        userId,
      },
      include: { user: { select: { username: true } } },
    });

    await createNotification({
      userId: question.userId,
      type: "ANSWER",
      content: `New answer to your question: ${question.title}`,
      relatedId: answer.id,
    });

    // Check for mentions and create notifications
    const mentions = content.match(/@(\w+)/g)?.map((m) => m.slice(1)) || [];
    for (const username of mentions) {
      const mentionedUser = await prisma.user.findUnique({
        where: { username },
      });
      if (mentionedUser && mentionedUser.id !== userId) {
        await createNotification({
          userId: mentionedUser.id,
          type: "MENTION",
          content: `You were mentioned in an answer by ${answer.user.username}`,
          relatedId: answer.id,
        });
      }
    }

    return answer;
  }

  static async voteAnswer(
    userId: string,
    answerId: string,
    voteType: "UPVOTE" | "DOWNVOTE"
  ) {
    const answer = await prisma.answer.findUnique({ where: { id: answerId } });
    if (!answer) {
      throw new Error("Answer not found");
    }

    const existingVote = await prisma.vote.findFirst({
      where: { userId, answerId },
    });

    if (existingVote) {
      if (existingVote.type === voteType) {
        // Remove vote if same type
        await prisma.vote.delete({ where: { id: existingVote.id } });
      } else {
        // Update vote type
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type: voteType },
        });
      }
    } else {
      // Create new vote
      await prisma.vote.create({
        data: {
          type: voteType,
          userId,
          answerId,
        },
      });
    }

    // Calculate vote count
    const votes = await prisma.vote.groupBy({
      by: ["type"],
      where: { answerId },
      _count: { type: true },
    });

    const upvotes = votes.find((v) => v.type === "UPVOTE")?._count.type || 0;
    const downvotes =
      votes.find((v) => v.type === "DOWNVOTE")?._count.type || 0;

    return { upvotes, downvotes };
  }

  static async commentOnAnswer(
    userId: string,
    answerId: string,
    content: string
  ) {
    const answer = await prisma.answer.findUnique({ where: { id: answerId } });
    if (!answer) {
      throw new Error("Answer not found");
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        answerId,
        userId,
      },
      include: { user: { select: { username: true } } },
    });

    // Create notification for answer owner
    await createNotification({
      userId: answer.userId,
      type: "COMMENT",
      content: `New comment on your answer by ${comment.user.username}`,
      relatedId: comment.id,
    });

    // Check for mentions
    const mentions = content.match(/@(\w+)/g)?.map((m) => m.slice(1)) || [];
    for (const username of mentions) {
      const mentionedUser = await prisma.user.findUnique({
        where: { username },
      });
      if (mentionedUser && mentionedUser.id !== userId) {
        await createNotification({
          userId: mentionedUser.id,
          type: "MENTION",
          content: `You were mentioned in a comment by ${comment.user.username}`,
          relatedId: comment.id,
        });
      }
    }

    return comment;
  }
}
