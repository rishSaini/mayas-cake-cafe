import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

const ADMIN_COOKIE = "mcc_admin";

function sha256HexNode(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

async function loginAction(formData: FormData) {
  "use server";

  const next = String(formData.get("next") ?? "/admin/inquiries");
  const password = String(formData.get("password") ?? "");

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) redirect(`/admin/login?err=missing_env&next=${encodeURIComponent(next)}`);

  if (password !== adminPassword) {
    redirect(`/admin/login?err=bad_password&next=${encodeURIComponent(next)}`);
  }

  const value = sha256HexNode(adminPassword);
  (await cookies()).set(ADMIN_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // 14 days
    maxAge: 60 * 60 * 24 * 14,
  });

  redirect(next);
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { err?: string; next?: string };
}) {
  const err = searchParams.err;
  const next = searchParams.next ?? "/admin/inquiries";

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
      <p className="mt-2 text-sm text-zinc-600">Enter the admin password to continue.</p>

      {err ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err === "bad_password"
            ? "Wrong password."
            : err === "missing_env"
              ? "ADMIN_PASSWORD is not set in your environment."
              : "Login error."}
        </div>
      ) : null}

      <form action={loginAction} className="mt-6 space-y-3">
        <input type="hidden" name="next" value={next} />
        <input
          name="password"
          type="password"
          required
          placeholder="Admin password"
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
