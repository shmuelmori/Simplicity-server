import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { buildResponse } from '../utils/helper';



export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {

    const token = req.cookies['token'];

    if (!token) {
        const response = buildResponse(
            false, 'No token in the request', null, 'Failed to load a token', null,
        );
        res.status(403).json(response);
        return;
    };

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.body.USER_ID = id;
        next();

    } catch (err) {
        const response = buildResponse(
            false, 'Invalid token', null, 'Failed to verify token', null,
        );


        res.status(401).json(response);
        return;
    };
};
