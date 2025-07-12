import { Router } from "express";
import { authMiddleWare, authRequest } from "../middlewares/auth.guard";
import { NotificationService } from "../services/notification.service";

export const notificationRouter = Router();

notificationRouter.get(
  "/",
  authMiddleWare,
  async (req: authRequest, res, next) => {
    try {
      const notifications = await NotificationService.getNotifications(
        req.user!.userId
      );
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  }
);

notificationRouter.patch(
  "/:id/read",
  authMiddleWare,
  async (req: authRequest, res, next) => {
    try {
      const notification = await NotificationService.markNotificationAsRead(
        req.params.id
      );
      res.json(notification);
    } catch (error) {
      next(error);
    }
  }
);
