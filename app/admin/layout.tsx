import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/admin/inquiries" className="font-semibold">
            Admin • Maya&apos;s Cake Cafe
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link className="text-zinc-700 hover:text-zinc-950" href="/admin/inquiries">
              Inquiries
            </Link>
            <a className="text-zinc-700 hover:text-zinc-950" href="/admin/logout">
              Logout
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
