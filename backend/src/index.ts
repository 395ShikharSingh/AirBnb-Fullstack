import express from "express";
import rootRouter from "./routes/index";

const app = express();

app.use(express.json());
app.use("/airbnb", rootRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
