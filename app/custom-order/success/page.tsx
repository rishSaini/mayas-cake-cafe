// app/custom-order/success/page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CustomOrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 text-rose-950">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-2xl rounded-3xl bg-white/70 p-8 ring-1 ring-rose-100">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Request received 🎂</h1>
          <p className="mt-3 text-sm text-rose-800/90 md:text-base">
            Thanks! We’ll review your details and reach out soon with a quote and next steps.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/menu"
              className="rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-600"
            >
              Browse Menu
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-900 hover:bg-rose-50"
            >
              Back Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
