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
const common_1 = require("../common/common");
const authMiddleware_1 = require("../authMiddleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = require("express").Router();
const TOKEN_EXPIRATION = "1h";
// Manager Signup Route
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = common_1.signupBody.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ error: "Invalid input format" });
        }
        const existingManager = yield common_1.prisma.hotelManager.findUnique({
            where: { username: req.body.username },
        });
        if (existingManager) {
            return res.status(409).json({ error: "Username already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
        const manager = yield common_1.prisma.hotelManager.create({
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
    }
    catch (error) {
        console.error("Error during manager signup:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}));
// Manager Signin Route
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = common_1.signinBody.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ error: "Invalid input format" });
        }
        const existingManager = yield common_1.prisma.hotelManager.findUnique({
            where: { username: req.body.username },
        });
        if (!existingManager) {
            return res.status(404).json({ message: "Username not found" });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(req.body.password, existingManager.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Incorrect password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: existingManager.id }, common_1.JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
        return res.status(200).json({
            message: "SignIn successful",
            token,
        });
    }
    catch (error) {
        console.error("Error during manager signin:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}));
// Add Hotel Route
router.post("/addHotel", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { success } = common_1.hotelSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ error: "Invalid hotel input format" });
        }
        const newHotel = yield common_1.prisma.hotel.create({
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
    }
    catch (error) {
        console.error("Error while adding hotel:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}));
// Get Hotels Managed by Manager
router.get("/myhotel", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const myHotels = yield common_1.prisma.hotel.findMany({
            where: { managerId: user.id },
        });
        return res.status(200).json({ hotels: myHotels });
    }
    catch (error) {
        console.error("Error while fetching hotels:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}));
// Get Manager's Bookings
router.get("/managerBookings", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const managerBookings = yield common_1.prisma.booking.findMany({
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
    }
    catch (error) {
        console.error("Error fetching manager's bookings:", error);
        res.status(500).json({
            error: "Internal server error.",
        });
    }
}));
exports.default = router;
