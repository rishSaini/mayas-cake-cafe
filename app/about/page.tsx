import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function toDisplayUrl(url: string) {
    if (!url.includes("/image/upload/")) return url;
    if (url.includes("/image/upload/f_auto")) return url;
    return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
}

const promises = [
    {
        title: "100% Eggless",
        desc: "All cakes are eggless by default—perfect for vegetarians and egg-free preferences.",
        icon: "🥚🚫",
    },
    {
        title: "From Scratch",
        desc: "We bake with real ingredients and make everything from scratch—no shortcuts.",
        icon: "🥣",
    },
    {
        title: "Freshly Baked",
        desc: "Freshly baked for the best texture, flavor, and that just-baked taste.",
        icon: "🔥",
    },
    {
        title: "Made Per Order",
        desc: "Nothing sits around. Every cake is made when you order it.",
        icon: "🕒",
    },
    {
        title: "Customized Cakes",
        desc: "Themes, colors, toppers, messages—we’ll tailor it to your celebration.",
        icon: "🎨",
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 text-rose-950">
            <Navbar />

            <main>
                {/* Hero */}
                <section className="relative border-b border-rose-100">
                    <div
                        className="relative min-h-[56vh] w-full"
                        style={{
                            backgroundImage: "url(/images/hero-cake.jpg)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-rose-950/45 via-rose-900/25 to-amber-950/25" />

                        <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-center px-4 py-16">
                            <p className="mb-3 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-medium tracking-wide text-white ring-1 ring-white/25">
                                Eggless • Fresh • Made to order • Custom designs
                            </p>

                            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
                                About Maya&apos;s Cake Cafe
                            </h1>

                            <p className="mt-4 max-w-xl text-base text-white/85 md:text-lg">
                                Sweet treats made with love—crafted from scratch, baked fresh, and customized for your
                                moments.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href="/contact"
                                    className="rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-rose-600"
                                >
                                    Request a Custom Cake
                                </Link>
                                <Link
                                    href="/gallery"
                                    className="rounded-xl bg-white/20 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-white/25"
                                >
                                    See Our Work
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Promise cards */}
                <section className="mx-auto max-w-6xl px-4 py-14">
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Our Promise</h2>
                        <p className="mt-2 text-sm text-rose-800/90 md:text-base">
                            What you can expect every single time you order from us.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {promises.map((p) => (
                            <div
                                key={p.title}
                                className="rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-rose-100"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-xl text-white shadow-sm">
                                        {p.icon}
                                    </div>
                                    <div>
                                        <div className="text-base font-semibold">{p.title}</div>
                                        <div className="mt-1 text-sm text-rose-800/85">{p.desc}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 rounded-3xl bg-rose-50/70 p-5 text-sm text-rose-900 ring-1 ring-rose-100">
                        <span className="font-semibold">Note:</span> If you have allergies or dietary requests, tell
                        us in your message—we’ll do our best to accommodate.
                    </div>
                </section>

                {/* Meet Maya */}
                <section className="bg-gradient-to-b from-amber-50/60 via-white to-rose-50/60">
                    <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2">
                        <div className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl bg-zinc-100 shadow-sm ring-1 ring-zinc-200 md:max-w-sm">
                            <div className="h-72 w-full md:h-80">
                                <img
                                    src={toDisplayUrl(
                                        "https://res.cloudinary.com/deuxtg2g2/image/upload/v1767474539/IMG_9147_ur1ele.heic"
                                    )}
                                    alt="Maya"
                                    className="h-full w-full object-cover object-[50%_30%]"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Meet Maya</h2>
                            <p className="mt-3 text-rose-800/90">
                                Maya&apos;s Cake Cafe is built on one simple idea: make celebrations taste as good as they
                                look. Every cake is handcrafted with care, baked fresh, and finished with details that
                                match your theme.
                            </p>
                            <p className="mt-3 text-rose-800/90">
                                Whether you&apos;re ordering a classic flavor or a fully customized design, we make it per
                                order—so it arrives fresh and exactly how you imagined.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link
                                    href="/menu"
                                    className="rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-900 hover:bg-rose-50"
                                >
                                    Browse the Menu
                                </Link>
                                <Link
                                    href="/contact"
                                    className="rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-900 hover:bg-rose-50"
                                >
                                    Ask About a Custom Cake
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section className="mx-auto max-w-6xl px-4 pb-14">
                    <div className="rounded-3xl bg-white/80 p-8 ring-1 ring-rose-100">
                        <h3 className="text-lg font-semibold text-rose-950">How Custom Orders Work</h3>
                        <div className="mt-6 grid gap-5 md:grid-cols-4">
                            {[
                                { step: "1", title: "Share your idea", desc: "Theme, size, date, and inspiration photos." },
                                { step: "2", title: "Confirm details", desc: "We’ll align on design + pricing." },
                                { step: "3", title: "We bake & decorate", desc: "From scratch, fresh, made per order." },
                                { step: "4", title: "Pickup / delivery", desc: "Ready for your celebration." },
                            ].map((s) => (
                                <div key={s.step} className="rounded-2xl bg-rose-50/70 p-5 ring-1 ring-rose-100">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-sm font-semibold text-white">
                                            {s.step}
                                        </div>
                                        <div className="font-semibold text-rose-950">{s.title}</div>
                                    </div>
                                    <p className="mt-3 text-sm text-rose-800/90">{s.desc}</p>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/contact"
                            className="mt-7 inline-flex rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-600"
                        >
                            Start a Custom Order
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
