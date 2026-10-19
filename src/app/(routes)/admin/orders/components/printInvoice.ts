import { formatPrice } from "@/lib/formatPrice";
import { formatPaymentMethod, type Order } from "../types";
import { getCustomerEmail, getCustomerName, getItemName, capitalize } from "./orderHelpers";

const escapeHtml = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

/**
 * Opens a printable invoice for one order in a new window and triggers the print dialog.
 * Returns false when the browser blocked the pop-up.
 */
export function printOrderInvoice(order: Order): boolean {
  const win = window.open("", "_blank", "width=900,height=1000");
  if (!win) return false;

  const address = order.shippingAddress;
  const logo = `${window.location.origin}/images/silsila-logo.png`;

  const rows = (order.items || [])
    .map(
      (item, index) => `
        <tr>
          <td>
            <div class="name">${escapeHtml(getItemName(item, index))}</div>
            <div class="muted">SKU: ${escapeHtml(item.sku)}</div>
          </td>
          <td>${escapeHtml(item.size)}${item.color ? ` / ${escapeHtml(item.color)}` : ""}</td>
          <td class="c">${escapeHtml(item.quantity)}</td>
          <td class="r">${escapeHtml(formatPrice(item.price))}</td>
          <td class="r">${escapeHtml(formatPrice(item.price * item.quantity))}</td>
        </tr>`
    )
    .join("");

  const summaryRow = (label: string, value: string, cls = "") =>
    `<tr class="${cls}"><td>${escapeHtml(label)}</td><td class="r">${escapeHtml(value)}</td></tr>`;

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Invoice #${escapeHtml(order.orderNumber)} · Silsila</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1c1917; margin: 0; padding: 40px; font-size: 13px; }
  .top { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1c1917; padding-bottom: 20px; margin-bottom: 24px; }
  .top img { height: 56px; }
  h1 { font-size: 22px; margin: 0 0 4px; letter-spacing: 0.04em; text-transform: uppercase; }
  .muted { color: #78716c; font-size: 12px; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
  .box { border: 1px solid #e7e5e4; border-radius: 8px; padding: 12px 14px; }
  .box h3 { margin: 0 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #78716c; }
  .box p { margin: 2px 0; }
  table.items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  table.items th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #78716c; background: #fafaf9; padding: 8px 10px; border-bottom: 1px solid #e7e5e4; }
  table.items td { padding: 10px; border-bottom: 1px solid #f5f5f4; vertical-align: top; }
  .name { font-weight: 600; }
  .c { text-align: center; }
  .r { text-align: right; }
  table.summary { margin-left: auto; width: 280px; border-collapse: collapse; }
  table.summary td { padding: 5px 0; }
  table.summary tr.total td { border-top: 1px solid #1c1917; padding-top: 10px; font-weight: 700; font-size: 15px; }
  .foot { margin-top: 40px; text-align: center; color: #a8a29e; font-size: 11px; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <div class="top">
    <img src="${escapeHtml(logo)}" alt="Silsila" onerror="this.style.display='none'" />
    <div class="r">
      <h1>Invoice</h1>
      <div>#${escapeHtml(order.orderNumber)}</div>
      <div class="muted">${escapeHtml(formatDate(order.createdAt))}</div>
    </div>
  </div>

  <div class="grid">
    <div class="box">
      <h3>Billed to</h3>
      <p><strong>${escapeHtml(getCustomerName(order))}</strong></p>
      <p>${escapeHtml(getCustomerEmail(order))}</p>
      <p>${escapeHtml(address?.phone)}</p>
    </div>
    <div class="box">
      <h3>Ship to</h3>
      <p>${escapeHtml(address?.fullName)}</p>
      <p>${escapeHtml(address?.address)}</p>
      <p>${escapeHtml([address?.city, address?.state, address?.zipCode].filter(Boolean).join(", "))}</p>
      <p>${escapeHtml(address?.country)}</p>
    </div>
    <div class="box">
      <h3>Payment</h3>
      <p>${escapeHtml(formatPaymentMethod(order.paymentMethod))}</p>
      <p class="muted">Status: ${escapeHtml(capitalize(order.paymentStatus) || "Unknown")}</p>
      <p class="muted">Order: ${escapeHtml(capitalize(order.orderStatus))}</p>
    </div>
  </div>

  <table class="items">
    <thead><tr><th>Product</th><th>Size / Colour</th><th class="c">Qty</th><th class="r">Price</th><th class="r">Total</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>

  <table class="summary">
    ${summaryRow("Subtotal", formatPrice(order.subtotal))}
    ${summaryRow("Shipping", formatPrice(order.shippingCost))}
    ${summaryRow("Tax", formatPrice(order.tax))}
    ${order.discount > 0 ? summaryRow("Discount", `-${formatPrice(order.discount)}`) : ""}
    ${summaryRow("Total", formatPrice(order.total), "total")}
  </table>

  <div class="foot">Thank you for shopping with Silsila.</div>
  <script>window.addEventListener('load', function () { setTimeout(function () { window.focus(); window.print(); }, 250); });</script>
</body>
</html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
  return true;
}
