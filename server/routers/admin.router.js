import { Router } from "express";
import { GetAuthorDetail } from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.get("/authors", GetAuthorDetail);

export default adminRouter;
