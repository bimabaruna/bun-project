import type { MiddlewareHandler } from "hono";
import { UserService } from "../service/user-service";
import { verify } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../application/database"; // Adjust the path if needed

const JWT_SECRET = process.env.JWT_SECRET || 'JWT_SECRET';

export const authMiddleware: MiddlewareHandler = async (c, next) => {
    const token = c.req.header('Authorization');

    if (!token) {
        throw new HTTPException(401, {
            message: 'Unauthorized: Authorization token is required',
        });
    }

    try {
        // 1. Verify the token's signature and decode the payload
        const payload = await verify(token, JWT_SECRET);

        // 2. The payload is now trusted. Get the user ID from it.
        const userId = typeof payload.id === "number" ? payload.id : Number(payload.id);

        // 3. Fetch the fresh user from the DB to ensure they still exist, aren't banned, etc.
        const user = await prismaClient.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new HTTPException(401, { message: 'User not found' });
        }

        // Attach user to context for downstream handlers
        c.set('user', user);
        await next();
    } catch (error) {
        // This will catch expired tokens, invalid signatures, etc.
        throw new HTTPException(401, { message: 'Invalid token' });
    }
};
