import { NextResponse } from "next/server";

// 환경변수
const HOST = process.env.POSTHOG_HOST!;
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID!;
const KEY = process.env.POSTHOG_PERSONAL_API_KEY!;

// HogQL: 2025-06부터 현재까지 주별 집계 (한국시간, 월요일 기준)
const HOGQL = `
SELECT
  dateTrunc('week', timestamp, 'Asia/Seoul') AS w,
  countDistinctIf(person_id, event = 'recruitment_apply_click') AS cnt
FROM events
WHERE event = 'recruitment_apply_click'
  AND timestamp >= '2025-06-01'
GROUP BY w
ORDER BY w
`;

// 보조: 주차 라벨 생성 (MM/DD 형태)
function formatWeekLabel(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${m}/${day}`;
}

export async function GET() {
  try {
    // PostHog 호출
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
    // 결과는 보통 [["2025-06-02", 123], ...] 형태 (주차 시작일)
    const rows: Array<[string, number]> =
      json?.results?.map((r: any) => [r[0], Number(r[1])]) ?? [];

    // 2025-06-01부터 현재까지 주별 라벨 생성
    const startDate = new Date('2025-06-01');
    const now = new Date();
    const labels: string[] = [];
    const weekMap = new Map<string, string>(); // ISO 주 시작일 → 라벨 매핑
    
    // 2025-06-01이 포함된 주의 월요일부터 시작
    const firstMonday = new Date(startDate);
    const dayOfWeek = startDate.getDay();
    firstMonday.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    const current = new Date(firstMonday);
    while (current <= now) {
      const weekStart = new Date(current);
      const isoWeekStart = weekStart.toISOString().split('T')[0]; // YYYY-MM-DD
      const label = formatWeekLabel(weekStart);
      
      labels.push(label);
      weekMap.set(isoWeekStart, label);
      
      current.setDate(current.getDate() + 7); // 다음 주
    }

    // PostHog 결과를 주 시작일 → count 맵으로
    const dataMap = new Map<string, number>();
    for (const [isoWeekStart, cnt] of rows) {
      const label = weekMap.get(isoWeekStart);
      if (label) {
        dataMap.set(label, Number(cnt ?? 0));
      }
    }

    // 최종 데이터 배열 생성
    const data = labels.map((label) => dataMap.get(label) ?? 0);

    return NextResponse.json(
      { labels, data },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch (error) {
    console.error('PostHog Year API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}