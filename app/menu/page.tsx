import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuClient, { Product } from "@/components/menu/MenuClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MenuPage() {
  const rows = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ popularity: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      priceCents: true,
      category: true,
      imageUrl: true,
      popularity: true,
      badge: true,
    },
  });

  const products: Product[] = rows.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number((p.priceCents / 100).toFixed(2)),
    category: p.category as any, // UI expects specific strings; keep DB values consistent
    imageUrl: p.imageUrl,
    popularity: p.popularity ?? 0,
    badge: p.badge ?? undefined,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 text-rose-950">
      <Navbar />
      <main>
        <MenuClient initialProducts={products} />
      </main>
      <Footer />
    </div>
  );
}
