import { Notice } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { NoticeForm, NoticeFormValues } from "@/components/NoticeForm";
import { prisma } from "@/lib/prisma";

type EditNoticeProps = {
  notice: Notice;
};

function toInputDate(value: string | Date) {
  const date = new Date(value);
  return date.toISOString().split("T")[0];
}

export default function EditNoticePage({ notice }: EditNoticeProps) {
  const router = useRouter();

  async function onSubmit(values: NoticeFormValues) {
    const response = await fetch(`/api/notices/${notice.id}`, {
      method: "PUT",
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
        <title>Edit Notice | Reno Notice Board</title>
      </Head>
      <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-4">
          <Link href="/" className="text-sm font-semibold text-slate-700 underline underline-offset-2">
            Back to notices
          </Link>
        </div>
        <NoticeForm
          mode="edit"
          initialValues={{
            title: notice.title,
            body: notice.body,
            category: notice.category,
            priority: notice.priority,
            publishDate: toInputDate(notice.publishDate),
            imageUrl: notice.imageUrl || "",
          }}
          onSubmit={onSubmit}
        />
      </main>
    </>
  );
}

export async function getServerSideProps(context: { params?: { id?: string } }) {
  const id = context.params?.id;
  if (!id || typeof id !== "string") {
    return { notFound: true };
  }

  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) {
    return { notFound: true };
  }

  return {
    props: {
      notice: JSON.parse(JSON.stringify(notice)),
    },
  };
}
