import { z } from "zod";

export const bookingClientSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(200),
  timezone: z.string().min(1).max(100)
});

export const createBookingSchema = z.object({
  tenantId: z.string().uuid(),
  meetingTypeId: z.string().uuid(),
  hostId: z.string().uuid(),
  client: bookingClientSchema,
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  metadata: z.record(z.unknown()).optional().default({})
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
