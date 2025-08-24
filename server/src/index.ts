import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./routes/auth.route";
import { errorHandler } from "./middlewares/error.guard";
import { questionsRouter } from "./routes/questions.route";
import { answerRouter } from "./routes/answer.route";
import { notificationRouter } from "./routes/notifications.route";

const PORT = process.env.PORT || 8080;
const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "VERCEL_FRONTEND_URL"]
  })
);
app.use(cookieparser());
app.use(express.json());
app.use(errorHandler);

app.use("/api/auth", authRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/answers", answerRouter);
app.use("/api/notifications", notificationRouter);

app.listen(PORT, () => {
  console.log(`Stack server up on ${PORT} `);
});
