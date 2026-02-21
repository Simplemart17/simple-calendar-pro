import { BookingForm } from "../components/booking-form";

export default function HomePage() {
  return (
    <main className="container">
      <section className="hero">
        <h1>SimpleCalendar</h1>
        <p>Next.js frontend connected to the Express + Supabase API.</p>
      </section>

      <BookingForm />
    </main>
  );
}
