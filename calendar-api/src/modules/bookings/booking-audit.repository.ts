import type { SupabaseClient } from "@supabase/supabase-js";

export class BookingAuditRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async recordTransition(input: {
    bookingId: string;
    tenantId: string;
    actorType: "client" | "host" | "system";
    actorId: string | null;
    fromStatus: string | null;
    toStatus: string;
    reason: string;
  }): Promise<void> {
    const { error } = await this.supabase.from("booking_state_audit").insert({
      booking_id: input.bookingId,
      tenant_id: input.tenantId,
      actor_type: input.actorType,
      actor_id: input.actorId,
      from_status: input.fromStatus,
      to_status: input.toStatus,
      reason: input.reason
    });

    if (error) throw error;
  }
}
