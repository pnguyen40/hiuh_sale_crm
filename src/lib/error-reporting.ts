/**
 * HIUH Operation Portal - Client-side Error Boundary Reporter
 */
export function reportAppError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  console.error("[HIUH Operation Portal Error]", error, context);
}
