import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function updateAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "OPEN");
  const noteRaw = formData.get("resolutionNote");
  const note = noteRaw ? String(noteRaw).trim() : "";

  if (!id) return;

  await prisma.inquiry.update({
    where: { id },
    data: {
      status: status === "RESOLVED" ? "RESOLVED" : "OPEN",
      resolvedAt: status === "RESOLVED" ? new Date() : null,
      resolutionNote: note.length ? note : null,
    },
  });

  revalidatePath(`/admin/inquiries/${id}`);
  revalidatePath("/admin/inquiries");
  redirect(`/admin/inquiries/${id}`);
}

export default async function InquiryDetailPage({ params }: { params: { id: string } }) {
  const inquiry = await prisma.inquiry.findUnique({ where: { id: params.id } });
  if (!inquiry) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/inquiries" className="text-sm font-semibold text-zinc-700 hover:text-zinc-950">
          ← Back to inquiries
        </Link>
        <div className="text-sm text-zinc-500">ID: {inquiry.id}</div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
        <h1 className="text-xl font-semibold">{inquiry.name}</h1>
        <div className="mt-2 text-sm text-zinc-700">
          {inquiry.email}
          {inquiry.phone ? ` • ${inquiry.phone}` : ""}
        </div>

        <div className="mt-4">
          <div className="text-sm font-semibold text-zinc-900">Message</div>
          <div className="mt-2 whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-800">
            {inquiry.message ?? "—"}
          </div>
        </div>

        <form action={updateAction} className="mt-6 grid gap-3">
          <input type="hidden" name="id" value={inquiry.id} />

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-sm font-semibold text-zinc-900">
              Status
              <select
                name="status"
                defaultValue={inquiry.status}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm"
              >
                <option value="OPEN">OPEN</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </label>

            <label className="text-sm font-semibold text-zinc-900">
              Resolution note
              <input
                name="resolutionNote"
                defaultValue={inquiry.resolutionNote ?? ""}
                placeholder="What did we do / what did we tell them?"
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm"
              />
            </label>
          </div>

          <button className="mt-2 w-fit rounded-xl bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
