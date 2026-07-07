import { Notice } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { NoticeCard } from "@/components/NoticeCard";
import { prisma } from "@/lib/prisma";

type HomeProps = {
  notices: Notice[];
};

export default function Home({ notices }: HomeProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this notice?");
    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingId(id);

    try {
      const response = await fetch(`/api/notices/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete notice.");
      }
      await router.replace(router.asPath);
    } catch (deleteError) {
      if (deleteError instanceof Error) {
        setError(deleteError.message);
      } else {
        setError("Failed to delete notice.");
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <Head>
        <title>Reno Notice Board</title>
      </Head>
      <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Notice Board</h1>
            <p className="text-sm text-slate-600">Urgent notices are always displayed first.</p>
          </div>
          <Link
            href="/notices/new"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-700"
          >
            Add Notice
          </Link>
        </header>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {notices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
            No notices yet. Create your first notice.
          </div>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {notices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                deleting={deletingId === notice.id}
                onDelete={handleDelete}
              />
            ))}
          </section>
        )}
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const notices = await prisma.notice.findMany({
    orderBy: [{ priority: "asc" }, { publishDate: "desc" }, { createdAt: "desc" }],
  });

  return {
    props: {
      notices: JSON.parse(JSON.stringify(notices)),
    },
  };
}
