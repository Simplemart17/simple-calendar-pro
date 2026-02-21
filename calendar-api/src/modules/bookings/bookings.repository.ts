import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreateBookingInput } from "./bookings.schema.js";

export interface BookingRecord {
  id: string;
  tenant_id: string;
  meeting_type_id: string;
  host_id: string;
  client_email: string;
  client_name: string;
  timezone: string;
  start_time: string;
  end_time: string;
  status: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export class BookingsRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async isSlotReserved(input: Pick<CreateBookingInput, "tenantId" | "hostId" | "startTime">): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("bookings")
      .select("id")
      .eq("tenant_id", input.tenantId)
      .eq("host_id", input.hostId)
      .eq("start_time", input.startTime)
      .in("status", ["initiated", "pending_payment", "confirmed"])
      .limit(1);

    if (error) throw error;
    return (data ?? []).length > 0;
  }

  async create(input: CreateBookingInput): Promise<BookingRecord> {
    const { data, error } = await this.supabase
      .from("bookings")
      .insert({
        tenant_id: input.tenantId,
        meeting_type_id: input.meetingTypeId,
        host_id: input.hostId,
        client_email: input.client.email,
        client_name: input.client.name,
        timezone: input.client.timezone,
        start_time: input.startTime,
        end_time: input.endTime,
        status: "pending_payment",
        metadata: input.metadata
      })
      .select("*")
      .single();

    if (error) throw error;
    return data as BookingRecord;
  }
}
