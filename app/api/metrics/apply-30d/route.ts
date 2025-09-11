import { NextResponse } from "next/server";

const HOST = process.env.POSTHOG_HOST!;
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID!;
const KEY = process.env.POSTHOG_PERSONAL_API_KEY!;

const HOGQL = `
SELECT
  countDistinctIf(
    person_id,
    event = 'recruitment_apply_click'
    AND timestamp >= now('Asia/Seoul') - INTERVAL 30 DAY
    AND timestamp <  now('Asia/Seoul')
  ) AS current_30d,
  countDistinctIf(
    person_id,
    event = 'recruitment_apply_click'
    AND timestamp >= now('Asia/Seoul') - INTERVAL 60 DAY
    AND timestamp <  now('Asia/Seoul') - INTERVAL 30 DAY
  ) AS previous_30d,
  IF(previous_30d = 0, NULL, round((current_30d - previous_30d) / previous_30d * 100, 2)) AS wow_pct
FROM events
WHERE event = 'recruitment_apply_click'
  AND timestamp >= now('Asia/Seoul') - INTERVAL 60 DAY
`;

export async function GET() {
  try {
    const res = await fetch(`${HOST}/api/projects/${PROJECT_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ query: { kind: "HogQLQuery", query: HOGQL } }),
    });
    
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: 500 });
    }
    
    const json = await res.json();
    const [row] = json?.results ?? [];
    const [current_30d, previous_30d, wow_pct] = row ?? [0, 0, null];
    
    return NextResponse.json(
      { current_30d, previous_30d, wow_pct },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch (error) {
    console.error('PostHog API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}