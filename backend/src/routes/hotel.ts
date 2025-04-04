import { Request, Response } from "express";
import { signinBody, signupBody, hotelSchema, prisma, JWT_SECRET } from "../common/common";
import { authMiddleware } from "../authMiddleware";
import jwt from "jsonwebtoken";

const router = require("express").Router();
const TOKEN_EXPIRATION = "1h";

// Manager Signup Route
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error: "Invalid input format" });
    }

    const existingUser = await prisma.hotelManager.findUnique({
      where: { username: req.body.username },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const newUser = await prisma.hotelManager.create({
      data: {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        role: "user",
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Manager Signin Route
router.post("/signin", async (req: Request, res: Response) => {
  try {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error: "Invalid input format" });
    }

    const user = await prisma.hotelManager.findUnique({
      where: { username: req.body.username },
    });

    if (!user || user.password !== req.body.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

    res.status(200).json({
      message: "SignIn successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
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
