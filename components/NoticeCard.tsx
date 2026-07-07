import { Notice, NoticeCategory, NoticePriority } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type NoticeCardProps = {
    notice: Notice;
    onDelete: (id: string) => Promise<void>;
    deleting: boolean;
};

function formatCategory(category: NoticeCategory) {
    if (category === NoticeCategory.EXAM) return "Exam";
    if (category === NoticeCategory.EVENT) return "Event";
    return "General";
}

export function NoticeCard({ notice, onDelete, deleting }: NoticeCardProps) {
    const urgent = notice.priority === NoticePriority.URGENT;
    const dateLabel = new Date(notice.publishDate).toLocaleDateString();

    return (
        <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-3">
                <h2 className="line-clamp-2 text-lg font-bold text-slate-900">
                    {notice.title}
                </h2>
                {urgent ? (
                    <span className="shrink-0 rounded-full border border-red-200 bg-red-50 px-2 py-1 text-xs font-bold uppercase tracking-wide text-red-700">
                        Urgent
                    </span>
                ) : null}
            </div>

            {notice.imageUrl ? (
                <Image
                    src={notice.imageUrl}
                    alt={notice.title}
                    width={800}
                    height={320}
                    unoptimized
                    className="mb-3 h-40 w-full rounded-xl object-cover"
                />
            ) : null}

            <p className="mb-4 line-clamp-4 text-sm leading-6 text-slate-700">
                {notice.body}
            </p>

            <div className="mt-auto space-y-2 text-sm text-slate-600">
                <p>
                    <span className="font-semibold text-slate-800">Category:</span>{" "}
                    {formatCategory(notice.category)}
                </p>
                <p>
                    <span className="font-semibold text-slate-800">Publish Date:</span>{" "}
                    {dateLabel}
                </p>
            </div>

            <div className="mt-4 flex gap-2">
                <Link
                    href={`/notices/${notice.id}/edit`}
                    className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                    Edit
                </Link>
                <button
                    type="button"
                    disabled={deleting}
                    onClick={() => onDelete(notice.id)}
                    className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {deleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </article>
    );
}
