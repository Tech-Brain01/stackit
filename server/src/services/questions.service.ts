import { prisma } from "../config/prisma";
import { QuestionsType } from "../config/validation";

export class QuestionsService {
  //add question
  static async createQuestion(
    userId: string,
    { title, description, tags }: QuestionsType
  ) {
    const question = await prisma.question.create({
      data: {
        title,
        description,
        tags: tags || [],
        userId,
      },
      select: {
        id: true,
        title: true,
      },
    });

    return question;
  }

  //getquestions
  static async getQuestions() {
    return prisma.question.findMany({
      include: {
        user: { select: { username: true } },
        answers: { select: { id: true } },
      },
    });
  }

  //one question
  static async getQuestion(id: string) {
    return prisma.question.findUnique({
      where: { id },
      include: {
        user: { select: { username: true } },
        answers: {
          include: {
            user: { select: { username: true } },
            votes: true,
            comments: { include: { user: { select: { username: true } } } },
          },
        },
      },
    });
  }
}
