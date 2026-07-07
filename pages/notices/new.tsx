import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { NoticeForm, NoticeFormValues } from "@/components/NoticeForm";

export default function NewNoticePage() {
  const router = useRouter();

  async function onSubmit(values: NoticeFormValues) {
    const response = await fetch("/api/notices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const data = (await response.json()) as {
        error?: string;
        errors?: Record<string, string>;
      };
      const error = new Error(data.error || "Please review the highlighted fields.") as Error & {
        fieldErrors?: Record<string, string>;
      };
      error.fieldErrors = data.errors;
      throw error;
    }

    await router.push("/");
  }

  return (
    <>
      <Head>
        <title>Create Notice | Reno Notice Board</title>
      </Head>
      <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-4">
          <Link href="/" className="text-sm font-semibold text-slate-700 underline underline-offset-2">
            Back to notices
          </Link>
        </div>
        <NoticeForm mode="create" onSubmit={onSubmit} />
      </main>
    </>
  );
}
