import { adaptMiddleware } from "../adapters/express-middleware-routes-adapter";
import { makeAuthMiddleware } from "../factories/middlewares/auth-middlewares-factory";

export const auth = adaptMiddleware(makeAuthMiddleware())