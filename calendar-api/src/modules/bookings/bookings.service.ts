import { createHash } from "node:crypto";
import { ApiError } from "../../domain/api-error.js";
import type { CreateBookingInput } from "./bookings.schema.js";
import { BookingsRepository } from "./bookings.repository.js";
import { IdempotencyRepository } from "./idempotency.repository.js";
import { BookingAuditRepository } from "./booking-audit.repository.js";

const BOOKING_ENDPOINT = "/api/scheduling/bookings";

export class BookingsService {
  constructor(
    private readonly bookingsRepository: BookingsRepository,
    private readonly idempotencyRepository: IdempotencyRepository,
    private readonly bookingAuditRepository: BookingAuditRepository
  ) {}

  async createBooking(input: CreateBookingInput, idempotencyKey: string): Promise<Record<string, unknown>> {
    if (!idempotencyKey) {
      throw new ApiError(400, "MISSING_IDEMPOTENCY_KEY", "Idempotency-Key header is required.");
    }

    const payloadHash = this.hashPayload(input);
    const existing = await this.idempotencyRepository.get(input.tenantId, BOOKING_ENDPOINT, idempotencyKey);

    if (existing) {
      if (existing.payload_hash !== payloadHash) {
        throw new ApiError(
          409,
          "IDEMPOTENCY_PAYLOAD_MISMATCH",
          "Idempotency key was already used with a different payload."
        );
      }
      return existing.response_body;
    }

    const isReserved = await this.bookingsRepository.isSlotReserved({
      tenantId: input.tenantId,
      hostId: input.hostId,
      startTime: input.startTime
    });

    if (isReserved) {
      throw new ApiError(409, "SLOT_UNAVAILABLE", "Requested slot is no longer available.");
    }

    const booking = await this.bookingsRepository.create(input);
    await this.bookingAuditRepository.recordTransition({
      bookingId: booking.id,
      tenantId: booking.tenant_id,
      actorType: "client",
      actorId: null,
      fromStatus: null,
      toStatus: booking.status,
      reason: "booking.created"
    });

    const response = {
      bookingId: booking.id,
      status: booking.status,
      idempotencyKey,
      nextAction: "create_payment_intent"
    };

    await this.idempotencyRepository.create({
      tenantId: input.tenantId,
      endpoint: BOOKING_ENDPOINT,
      key: idempotencyKey,
      payloadHash,
      responseBody: response
    });

    return response;
  }

  private hashPayload(input: CreateBookingInput): string {
    return createHash("sha256").update(JSON.stringify(input)).digest("hex");
  }
}
