// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { resend, RESEND_FROM } from "@/lib/resend";
import { renderOrderConfirmationEmail } from "@/lib/orderEmail";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const body = await req.text();

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const inquiryId = session?.metadata?.inquiryId as string | undefined;

      if (!inquiryId) {
        console.warn("Missing metadata.inquiryId", session?.id);
        return NextResponse.json({ received: true });
      }

      // 1) Mark paid (only once)
      const updated = await prisma.inquiry.updateMany({
        where: { id: inquiryId, paymentStatus: { not: "PAID" } },
        data: {
          paymentStatus: "PAID",
          paidAt: new Date(),
          stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
        },
      });

      // If count=0, it was already PAID -> don't email again
      if (updated.count === 1) {
        // 2) Fetch order details
        const inquiry = await prisma.inquiry.findUnique({
          where: { id: inquiryId },
          select: { id: true, name: true, email: true, amountCents: true, itemsJson: true },
        });

        if (inquiry?.email) {
          const html = renderOrderConfirmationEmail({
            name: inquiry.name,
            inquiryId: inquiry.id,
            amountCents: inquiry.amountCents,
            itemsJson: inquiry.itemsJson,
          });

          // 3) Send email
          const { data, error } = await resend.emails.send({
            from: RESEND_FROM,
            to: [inquiry.email],
            subject: "Order confirmed ✅",
            html,
          });

          if (error) {
            console.error("Resend error:", error);
          } else {
            console.log("✅ Confirmation email sent:", data?.id);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
