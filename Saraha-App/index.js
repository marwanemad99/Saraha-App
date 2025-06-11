import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import bootstrap from "./src/app.router.js";

const app = express();
const port = process.env.PORT;

bootstrap(app, express);

app.listen(port, () => {
  console.log(`Server is running on port.......${port}`);
});
