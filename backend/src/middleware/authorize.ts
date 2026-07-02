import type { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/user";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        name: string;
        email: string;
        role: string;
        isActive: boolean;
      };
    }
  }
}

// Role-based access control middleware
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        message: "Not authorized to access this resource",
        requiredRoles: allowedRoles,
        userRole
      });
      return;
    }

    next();
  };
};
