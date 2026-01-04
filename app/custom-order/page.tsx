// app/custom-order/page.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomOrderForm from "@/components/custom-order/CustomOrderForm";

export const dynamic = "force-dynamic";

export default function CustomOrderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 text-rose-950">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Custom Cake Order</h1>
          <p className="mt-3 text-sm text-rose-800/90 md:text-base">
            Tell us what you’re celebrating and we’ll reach out with a quote + next steps.
          </p>
        </div>

        <div className="mt-8">
          <CustomOrderForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
