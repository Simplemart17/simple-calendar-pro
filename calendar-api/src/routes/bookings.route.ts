import { Router } from "express";
import { z } from "zod";
import { supabaseServer } from "../config/supabase.js";
import { createBookingSchema } from "../modules/bookings/bookings.schema.js";
import { BookingsRepository } from "../modules/bookings/bookings.repository.js";
import { IdempotencyRepository } from "../modules/bookings/idempotency.repository.js";
import { BookingAuditRepository } from "../modules/bookings/booking-audit.repository.js";
import { BookingsService } from "../modules/bookings/bookings.service.js";
import { ApiError } from "../domain/api-error.js";

const bookingsRepository = new BookingsRepository(supabaseServer);
const idempotencyRepository = new IdempotencyRepository(supabaseServer);
const bookingAuditRepository = new BookingAuditRepository(supabaseServer);
const bookingsService = new BookingsService(bookingsRepository, idempotencyRepository, bookingAuditRepository);

export const bookingsRouter = Router();

bookingsRouter.post("/", async (req, res, next) => {
  try {
    const parsed = createBookingSchema.parse(req.body);
    const idempotencyKey = req.header("Idempotency-Key") ?? "";
    const result = await bookingsService.createBooking(parsed, idempotencyKey);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, "BAD_REQUEST", error.issues.map((i) => i.message).join("; ")));
      return;
    }
    next(error);
  }
});
