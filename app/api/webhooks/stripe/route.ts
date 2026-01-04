// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const body = await req.text(); // must be raw body

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      const inquiryId = session?.metadata?.inquiryId as string | undefined;
      if (!inquiryId) {
        console.warn("checkout.session.completed missing metadata.inquiryId", session?.id);
        return NextResponse.json({ received: true });
      }

      // idempotent update (safe if webhook retries)
      await prisma.inquiry.updateMany({
        where: {
          id: inquiryId,
          paymentStatus: { not: "PAID" },
        },
        data: {
          paymentStatus: "PAID",
          paidAt: new Date(),
          stripePaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
        },
      });

      console.log("✅ Marked PAID:", inquiryId, session.id);
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as any;
      const inquiryId = session?.metadata?.inquiryId as string | undefined;
      if (inquiryId) {
        await prisma.inquiry.updateMany({
          where: { id: inquiryId, paymentStatus: "PENDING" },
          data: { paymentStatus: "CANCELED" },
        });
        console.log("⏳ Session expired, marked CANCELED:", inquiryId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
