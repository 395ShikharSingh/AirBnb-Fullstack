"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const common_1 = require("../common/common");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware_1 = require("../authMiddleware");
const router = express_1.default.Router();
const TOKEN_EXPIRATION = "1h";
// User Signup
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = common_1.signupBody.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ error: "Invalid input format" });
        }
        const existingUser = yield common_1.prisma.user.findUnique({
            where: { username: req.body.username },
        });
        if (existingUser) {
            return res.status(409).json({ error: "Username already taken" });
        }
        const newUser = yield common_1.prisma.user.create({
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
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
// User Signin
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = common_1.signinBody.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ error: "Invalid input format" });
        }
        const user = yield common_1.prisma.user.findUnique({
            where: { username: req.body.username },
        });
        if (!user || user.password !== req.body.password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, common_1.JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
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
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
// Get all hotels
router.get("/allHotel", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allHotel = yield common_1.prisma.hotel.findMany();
        res.json({
            hotels: allHotel,
        });
    }
    catch (error) {
        res.status(500).json({
            error: "Something went wrong, please try again",
        });
    }
}));
// Book a hotel
router.post("/booking", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { hotelId, checkIn, checkOut } = req.body;
        if (!hotelId || !checkIn || !checkOut) {
            return res.status(400).json({ error: "Incomplete details" });
        }
        const hotel = yield common_1.prisma.hotel.findUnique({
            where: { id: parseInt(hotelId) },
        });
        if (!hotel) {
            return res.status(404).json({ error: "Hotel not found" });
        }
        const booking = yield common_1.prisma.booking.create({
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
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
// Get user's bookings
router.get("/myBooking", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const myBooking = yield common_1.prisma.booking.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
