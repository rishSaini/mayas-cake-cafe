// lib/orderEmail.ts
function formatUSD(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function renderOrderConfirmationEmail(params: {
  name: string;
  inquiryId: string;
  amountCents?: number | null;
  itemsJson?: any;
}) {
  const items: Array<any> = Array.isArray(params.itemsJson) ? params.itemsJson : [];

  const rows = items
    .map((it) => {
      const lineTotal = (it.unitPriceCents ?? 0) * (it.qty ?? 0);
      return `
        <tr>
          <td style="padding:8px 0;">${it.name ?? "Item"} <span style="color:#666;">× ${it.qty ?? 1}</span></td>
          <td style="padding:8px 0; text-align:right;">${formatUSD(lineTotal)}</td>
        </tr>
      `;
    })
    .join("");

  const total = params.amountCents ?? 0;

  return `
    <div style="font-family: ui-sans-serif, system-ui; line-height:1.4;">
      <h2 style="margin:0 0 8px;">Order confirmed ✅</h2>
      <p style="margin:0 0 16px;">Hi ${params.name}, we received your payment and will start preparing your order.</p>

      <div style="border:1px solid #eee; border-radius:12px; padding:16px;">
        <div style="color:#666; font-size:12px;">Order ID</div>
        <div style="font-weight:600; margin-bottom:12px;">${params.inquiryId}</div>

        <table style="width:100%; border-collapse:collapse;">
          ${rows || `<tr><td style="padding:8px 0;">Order items</td><td></td></tr>`}
          <tr><td colspan="2"><hr style="border:none;border-top:1px solid #eee;" /></td></tr>
          <tr>
            <td style="padding:8px 0; font-weight:600;">Total</td>
            <td style="padding:8px 0; text-align:right; font-weight:600;">${formatUSD(total)}</td>
          </tr>
        </table>
      </div>

      <p style="margin:16px 0 0; color:#666; font-size:13px;">
        Reply to this email if you need to change anything.
      </p>
    </div>
  `;
}
