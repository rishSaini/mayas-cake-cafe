// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

type IncomingItem = { id: string; qty: number };

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const customer = {
      name: String(body?.customer?.name ?? "").trim(),
      email: String(body?.customer?.email ?? "").trim(),
      phone: String(body?.customer?.phone ?? "").trim() || null,
      note: String(body?.customer?.note ?? "").trim(),
    };

    const items: IncomingItem[] = Array.isArray(body?.items) ? body.items : [];

    if (!customer.name || !customer.email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    if (!items.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    // Basic input sanity
    for (const i of items) {
      if (!i?.id || typeof i.qty !== "number" || i.qty <= 0) {
        return NextResponse.json({ error: "Invalid cart items." }, { status: 400 });
      }
    }

    // 1) Re-price on server (never trust client totals)
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.id) }, isActive: true },
      select: { id: true, name: true, priceCents: true, imageUrl: true },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let amountCents = 0;

    const itemsSnapshot = items.map((i) => {
      const p = productMap.get(i.id);
      if (!p) throw new Error(`Invalid product in cart: ${i.id}`);
      amountCents += p.priceCents * i.qty;

      return {
        productId: p.id,
        name: p.name,
        unitPriceCents: p.priceCents,
        qty: i.qty,
        imageUrl: p.imageUrl,
      };
    });

    // 2) Create an ORDER inquiry in DB (payment pending)
    const inquiry = await prisma.inquiry.create({
      data: {
        type: "ORDER", // make sure your schema supports this value
        status: "OPEN",
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        preferredContactMethod: "EMAIL",
        message: customer.note || "Online order (Stripe Checkout)",
        paymentStatus: "PENDING",
        amountCents,
        currency: "usd",
        itemsJson: itemsSnapshot,
      },
      select: { id: true },
    });

    // 3) Create Stripe Checkout Session
    const line_items = itemsSnapshot.map((it) => ({
      quantity: it.qty,
      price_data: {
        currency: "usd",
        unit_amount: it.unitPriceCents,
        product_data: {
          name: it.name,
          images: it.imageUrl ? [it.imageUrl] : undefined,
        },
      },
    }));

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customer.email,
      line_items,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      metadata: {
        inquiryId: inquiry.id,
      },
      client_reference_id: inquiry.id,
    });

    // 4) Store Stripe session id on your inquiry (helpful for support/reconciliation)
    await prisma.inquiry.update({
      where: { id: inquiry.id },
      data: {
        stripeCheckoutSessionId: session.id,
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe session URL missing." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err?.message ?? "Checkout failed." },
      { status: 500 }
    );
  }
}
