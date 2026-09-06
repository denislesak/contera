/**
 * Generic date/time display helpers, shared by baseline and feature-scoped
 * components alike. Not specific to any feature.
 */

/** Branch-local display timezone for this prototype's fixture data (matches the -05:00 offsets baked into it). */
export const FIXTURE_TIME_ZONE = "America/Chicago";

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: FIXTURE_TIME_ZONE });
}
