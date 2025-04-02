import express, { Request, Response } from "express";
import { signinBody, signupBody, prisma, JWT_SECRET } from "../common/common";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../authMiddleware";

const router = express.Router();
const TOKEN_EXPIRATION = "1h";

// User Signup
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error: "Invalid input format" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username: req.body.username },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const newUser = await prisma.user.create({
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

// User Signin
router.post("/signin", async (req: Request, res: Response) => {
  try {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error: "Invalid input format" });
    }

    const user = await prisma.user.findUnique({
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

// Get all hotels
router.get("/allHotel", async (req: Request, res: Response) => {
  try {
    const allHotel = await prisma.hotel.findMany();
    res.json({
      hotels: allHotel,
    });
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong, please try again",
    });
  }
});

// Book a hotel
router.post("/booking", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { hotelId, checkIn, checkOut } = req.body;

    if (!hotelId || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Incomplete details" });
    }

    const hotel = await prisma.hotel.findUnique({
      where: { id: parseInt(hotelId) },
    });

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        hotelId: parseInt(hotelId),
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
      },
    });

    res.status(201).json({
      message: "Booking successful",
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user's bookings
router.get("/myBooking", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const myBooking = await prisma.booking.findMany({
      where: {
        userId: user.id,
      },
      include: {
        hotel: {
          select: {
            name: true,
            location: true,
            price: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Bookings fetched successfully",
      bookings: myBooking,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
