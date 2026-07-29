import type { CourseProgress, ScenarioProgress, StoredProgress } from "@/types/network";

export const STORAGE_KEY = "novatech-networklab-progress-v1";

export const defaultProgress: StoredProgress = {
  scenarios: [],
  courses: [],
  theme: "dark",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function isScore(value: unknown): value is number {
  return isSafeInteger(value) && value <= 100;
}

function sanitizeScenarioProgress(value: unknown): ScenarioProgress | null {
  if (
    !isRecord(value) ||
    typeof value.scenarioId !== "string" ||
    value.scenarioId.length === 0 ||
    !isScore(value.bestScore) ||
    typeof value.completed !== "boolean" ||
    !isSafeInteger(value.bestDurationSeconds) ||
    !isSafeInteger(value.attempts) ||
    typeof value.updatedAt !== "string"
  ) {
    return null;
  }

  return {
    scenarioId: value.scenarioId,
    bestScore: value.bestScore,
    completed: value.completed,
    bestDurationSeconds: value.bestDurationSeconds,
    attempts: value.attempts,
    updatedAt: value.updatedAt,
  };
}

function sanitizeCourseProgress(value: unknown): CourseProgress | null {
  if (
    !isRecord(value) ||
    typeof value.courseId !== "string" ||
    value.courseId.length === 0 ||
    !isScore(value.bestScore) ||
    typeof value.completed !== "boolean" ||
    !isSafeInteger(value.attempts) ||
    typeof value.updatedAt !== "string"
  ) {
    return null;
  }

  return {
    courseId: value.courseId,
    bestScore: value.bestScore,
    completed: value.completed,
    attempts: value.attempts,
    updatedAt: value.updatedAt,
  };
}

export function sanitizeProgress(value: unknown): StoredProgress {
  if (!isRecord(value)) return { ...defaultProgress };

  const scenarios = Array.isArray(value.scenarios)
    ? value.scenarios
        .map(sanitizeScenarioProgress)
        .filter((item): item is ScenarioProgress => item !== null)
    : [];
  const courses = Array.isArray(value.courses)
    ? value.courses
        .map(sanitizeCourseProgress)
        .filter((item): item is CourseProgress => item !== null)
    : [];

  return {
    scenarios,
    courses,
    theme: value.theme === "light" ? "light" : "dark",
  };
}

export function readProgress(storage?: Pick<Storage, "getItem">): StoredProgress {
  if (!storage) return { ...defaultProgress };

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultProgress };
    return sanitizeProgress(JSON.parse(raw) as unknown);
  } catch {
    return { ...defaultProgress };
  }
}

export function writeProgress(progress: StoredProgress, storage?: Pick<Storage, "setItem">): boolean {
  if (!storage) return false;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function mergeScenarioProgress(
  progress: StoredProgress,
  update: Omit<ScenarioProgress, "updatedAt">,
): StoredProgress {
  const previous = progress.scenarios.find((item) => item.scenarioId === update.scenarioId);
  const next: ScenarioProgress = {
    ...update,
    bestScore: Math.max(previous?.bestScore ?? 0, update.bestScore),
    bestDurationSeconds:
      previous?.bestDurationSeconds && previous.bestDurationSeconds < update.bestDurationSeconds
        ? previous.bestDurationSeconds
        : update.bestDurationSeconds,
    attempts: Math.max(previous?.attempts ?? 0, update.attempts),
    completed: Boolean(previous?.completed || update.completed),
    updatedAt: new Date().toISOString(),
  };

  return {
    ...progress,
    scenarios: [...progress.scenarios.filter((item) => item.scenarioId !== update.scenarioId), next],
  };
}

export function mergeCourseProgress(
  progress: StoredProgress,
  update: Omit<CourseProgress, "updatedAt">,
): StoredProgress {
  const previous = progress.courses.find((item) => item.courseId === update.courseId);
  const next: CourseProgress = {
    ...update,
    bestScore: Math.max(previous?.bestScore ?? 0, update.bestScore),
    attempts: Math.max(previous?.attempts ?? 0, update.attempts),
    completed: Boolean(previous?.completed || update.completed),
    updatedAt: new Date().toISOString(),
  };

  return {
    ...progress,
    courses: [...progress.courses.filter((item) => item.courseId !== update.courseId), next],
  };
}
