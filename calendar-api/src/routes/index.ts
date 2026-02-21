import { Router } from "express";
import { healthRouter } from "./health.route.js";
import { bookingsRouter } from "./bookings.route.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/scheduling/bookings", bookingsRouter);
