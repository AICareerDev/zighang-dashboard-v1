import { NextResponse } from 'next/server';

async function fetchHireData(startDate: string, endDate: string) {
  const response = await fetch(
    `https://openapi.wanted.jobs/v1/stat/application/summary?start_date=${startDate}&end_date=${endDate}`,
    {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'wanted-client-id': process.env.WANTED_CLIENT_ID!,
        'wanted-client-secret': process.env.WANTED_CLIENT_SECRET!
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch hire data');
  }

  const data = await response.json();
  return data.hire || 0;
}

export async function GET() {
  try {
    const now = new Date();
    
    // 최근 7일
    const current7dEnd = new Date(now);
    const current7dStart = new Date(now);
    current7dStart.setDate(current7dStart.getDate() - 6); // 오늘 포함 7일
    
    // 전주 7일
    const previous7dEnd = new Date(current7dStart);
    previous7dEnd.setDate(previous7dEnd.getDate() - 1);
    const previous7dStart = new Date(previous7dEnd);
    previous7dStart.setDate(previous7dStart.getDate() - 6);
    
    // 최근 30일
    const current30dEnd = new Date(now);
    const current30dStart = new Date(now);
    current30dStart.setDate(current30dStart.getDate() - 29); // 오늘 포함 30일
    
    // 전 30일
    const previous30dEnd = new Date(current30dStart);
    previous30dEnd.setDate(previous30dEnd.getDate() - 1);
    const previous30dStart = new Date(previous30dEnd);
    previous30dStart.setDate(previous30dStart.getDate() - 29);

    // 병렬로 API 호출
    const [current7d, previous7d, current30d, previous30d] = await Promise.all([
      fetchHireData(current7dStart.toISOString().split('T')[0], current7dEnd.toISOString().split('T')[0]),
      fetchHireData(previous7dStart.toISOString().split('T')[0], previous7dEnd.toISOString().split('T')[0]),
      fetchHireData(current30dStart.toISOString().split('T')[0], current30dEnd.toISOString().split('T')[0]),
      fetchHireData(previous30dStart.toISOString().split('T')[0], previous30dEnd.toISOString().split('T')[0])
    ]);

    // 증감률 계산
    const calculateWowPct = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : null;
      return Math.round(((current - previous) / previous) * 100);
    };

    return NextResponse.json({
      event: "hire",
      d7: {
        current: current7d,
        previous: previous7d,
        wowPct: calculateWowPct(current7d, previous7d)
      },
      d30: {
        current: current30d,
        previous: previous30d,
        wowPct: calculateWowPct(current30d, previous30d)
      }
    });

  } catch (error) {
    console.error('Error fetching hire data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch hire data',
        event: "hire",
        d7: { current: 0, previous: 0, wowPct: null },
        d30: { current: 0, previous: 0, wowPct: null }
      },
      { status: 500 }
    );
  }
}