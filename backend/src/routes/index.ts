import express from "express";
import userRouter from "./user";
import managerRouter from "./hotel"

const router= express.Router();

router.use("/user", userRouter);
router.use("/manager", managerRouter);

export default router;