export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function createBooking(payload: Record<string, unknown>, idempotencyKey: string) {
  const response = await fetch(`${API_BASE_URL}/api/scheduling/bookings`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "idempotency-key": idempotencyKey
    },
    body: JSON.stringify(payload)
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body?.message ?? "Failed to create booking");
  }

  return body as {
    bookingId: string;
    status: string;
    idempotencyKey: string;
    nextAction: string;
  };
}
