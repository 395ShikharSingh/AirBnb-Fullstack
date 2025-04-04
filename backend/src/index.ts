import express from "express";
import cors from "cors"; 
import rootRouter from "./routes/index";

const app = express();


app.use(cors({
  origin: "https://air-bnb-fullstack-flame.vercel.app", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
}));

app.use(express.json());
app.use("/airbnb", rootRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
