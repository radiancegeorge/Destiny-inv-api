import express from "express";
import cors from "cors";
import errorHandler from "./middleWares/errorHandler.middleware";
import routes from "./routes";
const app = express();

app.use(cors());
app.use(express.json());

//route
app.use("/api", routes);

//error handler
app.use(errorHandler);

//export app
export default app;
