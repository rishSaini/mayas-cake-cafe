import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import GalleryClient, { GalleryItem } from "@/components/gallery/GalleryClient";

export const dynamic = "force-dynamic"; // during dev so you always see DB changes
export const revalidate = 0;

export default async function GalleryPage() {
  const rows = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      imageUrl: true,
      category: true,
      createdAt: true,
    },
  });

  const images: GalleryItem[] = rows.map((r) => ({
    id: r.id,
    title: r.title ?? "Untitled",
    imageUrl: r.imageUrl,
    category: r.category,
    createdAt: r.createdAt,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 text-rose-950">
      <Navbar />
      <main>
        <GalleryClient items={images} />
      </main>
      <Footer />
    </div>
  );
}
