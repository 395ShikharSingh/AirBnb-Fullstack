import { z } from "zod";
import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// ✅ Zod Schema for Signup
export const signupBody = z.object({
  username: z.string().email({ message: "Invalid email format" }),
  password: z.string(),
  name: z.string().min(2, { message: "Name should have at least 2 characters" }),
});

// ✅ Zod Schema for Signin
export const signinBody = z.object({
  username: z.string().email({ message: "Invalid email format" }),
  password: z.string(),
});

// ✅ Zod Schema for Hotel Creation
export const hotelSchema = z.object({
  name: z.string().min(3, { message: "Hotel name must be at least 3 characters" }),
  price: z.number().positive({ message: "Price must be a positive number" }),
  location: z.string().min(3, { message: "Location is required" }),
  description: z.string().optional(),
});

// ✅ Initialize Express Router
export const router = express.Router();

// ✅ Initialize Prisma Client
export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Enable logging for debugging
});

// ✅ JWT Secret for Token Generation
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}
export const JWT_SECRET = process.env.JWT_SECRET as string;
