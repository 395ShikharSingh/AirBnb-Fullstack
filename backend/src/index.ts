import express from "express";
import rootRouter from "./routes/index";

const app = express();

app.use(express.json());
app.use("/airbnb", rootRouter);


export default app
