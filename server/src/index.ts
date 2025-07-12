import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./routes/auth.route";
import { errorHandler } from "./middlewares/error.guard";
import { questionsRouter } from "./routes/questions.route";

const PORT = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(cookieparser());
app.use(express.json());
app.use(errorHandler);

app.use("/api/auth", authRouter);
app.use("/api/questions", questionsRouter);

app.listen(PORT, () => {
  console.log(`Stack server up on ${PORT} `);
});
