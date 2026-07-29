import type { CourseProgress, ScenarioProgress, StoredProgress } from "@/types/network";

export const STORAGE_KEY = "novatech-networklab-progress-v1";

export const defaultProgress: StoredProgress = {
  scenarios: [],
  courses: [],
  theme: "dark",
};

export function readProgress(storage?: Pick<Storage, "getItem">): StoredProgress {
  if (!storage) return defaultProgress;

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    return {
      scenarios: Array.isArray(parsed.scenarios) ? parsed.scenarios : [],
      courses: Array.isArray(parsed.courses) ? parsed.courses : [],
      theme: parsed.theme === "light" ? "light" : "dark",
    };
  } catch {
    return defaultProgress;
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
