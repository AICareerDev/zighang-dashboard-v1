"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Chart.js 필수 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * 시계열 차트 컴포넌트 - 2025년 지원하기 추이를 보여줌
 */
function TimeSeriesChart() {
  // 더미 데이터: 2025년 1월부터 9월까지
  const monthLabels = [
    '2025-01', '2025-02', '2025-03', '2025-04', 
    '2025-05', '2025-06', '2025-07', '2025-08', '2025-09'
  ];

  // 지원하기 유저 수 더미 데이터 (점진적으로 증가하는 추세)
  const applyUserData = [3200, 3800, 4100, 3900, 4500, 5200, 4800, 5600, 6200];

  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: '월간 지원하기 유저',
        data: applyUserData,
        borderColor: 'rgb(59, 130, 246)', // 파란색
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        fill: true,
        tension: 0.4, // 부드러운 곡선
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // 범례 숨김 (제목에서 이미 설명)
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'white',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'white',
          callback: function(value: string | number) {
            return Number(value).toLocaleString(); // 천 단위 쉼표 추가
          }
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

/**
 * 지원하기 현황 페이지 - 7일/30일 통계와 차트 영역
 */
export function ApplyOverviewComponent() {
  return (
    <div style={{ width: "92%", maxWidth: 1200, display: "flex", gap: 64, alignItems: "stretch" }}>
      <section style={{ flex: 1, display: "flex", flexDirection: "column", gap: 32, justifyContent: "center" }}>
        <h2 style={{ fontSize: "36px", fontWeight: "800", textAlign: "center", marginBottom: "16px" }}>지원하기 7/30일 추이</h2>
        <div>
          <p style={{ fontSize: "36px", margin: "0" }}>직행의 7일 지원하기 유저는 <br/>{'{'}$value{'}'} 명입니다.</p>
          <p style={{ fontSize: "36px", margin: "0" }}>지난 주 대비 <span style={{ color: "red" }}>x%</span> 변화했습니다.</p>
        </div>
        <div>
          <p style={{ fontSize: "36px", margin: "0" }}>직행의 30일 지원하기 유저는 <br/>{'{'}$value{'}'} 명입니다.</p>
          <p style={{ fontSize: "36px", margin: "0" }}>지난 주 대비 <span style={{ color: "rgb(59, 130, 246)" }}>y%</span> 변화했습니다.</p>
        </div>
      </section>
      <section style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h2 style={{ marginBottom: 32, fontSize: "36px", fontWeight: "800", textAlign: "center" }}>지원하기 1년간 추이</h2>
        <div style={{ flex: 1, border: "1px solid rgba(255,255,255,0.2)", padding: "20px", minHeight: "200px" }}>
          <TimeSeriesChart />
        </div>
      </section>
    </div>
  );
}

/**
 * 지원하기 상세 통계 - 7일/30일 데이터를 표 형태로 보여줌
 */
export function ApplyDetailComponent() {
  // 표 헤더: 각 단계별 항목들
  const tableHeaders = ["홈 화면", "직무별", "채용공고", "지원하기", "합격"];
  
  // 실제 데이터 (현재는 샘플 데이터)
  const weeklyData = ["47,310", "47,310", "47,310", "47,310", "8"];
  const weeklyChanges = ["x%", "x%", "x%", "x%", "x%"];
  const monthlyData = ["47,310", "47,310", "47,310", "47,310", "8"];
  const monthlyChanges = ["x%", "x%", "x%", "x%", "x%"];

  // 표 레이아웃: 첫 번째 열은 라벨용, 나머지 5개 열은 데이터용
  const tableLayout: React.CSSProperties = {
    width: "90%",
    maxWidth: 1200,
    display: "grid",
    gridTemplateColumns: "160px repeat(5, 1fr)",
    columnGap: 48,
    rowGap: 28,
  };

  // 스타일 정의
  const headerStyle: React.CSSProperties = { fontWeight: 800, fontSize: "32px", textAlign: "center" };
  const labelStyle: React.CSSProperties = { fontWeight: 800, fontSize: "32px", textAlign: "center" };
  const dataStyle: React.CSSProperties = { fontSize: "28px", textAlign: "center", fontWeight: 700 };

  return (
    <div style={tableLayout}>
      {/* 표 헤더 행 */}
      <div /> {/* 빈 칸 (왼쪽 상단) */}
      {tableHeaders.map((header) => (
        <div key={header} style={headerStyle}>{header}</div>
      ))}

      {/* 7일 데이터 행 */}
      <div style={labelStyle}>7d</div>
      {weeklyData.map((value, index) => (
        <div key={`weekly-${index}`} style={dataStyle}>{value}</div>
      ))}

      {/* 7일 변화율 행 */}
      <div style={labelStyle}>증감</div>
      {weeklyChanges.map((change, index) => (
        <div key={`weekly-change-${index}`} style={dataStyle}>{change}</div>
      ))}

      {/* 구분선 (시각적 간격) */}
      <div style={{ gridColumn: "1 / -1", height: 40 }} />

      {/* 30일 데이터 행 */}
      <div style={labelStyle}>30d</div>
      {monthlyData.map((value, index) => (
        <div key={`monthly-${index}`} style={dataStyle}>{value}</div>
      ))}

      {/* 30일 변화율 행 */}
      <div style={labelStyle}>증감</div>
      {monthlyChanges.map((change, index) => (
        <div key={`monthly-change-${index}`} style={dataStyle}>{change}</div>
      ))}
    </div>
  );
}

// 캐시 관리
let cachedData: { days: number; dateText: string; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1시간

/**
 * 주차를 해당 주차의 마지막 날짜로 변환
 * 예: "2026년 5월 3주차" → "2026년 5월 21일"
 */
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
  const daysToMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek; // 일요일이면 1일, 아니면 8-요일
  firstMonday.setDate(firstDay.getDate() + daysToMonday);

  // 해당 주차의 마지막 날 (일요일)
  const targetWeekEnd = new Date(firstMonday);
  targetWeekEnd.setDate(firstMonday.getDate() + (week - 1) * 7 + 6);

  return `${targetWeekEnd.getFullYear()}년 ${targetWeekEnd.getMonth() + 1}월 ${targetWeekEnd.getDate()}일`;
}

/**
 * 생명시간 카운트다운 - API에서 실제 데이터를 가져와서 보여줌 (캐시 적용)
 */
export function LifeTimeComponent() {
  const [remainingDays, setRemainingDays] = React.useState<number>(247); // 기본값 설정
  const [targetDateText, setTargetDateText] = React.useState<string>("2026년 5월 21일에 끝납니다."); // 기본값 설정

  React.useEffect(() => {
    const fetchData = async () => {
      // 캐시 확인
      const now = Date.now();
      if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
        console.log('캐시된 데이터 사용');
        setRemainingDays(cachedData.days);
        setTargetDateText(cachedData.dateText);
        return;
      }

      try {
        console.log('API 호출 시작...');
        
        // 타임아웃 설정 (15초, 리다이렉트 허용)
        const fetchWithTimeout = (url: string) => {
          return Promise.race([
            fetch(url, {
              method: 'GET',
              redirect: 'follow',
              headers: { 'Accept': 'application/json' }
            }),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('타임아웃')), 15000)
            )
          ]);
        };

        // 두 API를 동시에 호출
        const [daysResponse, dateResponse] = await Promise.all([
          fetchWithTimeout('https://script.google.com/macros/s/AKfycbzMmyQR0J0cf57U21XbUIsFUuGSR-K3euip9fIFXpiDjTfegHIP6geTmEO134XAC8Qc/exec'),
          fetchWithTimeout('https://script.google.com/macros/s/AKfycbxq9Uy5BFq3UxnVSMrU5ZLP9mJLX9XRLK_h2R2CEUSA9DvaksJ9MX6hebbRbWeoWnqG/exec')
        ]);

        console.log('API 응답 상태:', daysResponse.status, dateResponse.status);

        if (!daysResponse.ok || !dateResponse.ok) {
          throw new Error('API 응답 오류');
        }

        const daysData = await daysResponse.json();
        const dateData = await dateResponse.json();

        console.log('받은 데이터:', { daysData, dateData });

        let newDays = 247;
        let newDateText = "2026년 5월 21일에 끝납니다.";

        // API 응답에서 값 추출
        if (daysData.metric === "doom_d_day" && typeof daysData.value === "number") {
          newDays = daysData.value;
        }

        if (dateData.metric === "doom_date" && typeof dateData.value === "string") {
          // 주차를 날짜로 변환
          const convertedDate = convertWeekToEndDate(dateData.value);
          newDateText = convertedDate + "에 끝납니다.";
        }

        // 캐시 업데이트
        cachedData = {
          days: newDays,
          dateText: newDateText,
          timestamp: now
        };

        // 상태 업데이트
        setRemainingDays(newDays);
        setTargetDateText(newDateText);

        console.log('데이터 캐시 완료:', { newDays, newDateText });
      } catch (error) {
        console.error('API 호출 실패:', error);
        // 에러 시에도 기본값이 이미 설정되어 있음
      }
    };

    // 즉시 실행 (캐시 확인)
    fetchData();
    
    // 1시간마다 데이터 갱신
    const interval = setInterval(fetchData, CACHE_DURATION);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 48, fontWeight: 800, marginBottom: 16 }}>
        직행의 수명은 <span style={{ fontWeight: 900 }}>
          {remainingDays.toLocaleString()}
        </span>일 남았습니다.
      </div>
      <div style={{ fontSize: 48, fontWeight: 800 }}>
        {targetDateText}
      </div>
    </div>
  );
}