import express from "express";
import rootRouter from "./routes/index";

const app = express();

app.use(express.json());
app.use("/airbnb", rootRouter);
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log("Server running on port 3000");
});
