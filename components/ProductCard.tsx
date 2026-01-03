"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/app/cart/CartContext";

export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  subtitle?: string;
};

function formatUSD(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 900);
  }

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-rose-100">
      <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold">{product.name}</div>
            {product.subtitle ? (
              <div className="mt-1 text-sm text-zinc-600">{product.subtitle}</div>
            ) : null}
          </div>
          <div className="text-sm font-semibold">{formatUSD(product.price)}</div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/menu?focus=${encodeURIComponent(product.id)}`}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
          >
            View
          </Link>

          <button
            type="button"
            onClick={handleAdd}
            className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-50"
          >
            {justAdded ? "Added ✓" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
