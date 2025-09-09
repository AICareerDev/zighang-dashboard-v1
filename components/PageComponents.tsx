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
  Legend
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

/**
 * 생명시간 카운트다운 - 목표 날짜까지 남은 일수를 계산해서 보여줌
 */
export function LifeTimeComponent() {
  // 목표 종료 날짜 (수정 가능)
  const targetEndDate = new Date("2026-07-29T00:00:00");
  
  // 오늘 날짜 (시분초 제거하고 날짜만)
  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // 하루를 밀리초로 환산 (24시간 × 60분 × 60초 × 1000밀리초)
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  
  // 남은 일수 계산 (음수가 나오면 0으로 처리)
  const remainingDays = Math.max(0, Math.ceil((targetEndDate.getTime() - todayOnly.getTime()) / millisecondsPerDay));
  
  // 목표 날짜를 년/월/일로 분리
  const targetYear = targetEndDate.getFullYear();
  const targetMonth = targetEndDate.getMonth() + 1; // JavaScript는 0부터 시작하므로 +1
  const targetDay = targetEndDate.getDate();

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 48, fontWeight: 800, marginBottom: 16 }}>
        직행의 수명은 <span style={{ fontWeight: 900 }}>{remainingDays}</span>일 남았습니다.
      </div>
      <div style={{ fontSize: 48, fontWeight: 800 }}>
        {targetYear}년 {targetMonth}월 {targetDay}일에 끝납니다.
      </div>
    </div>
  );
}