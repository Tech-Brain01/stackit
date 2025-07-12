import { prisma } from "../config/prisma";

export interface NotificationData {
  userId: string;
  type: "ANSWER" | "COMMENT" | "MENTION";
  content: string;
  relatedId: string;
}

export const createNotification = async (data: NotificationData) => {
  return prisma.notification.create({
    data,
  });
};
export class NotificationService {
  static async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async markNotificationAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }
}
