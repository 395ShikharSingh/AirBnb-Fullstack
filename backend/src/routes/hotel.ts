import { Request, Response } from "express";
import { signinBody, signupBody, hotelSchema, prisma, JWT_SECRET } from "../common/common";
import { authMiddleware } from "../authMiddleware";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = require("express").Router();
const TOKEN_EXPIRATION = "1h";

// Manager Signup Route
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error: "Invalid input format" });
    }

    const existingManager = await prisma.hotelManager.findUnique({
      where: { username: req.body.username },
    });

    if (existingManager) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const manager = await prisma.hotelManager.create({
      data: {
        name: req.body.name,
        username: req.body.username,
        password: hashedPassword,
        role: "manager",
      },
    });

    return res.status(201).json({
      message: "Hotel Manager added successfully",
      role: manager.role,
    });
  } catch (error) {
    console.error("Error during manager signup:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Manager Signin Route
router.post("/signin", async (req: Request, res: Response) => {
  try {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error: "Invalid input format" });
    }

    const existingManager = await prisma.hotelManager.findUnique({
      where: { username: req.body.username },
    });

    if (!existingManager) {
      return res.status(404).json({ message: "Username not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      existingManager.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: existingManager.id },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    return res.status(200).json({
      message: "SignIn successful",
      token,
    });
  } catch (error) {
    console.error("Error during manager signin:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Add Hotel Route
router.post("/addHotel", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const { success } = hotelSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error: "Invalid hotel input format" });
    }

    const newHotel = await prisma.hotel.create({
      data: {
        name: req.body.name,
        price: req.body.price,
        location: req.body.location,
        description: req.body.description || "",
        managerId: user.id,
      },
    });

    return res.status(201).json({
      message: "Hotel added successfully",
      hotel: newHotel,
    });
  } catch (error) {
    console.error("Error while adding hotel:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get Hotels Managed by Manager
router.get("/myhotel", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const myHotels = await prisma.hotel.findMany({
      where: { managerId: user.id },
    });

    return res.status(200).json({ hotels: myHotels });
  } catch (error) {
    console.error("Error while fetching hotels:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get Manager's Bookings
router.get("/managerBookings", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const managerBookings = await prisma.booking.findMany({
      where: {
        hotel: {
          managerId: user.id,
        },
      },
      include: {
        hotel: {
          select: {
            name: true,
            location: true,
          },
        },
        user: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    });

    res.json({
      bookings: managerBookings,
    });
  } catch (error) {
    console.error("Error fetching manager's bookings:", error);
    res.status(500).json({
      error: "Internal server error.",
    });
  }
});

export default router;
