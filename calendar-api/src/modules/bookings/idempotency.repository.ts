import type { SupabaseClient } from "@supabase/supabase-js";

interface IdempotencyRecord {
  tenant_id: string;
  endpoint: string;
  key: string;
  payload_hash: string;
  response_body: Record<string, unknown>;
  created_at: string;
}

export class IdempotencyRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async get(tenantId: string, endpoint: string, key: string): Promise<IdempotencyRecord | null> {
    const { data, error } = await this.supabase
      .from("idempotency_keys")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("endpoint", endpoint)
      .eq("key", key)
      .maybeSingle();

    if (error) throw error;
    return data as IdempotencyRecord | null;
  }

  async create(record: {
    tenantId: string;
    endpoint: string;
    key: string;
    payloadHash: string;
    responseBody: Record<string, unknown>;
  }): Promise<void> {
    const { error } = await this.supabase.from("idempotency_keys").insert({
      tenant_id: record.tenantId,
      endpoint: record.endpoint,
      key: record.key,
      payload_hash: record.payloadHash,
      response_body: record.responseBody
    });

    if (error) throw error;
  }
}
