import type { MiddlewareHandler } from "hono";
import { UserService } from "../service/user-service";
import { HTTPException } from "hono/http-exception";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
    const token = c.req.header('Authorization');

    if (!token) {
        throw new HTTPException(401, {
            message: 'Unauthorized: Authorization token is required',
        });
    }

    try {
        const user = await UserService.get(token);

        if (!user) {
            throw new HTTPException(401, {
                message: 'Unauthorized: Invalid token',
            });
        }

        c.set('user', user);
        await next();
    } catch (err) {

        throw new HTTPException(401, {
            message: 'Unauthorized: Token validation failed',
        });
    }
};
