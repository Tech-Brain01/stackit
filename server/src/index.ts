import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./routes/auth.route";

const app = express();
app.use(cors());
app.use(cookieparser());
app.use(express.json());

app.use("/api/auth", authRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Stack server up`);
});
