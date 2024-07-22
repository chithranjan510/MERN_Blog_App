import { Router } from "express";
import { GetAuthorDetail } from "../controllers/admin.controller.js";
import { authorizeMiddleware } from "../middlewares.js";

const adminRouter = Router();

adminRouter.get("/authors", authorizeMiddleware, GetAuthorDetail);

export default adminRouter;
