import connectDB from "../DB/connection.js";
import authRouter from "./Modules/Auth/auth.router.js";
import messageRouter from "./Modules/Messages/messages.router.js";
import userRouter from "./Modules/Users/users.router.js";
import { glopalErrHandling } from "./utils/errorHandling.js";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const bootstrap = (app, express) => {
  app.use(express.json({}));
  app.use("/uploads", express.static(path.join(__dirname, "./uploads")));


  app.get("/", (req, res) => res.send("Hello world!"));

  app.use("/auth", authRouter);
  app.use("/messages", messageRouter);
  app.use("/users", userRouter);

  app.all("*", (req, res, next) => {
    return res.json({ message: "404 Invalid Routing" });
  });

  app.use(glopalErrHandling);

  //DB connection s
  connectDB();
};
export default bootstrap;
