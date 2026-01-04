// app/checkout/success/page.tsx
export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Payment successful 🎉</h1>
      <p className="mt-2 text-zinc-600">
        We received your payment. You’ll get a confirmation email shortly.
      </p>
      <p className="mt-4 text-sm text-zinc-500">
        (Admin: the order gets marked PAID via the Stripe webhook.)
      </p>
    </div>
  );
}
