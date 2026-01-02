import Link from "next/link";

type NavbarProps = {
  cartCount?: number;
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop/Menu", href: "/menu" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar({ cartCount = 0 }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-rose-100 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-semibold tracking-tight text-rose-900">Maya&apos;s</span>
          <span className="text-sm text-rose-500">Cake Cafe</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-rose-700 hover:text-rose-950"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/cart"
          className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/60 px-3 py-1.5 text-sm hover:bg-rose-50"
          aria-label={`Cart with ${cartCount} items`}
        >
          <span aria-hidden>🛒</span>
          <span className="font-medium">Cart</span>
          <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">
                {cartCount}
          </span>

        </Link>
      </div>

      {/* Mobile nav */}
      <div className="border-t border-zinc-200 md:hidden">
        <div className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-4 py-2">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-800"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
