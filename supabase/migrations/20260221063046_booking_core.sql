-- Core tables for booking create flow with idempotency and auditability.

CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    meeting_type_id UUID NOT NULL,
    host_id UUID NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_name VARCHAR(200) NOT NULL,
    timezone VARCHAR(100) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(40) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS idempotency_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    key VARCHAR(255) NOT NULL,
    payload_hash VARCHAR(255) NOT NULL,
    response_body JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_id, endpoint, key)
);

CREATE TABLE IF NOT EXISTS booking_state_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    actor_type VARCHAR(40) NOT NULL,
    actor_id UUID NULL,
    from_status VARCHAR(40) NULL,
    to_status VARCHAR(40) NOT NULL,
    reason VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_tenant_host_start
    ON bookings (tenant_id, host_id, start_time);

CREATE INDEX IF NOT EXISTS idx_bookings_tenant_status_start
    ON bookings (tenant_id, status, start_time);

CREATE UNIQUE INDEX IF NOT EXISTS uq_bookings_active_slot
    ON bookings (tenant_id, host_id, start_time)
    WHERE status IN ('initiated', 'pending_payment', 'confirmed');

CREATE INDEX IF NOT EXISTS idx_audit_booking_id
    ON booking_state_audit (booking_id);
