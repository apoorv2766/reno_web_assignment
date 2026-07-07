import { NoticeCategory, NoticePriority } from "@prisma/client";

export type NoticePayload = {
  title: string;
  body: string;
  category: NoticeCategory;
  priority: NoticePriority;
  publishDate: Date;
  imageUrl: string | null;
};

type ValidationResult =
  | { success: true; data: NoticePayload }
  | { success: false; errors: Record<string, string> };

const categories = new Set<NoticeCategory>([
  NoticeCategory.EXAM,
  NoticeCategory.EVENT,
  NoticeCategory.GENERAL,
]);

const priorities = new Set<NoticePriority>([
  NoticePriority.URGENT,
  NoticePriority.NORMAL,
]);

export function validateNoticePayload(body: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (!body || typeof body !== "object") {
    return { success: false, errors: { general: "Invalid request body." } };
  }

  const input = body as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const content = typeof input.body === "string" ? input.body.trim() : "";
  const category =
    typeof input.category === "string"
      ? (input.category.toUpperCase() as NoticeCategory)
      : undefined;
  const priority =
    typeof input.priority === "string"
      ? (input.priority.toUpperCase() as NoticePriority)
      : undefined;
  const publishDateString =
    typeof input.publishDate === "string" ? input.publishDate : "";
  const publishDate = new Date(publishDateString);
  const imageUrlRaw = typeof input.imageUrl === "string" ? input.imageUrl.trim() : "";

  if (!title) {
    errors.title = "Title is required.";
  }

  if (!content) {
    errors.body = "Body is required.";
  }

  if (!category || !categories.has(category)) {
    errors.category = "Category must be Exam, Event, or General.";
  }

  if (!priority || !priorities.has(priority)) {
    errors.priority = "Priority must be Normal or Urgent.";
  }

  if (!publishDateString || Number.isNaN(publishDate.getTime())) {
    errors.publishDate = "Publish date must be a valid date.";
  }

  if (imageUrlRaw) {
    try {
      new URL(imageUrlRaw);
    } catch {
      errors.imageUrl = "Image URL must be a valid absolute URL.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      title,
      body: content,
      category: category as NoticeCategory,
      priority: priority as NoticePriority,
      publishDate,
      imageUrl: imageUrlRaw || null,
    },
  };
}
