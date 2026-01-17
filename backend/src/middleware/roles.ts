import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const authorize = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user?.role} is not authorized to access this route`,
            });
        }
        next();
    };
};
