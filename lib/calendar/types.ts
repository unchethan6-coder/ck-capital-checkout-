/** Shared types for the economic calendar. */

/** Event importance, as published by the upstream calendar. */
export type EventImpact = "High" | "Medium" | "Low" | "Holiday";

export interface CalendarEvent {
  /** Stable id derived from the event's time, currency and title. */
  id: string;
  title: string;
  /** ISO 8601 instant. Rendered in whichever timezone the viewer picks. */
  date: string;
  /** Currency code, or "All" for global events such as OPEC meetings. */
  currency: string;
  impact: EventImpact;
  /** Consensus expectation; empty when the upstream publishes none. */
  forecast: string;
  /** Prior release value; empty when the upstream publishes none. */
  previous: string;
}

export interface CalendarPayload {
  events: CalendarEvent[];
  /** When the server last read the upstream, as an ISO instant. */
  updatedAt: string;
  /** Attribution shown next to the table. */
  source: string;
  /** False when the upstream failed and these are the last known events. */
  live: boolean;
}
