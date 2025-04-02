"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const common_1 = require("./common/common");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            error: "token not found"
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, common_1.JWT_SECRET);
        if (!decoded || !decoded.id || !decoded.role) {
            return res.status(403).json({ error: "Invalid token format" });
        }
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        next();
    }
    catch (error) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};
exports.authMiddleware = authMiddleware;
