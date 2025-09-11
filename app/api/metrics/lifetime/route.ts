import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 두 API를 동시에 호출
    const [daysResponse, dateResponse] = await Promise.all([
      fetch('https://script.google.com/macros/s/AKfycbzMmyQR0J0cf57U21XbUIsFUuGSR-K3euip9fIFXpiDjTfegHIP6geTmEO134XAC8Qc/exec'),
      fetch('https://script.google.com/macros/s/AKfycbxq9Uy5BFq3UxnVSMrU5ZLP9mJLX9XRLK_h2R2CEUSA9DvaksJ9MX6hebbRbWeoWnqG/exec')
    ]);

    if (!daysResponse.ok || !dateResponse.ok) {
      throw new Error('API 응답 오류');
    }

    const daysData = await daysResponse.json();
    const dateData = await dateResponse.json();

    let days = 247;
    let dateText = "2026년 5월 21일에 끝납니다.";

    // API 응답에서 값 추출
    if (daysData.metric === "doom_d_day" && typeof daysData.value === "number") {
      days = daysData.value;
    }

    if (dateData.metric === "doom_date" && typeof dateData.value === "string") {
      // 주차를 날짜로 변환
      const convertedDate = convertWeekToEndDate(dateData.value);
      dateText = convertedDate + "에 끝납니다.";
    }

    return NextResponse.json({
      days,
      dateText
    }, {
      headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=7200" }
    });

  } catch (error) {
    console.error('생명시간 API 호출 실패:', error);
    return NextResponse.json({
      days: 247,
      dateText: "2026년 5월 21일에 끝납니다."
    });
  }
}

function convertWeekToEndDate(weekText: string): string {
  const match = weekText.match(/(\d{4})년 (\d{1,2})월 (\d{1,2})주차/);
  if (!match) return weekText;

  const year = parseInt(match[1]);
  const month = parseInt(match[2]);
  const week = parseInt(match[3]);

  // 해당 월의 첫 번째 날
  const firstDay = new Date(year, month - 1, 1);
  
  // 첫 번째 주의 시작일 (월요일 기준)
  const firstMonday = new Date(firstDay);
  const dayOfWeek = firstDay.getDay();
  const daysToMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  firstMonday.setDate(firstDay.getDate() + daysToMonday);

  // 해당 주차의 마지막 날 (일요일)
  const targetWeekEnd = new Date(firstMonday);
  targetWeekEnd.setDate(firstMonday.getDate() + (week - 1) * 7 + 6);

  return `${targetWeekEnd.getFullYear()}년 ${targetWeekEnd.getMonth() + 1}월 ${targetWeekEnd.getDate()}일`;
}