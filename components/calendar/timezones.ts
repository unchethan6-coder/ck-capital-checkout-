/**
 * Timezone helpers.
 *
 * The full IANA list comes from the runtime rather than a bundled table, so it
 * stays correct as zones change. Older engines without
 * `Intl.supportedValuesOf` fall back to a short list of trading centres.
 */

const FALLBACK_ZONES = [
  "UTC", "Europe/London", "Europe/Berlin", "Europe/Paris", "Europe/Zurich",
  "America/New_York", "America/Chicago", "America/Los_Angeles", "America/Sao_Paulo",
  "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore", "Asia/Hong_Kong", "Asia/Tokyo",
  "Australia/Sydney", "Africa/Johannesburg",
];

export function allTimeZones(): string[] {
  try {
    const supported = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf;
    if (typeof supported === "function") return supported("timeZone");
  } catch {
    // Fall through to the short list below.
  }
  return FALLBACK_ZONES;
}

/** The viewer's own zone, used as the default so times are familiar on arrival. */
export function detectTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/** "UTC+04:00" style offset for a zone, for the label beside its name. */
export function offsetLabel(zone: string, at: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "longOffset" }).formatToParts(at);
    const name = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    // Intl spells UTC itself as "GMT"; everything else as "GMT+04:00".
    const normalised = name.replace("GMT", "UTC");
    return normalised === "UTC" ? "UTC+00:00" : normalised;
  } catch {
    return "";
  }
}

/** "Asia/Dubai (UTC+04:00)" — what the picker shows for each zone. */
export function zoneLabel(zone: string, at?: Date): string {
  const offset = offsetLabel(zone, at);
  return offset ? `${zone.replace(/_/g, " ")} (${offset})` : zone.replace(/_/g, " ");
}

/** Format an event instant in the chosen zone, e.g. "8th Oct, 04:00 PM". */
export function formatEventTime(iso: string, zone: string, locale: string): { day: string; time: string } {
  const date = new Date(iso);
  try {
    const day = new Intl.DateTimeFormat(locale, { timeZone: zone, day: "numeric", month: "short" }).format(date);
    const time = new Intl.DateTimeFormat(locale, { timeZone: zone, hour: "2-digit", minute: "2-digit" }).format(date);
    return { day, time };
  } catch {
    return { day: date.toISOString().slice(0, 10), time: date.toISOString().slice(11, 16) };
  }
}

/** Weekday index (0 = Sunday) of an event in the chosen zone. */
export function weekdayIn(iso: string, zone: string): number {
  try {
    const name = new Intl.DateTimeFormat("en-US", { timeZone: zone, weekday: "short" }).format(new Date(iso));
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
  } catch {
    return new Date(iso).getUTCDay();
  }
}
