import type { Category } from "@/components/menu/MenuClient";

export type PriceKey = "all" | "0-50" | "50-100";

type Props = {
  category: Category | "All";
  setCategory: (v: Category | "All") => void;

  priceKey: PriceKey;
  setPriceKey: (v: PriceKey) => void;
};

// Categories you want (+ All)
const categories: Array<Category | "All"> = ["All", "Cakes", "Cupcakes", "Custom Made"];

export default function FiltersSidebar({
  category,
  setCategory,
  priceKey,
  setPriceKey,
}: Props) {
  return (
    <aside className="rounded-3xl bg-white/70 p-5 ring-1 ring-rose-100">
      <div className="text-sm font-semibold text-rose-950">Filters</div>

      {/* Category */}
      <div className="mt-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-rose-700">
          Category
        </div>
        <div className="mt-3 space-y-2">
          {categories.map((c) => (
            <label
              key={c}
              className="flex cursor-pointer items-center gap-3 text-sm text-rose-900"
            >
              <input
                type="radio"
                name="category"
                checked={category === c}
                onChange={() => setCategory(c)}
                className="h-4 w-4 accent-rose-500"
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mt-6 border-t border-rose-100 pt-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-rose-700">
          Price Range
        </div>

        <div className="mt-3 space-y-2">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-rose-900">
            <input
              type="radio"
              name="price"
              checked={priceKey === "all"}
              onChange={() => setPriceKey("all")}
              className="h-4 w-4 accent-rose-500"
            />
            All
          </label>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-rose-900">
            <input
              type="radio"
              name="price"
              checked={priceKey === "0-50"}
              onChange={() => setPriceKey("0-50")}
              className="h-4 w-4 accent-rose-500"
            />
            $0 – $50
          </label>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-rose-900">
            <input
              type="radio"
              name="price"
              checked={priceKey === "50-100"}
              onChange={() => setPriceKey("50-100")}
              className="h-4 w-4 accent-rose-500"
            />
            $50 – $100
          </label>
        </div>
      </div>
    </aside>
  );
}
