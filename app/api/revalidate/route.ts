import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

const SECRET = process.env.REVALIDATE_SECRET ?? "";

/**
 * Strapi webhook target: POST https://ckpropfirm.com/api/revalidate
 * Configure in Strapi admin → Settings → Webhooks.
 * Send the secret in header `x-strapi-webhook-secret` (matches REVALIDATE_SECRET).
 */
export async function POST(req: Request) {
  const provided = req.headers.get("x-strapi-webhook-secret") ?? req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!SECRET || provided !== SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    revalidatePath("/", "layout");
    revalidatePath("/blog", "layout");
    revalidatePath("/blog/[slug]", "layout");
    revalidateTag("cms", { expire: 0 });
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ revalidated: false, error: (err as Error).message }, { status: 500 });
  }
}
