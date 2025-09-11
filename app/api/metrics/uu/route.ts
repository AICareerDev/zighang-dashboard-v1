import { NextResponse } from "next/server";

const HOST = process.env.POSTHOG_HOST || "https://us.posthog.com";
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID!;
const KEY = process.env.POSTHOG_PERSONAL_API_KEY!;

// HogQL 생성기: 주어진 이벤트에 대해 최근 N일/이전 N일 유니크 유저 및 증감률
const hogql = (event: string, days: number) => `
SELECT
  countDistinctIf(person_id,
    event = '${event}'
    AND timestamp >= now('Asia/Seoul') - INTERVAL ${days} DAY
    AND timestamp <  now('Asia/Seoul')
  ) AS current_${days}d,
  countDistinctIf(person_id,
    event = '${event}'
    AND timestamp >= now('Asia/Seoul') - INTERVAL ${days * 2} DAY
    AND timestamp <  now('Asia/Seoul') - INTERVAL ${days} DAY
  ) AS previous_${days}d,
  IF(previous_${days}d = 0, NULL,
     round((current_${days}d - previous_${days}d) / previous_${days}d * 100, 2)
  ) AS wow_pct_${days}d
FROM events
WHERE event = '${event}'
  AND timestamp >= now('Asia/Seoul') - INTERVAL ${days * 2} DAY
`;

async function run(query: string) {
  const res = await fetch(`${HOST}/api/projects/${PROJECT_ID}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const event = url.searchParams.get("event");
  if (!event) {
    return NextResponse.json({ error: "Missing ?event=" }, { status: 400 });
  }

  try {
    const [d7, d30] = await Promise.all([
      run(hogql(event, 7)),
      run(hogql(event, 30)),
    ]);

    const row7 = d7?.results?.[0] ?? [];
    const row30 = d30?.results?.[0] ?? [];

    const [current7, previous7, wow7] = row7;
    const [current30, previous30, wow30] = row30;

    return NextResponse.json(
      {
        event,
        d7: {
          current: Number(current7 || 0),
          previous: Number(previous7 || 0),
          wowPct: wow7 == null ? null : Number(wow7),
        },
        d30: {
          current: Number(current30 || 0),
          previous: Number(previous30 || 0),
          wowPct: wow30 == null ? null : Number(wow30),
        },
      },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch (err) {
    console.error("UU metrics API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

