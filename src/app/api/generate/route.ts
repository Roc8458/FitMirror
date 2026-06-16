import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getTryOnProvider } from "@/lib/provider";

const jobs = new Map<string, { id: string; status: string; progress: number; providerJobId?: string }>();

export async function POST(request: Request) {
  const input = await request.json();
  const cacheKey = createHash("sha256").update(JSON.stringify(input)).digest("hex").slice(0, 18);
  const cached = jobs.get(cacheKey);
  if (cached) return NextResponse.json({ ...cached, cached: true });
  let result;
  try {
    result = await getTryOnProvider().create(input);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: error instanceof Error ? error.message : "生成服务不可用" }, { status: 503 });
    }
    result = { providerJobId: `mock_${crypto.randomUUID()}`, status: "queued" as const };
  }
  const job = { id: cacheKey, status: result.status, progress: result.status === "completed" ? 100 : 8, providerJobId: result.providerJobId };
  jobs.set(cacheKey, job);
  return NextResponse.json(job, { status: 202 });
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  const job = id ? jobs.get(id) : undefined;
  if (!job) return NextResponse.json({ error: "任务不存在" }, { status: 404 });
  if (job.status !== "completed") {
    job.progress = Math.min(100, job.progress + 24);
    if (job.progress >= 100) job.status = "completed";
  }
  return NextResponse.json(job);
}
