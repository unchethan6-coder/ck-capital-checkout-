import { getSnapshot, prime, subscribe } from "@/lib/market/hub";
import type { StreamMessage } from "@/lib/market/types";

/**
 * Server-sent events feed for the symbol specifications page.
 *
 * Clients receive one `snapshot` on connect and then `patch` messages carrying
 * only the instruments that moved, which keeps the steady-state payload at a
 * few hundred bytes per tick. A comment heartbeat every 15s stops proxies from
 * reaping an idle connection out of hours.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// Streaming responses must never be collected by a CDN.
export const fetchCache = "force-no-store";

const HEARTBEAT_MS = 15_000;

export async function GET(request: Request) {
  await prime();

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;

      const send = (message: StreamMessage) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(message)}\n\n`));
        } catch {
          // Controller already torn down by an aborted request.
          cleanup();
        }
      };

      const unsubscribe = subscribe((quotes) => {
        send({ type: "patch", quotes, serverTime: Date.now() });
      });

      const heartbeat = setInterval(() => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          cleanup();
        }
      }, HEARTBEAT_MS);

      function cleanup() {
        if (closed) return;
        closed = true;
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // Already closed — nothing to do.
        }
      }

      request.signal.addEventListener("abort", cleanup);

      send({ type: "snapshot", quotes: getSnapshot(), serverTime: Date.now() });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // Tell nginx-style proxies not to buffer the stream.
      "X-Accel-Buffering": "no",
    },
  });
}
