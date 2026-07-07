import { NoticeCategory, NoticePriority } from "@prisma/client";
import { FormEvent, useState } from "react";

type NoticeFormValues = {
  title: string;
  body: string;
  category: NoticeCategory;
  priority: NoticePriority;
  publishDate: string;
  imageUrl: string;
};

type NoticeFormProps = {
  mode: "create" | "edit";
  initialValues?: NoticeFormValues;
  onSubmit: (values: NoticeFormValues) => Promise<void>;
};

type SubmitError = {
  message?: string;
  fieldErrors?: Record<string, string>;
};

const defaultValues: NoticeFormValues = {
  title: "",
  body: "",
  category: NoticeCategory.GENERAL,
  priority: NoticePriority.NORMAL,
  publishDate: "",
  imageUrl: "",
};

export function NoticeForm({ mode, initialValues, onSubmit }: NoticeFormProps) {
  const [values, setValues] = useState<NoticeFormValues>(initialValues || defaultValues);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    setGlobalError("");

    try {
      await onSubmit(values);
    } catch (error) {
      const fallback = "Something went wrong. Please try again.";
      if (error && typeof error === "object") {
        const submitError = error as SubmitError;
        if (submitError.fieldErrors) {
          setErrors(submitError.fieldErrors);
        }
        if (submitError.message) {
          setGlobalError(submitError.message);
          return;
        }
      }

      if (error instanceof Error) {
        setGlobalError(error.message || fallback);
      } else {
        setGlobalError(fallback);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function setField<K extends keyof NoticeFormValues>(key: K, value: NoticeFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  const heading = mode === "create" ? "Create Notice" : "Edit Notice";
  const submitLabel = mode === "create" ? "Create" : "Save Changes";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">{heading}</h1>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-slate-500"
          value={values.title}
          onChange={(e) => setField("title", e.target.value)}
          required
        />
        {errors.title ? <p className="text-xs text-red-700">{errors.title}</p> : null}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700" htmlFor="body">
          Body
        </label>
        <textarea
          id="body"
          className="min-h-36 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-slate-500"
          value={values.body}
          onChange={(e) => setField("body", e.target.value)}
          required
        />
        {errors.body ? <p className="text-xs text-red-700">{errors.body}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-slate-500"
            value={values.category}
            onChange={(e) => setField("category", e.target.value as NoticeCategory)}
          >
            <option value={NoticeCategory.EXAM}>Exam</option>
            <option value={NoticeCategory.EVENT}>Event</option>
            <option value={NoticeCategory.GENERAL}>General</option>
          </select>
          {errors.category ? <p className="text-xs text-red-700">{errors.category}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700" htmlFor="priority">
            Priority
          </label>
          <select
            id="priority"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-slate-500"
            value={values.priority}
            onChange={(e) => setField("priority", e.target.value as NoticePriority)}
          >
            <option value={NoticePriority.NORMAL}>Normal</option>
            <option value={NoticePriority.URGENT}>Urgent</option>
          </select>
          {errors.priority ? <p className="text-xs text-red-700">{errors.priority}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700" htmlFor="publishDate">
            Publish Date
          </label>
          <input
            id="publishDate"
            type="date"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-slate-500"
            value={values.publishDate}
            onChange={(e) => setField("publishDate", e.target.value)}
            required
          />
          {errors.publishDate ? <p className="text-xs text-red-700">{errors.publishDate}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700" htmlFor="imageUrl">
            Image URL (optional)
          </label>
          <input
            id="imageUrl"
            type="url"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-slate-500"
            placeholder="https://example.com/image.jpg"
            value={values.imageUrl}
            onChange={(e) => setField("imageUrl", e.target.value)}
          />
          {errors.imageUrl ? <p className="text-xs text-red-700">{errors.imageUrl}</p> : null}
        </div>
      </div>

      {globalError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {globalError}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

export type { NoticeFormValues };
