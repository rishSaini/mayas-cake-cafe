// app/checkout/page.tsx
"use client";

import { useState } from "react";
import { useCart } from "@/app/cart/CartContext";

export default function CheckoutPage() {
  const { items } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, email, phone, note },
          items: items.map((i: any) => ({ id: i.id, qty: i.quantity })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Checkout failed");

      window.location.href = data.url;
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }

  const disabled = loading || items.length === 0 || !name.trim() || !email.trim();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      <div className="mt-6 space-y-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-rose-100">
        <div>
          <label className="text-sm font-medium">Name *</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email *</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Phone (optional)</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 555-5555"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Order note (optional)</label>
          <textarea
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Pickup time, dietary notes, message on cake, etc."
            rows={4}
          />
        </div>

        <button
          onClick={startCheckout}
          disabled={disabled}
          className="mt-2 w-full rounded-xl bg-black px-4 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Redirecting..." : "Pay securely"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
