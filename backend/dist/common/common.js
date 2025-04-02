"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.prisma = exports.router = exports.hotelSchema = exports.signinBody = exports.signupBody = void 0;
const zod_1 = require("zod");
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// ✅ Zod Schema for Signup
exports.signupBody = zod_1.z.object({
    username: zod_1.z.string().email({ message: "Invalid email format" }),
    password: zod_1.z.string(),
    name: zod_1.z.string().min(2, { message: "Name should have at least 2 characters" }),
});
// ✅ Zod Schema for Signin
exports.signinBody = zod_1.z.object({
    username: zod_1.z.string().email({ message: "Invalid email format" }),
    password: zod_1.z.string(),
});
// ✅ Zod Schema for Hotel Creation
exports.hotelSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, { message: "Hotel name must be at least 3 characters" }),
    price: zod_1.z.number().positive({ message: "Price must be a positive number" }),
    location: zod_1.z.string().min(3, { message: "Location is required" }),
    description: zod_1.z.string().optional(),
});
// ✅ Initialize Express Router
exports.router = express_1.default.Router();
// ✅ Initialize Prisma Client
exports.prisma = new client_1.PrismaClient({
    log: ["query", "info", "warn", "error"], // Enable logging for debugging
});
// ✅ JWT Secret for Token Generation
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
}
exports.JWT_SECRET = process.env.JWT_SECRET;
