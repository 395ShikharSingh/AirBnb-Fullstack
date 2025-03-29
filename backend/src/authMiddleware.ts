import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "./common/common";
import jwt from "jsonwebtoken";

interface authenticatedRequest extends Request {
    user? :{
        id: number;
        role: string;
    };
}

export const authMiddleware= (req:authenticatedRequest, res: Response, next:NextFunction) =>{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) {
        return res.status(401).json({
            error: "token not found"
        });
    }
    try{
        const decoded= jwt.verify(token, JWT_SECRET) as {id?: number, role?: string}
        if (!decoded || !decoded.id || !decoded.role) {
            return res.status(403).json({ error: "Invalid token format" });
        }

        req.user= {
            id: decoded.id,
            role: decoded.role
        }

        next();
    } catch(error) {
        return res.status(403).json({error: "Invalid or expired token"})
    }
}