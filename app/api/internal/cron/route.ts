import { NextResponse } from "next/server";

import { runDailyChecks, runWeeklySummary } from "@/lib/internal/cron";

function verifyCronSecret(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;

  const headerSecret = request.headers.get("x-cron-secret");
  if (headerSecret === secret) return true;

  return false;
}

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const job = searchParams.get("job") ?? "daily";

  try {
    if (job === "weekly") {
      const result = await runWeeklySummary();
      return NextResponse.json({ job: "weekly", ok: true, result });
    }

    if (job === "daily") {
      const result = await runDailyChecks();
      return NextResponse.json({ job: "daily", ok: true, result });
    }

    return NextResponse.json({ error: "Invalid job. Use daily or weekly." }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Cron job failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
