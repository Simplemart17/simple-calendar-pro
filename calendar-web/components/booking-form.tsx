"use client";

import { useState } from "react";
import { createBooking } from "../lib/api";

function uuid(): string {
  return crypto.randomUUID();
}

export function BookingForm() {
  const [tenantId, setTenantId] = useState("");
  const [meetingTypeId, setMeetingTypeId] = useState("");
  const [hostId, setHostId] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState<string>("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Submitting booking...");

    try {
      const result = await createBooking(
        {
          tenantId,
          meetingTypeId,
          hostId,
          client: {
            email: clientEmail,
            name: "Web Client",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          startTime,
          endTime,
          metadata: {
            source: "calendar-web"
          }
        },
        uuid()
      );
      setStatus(`Booking created: ${result.bookingId} (${result.status})`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Booking failed");
    }
  }

  return (
    <form className="card" onSubmit={onSubmit}>
      <div className="grid">
        <div>
          <label htmlFor="tenantId">Tenant ID (UUID)</label>
          <input id="tenantId" value={tenantId} onChange={(e) => setTenantId(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="meetingTypeId">Meeting Type ID (UUID)</label>
          <input
            id="meetingTypeId"
            value={meetingTypeId}
            onChange={(e) => setMeetingTypeId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="hostId">Host ID (UUID)</label>
          <input id="hostId" value={hostId} onChange={(e) => setHostId(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="clientEmail">Client Email</label>
          <input
            id="clientEmail"
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="startTime">Start Time (ISO)</label>
          <input id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="endTime">End Time (ISO)</label>
          <input id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </div>
      </div>
      <button type="submit">Create Booking</button>
      <div className="result">{status}</div>
    </form>
  );
}
