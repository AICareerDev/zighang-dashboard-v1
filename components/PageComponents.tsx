"use client";

import React from "react";
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
} from "chart.js";
import { Line } from "react-chartjs-2";

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
 * 시계열 차트 컴포넌트 - 실제 지원하기 월별 추이를 보여줌
 */
function TimeSeriesChart() {
  const [chartData, setChartData] = React.useState<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      borderWidth: number;
      pointRadius: number;
      pointBackgroundColor: string;
      fill: boolean;
      tension: number;
    }>;
  } | null>(null);

  React.useEffect(() => {
    fetch("/api/metrics/apply-year")
      .then((r) => r.json())
      .then((response: { labels: string[]; data: number[] }) => {
        setChartData({
          labels: response.labels,
          datasets: [
            {
              label: "월간 지원하기 유저",
              data: response.data,
              borderColor: "rgb(59, 130, 246)", // 파란색
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderWidth: 3,
              pointRadius: 6,
              pointBackgroundColor: "rgb(59, 130, 246)",
              fill: true,
              tension: 0.4, // 부드러운 곡선
            },
          ],
        });
      })
      .catch(console.error);
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // 범례 숨김 (제목에서 이미 설명)
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
          callback: function (value: string | number) {
            return Number(value).toLocaleString(); // 천 단위 쉼표 추가
          },
        },
      },
    },
  };

  if (!chartData) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "white" }}>로딩...</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

/**
 * 지원하기 현황 페이지 - 7일/30일 통계와 차트 영역
 */
export function ApplyOverviewComponent() {
  const [applyData30d, setApplyData30d] = React.useState<{
    current_30d: number;
    previous_30d: number;
    wow_pct: number | null;
  } | null>(null);

  const [applyData7d, setApplyData7d] = React.useState<{
    current_7d: number;
    previous_7d: number;
    wow_pct: number | null;
  } | null>(null);

  React.useEffect(() => {
    // 30일 데이터
    fetch("/api/metrics/apply-30d")
      .then((r) => r.json())
      .then(setApplyData30d)
      .catch(console.error);

    // 7일 데이터
    fetch("/api/metrics/apply-7d")
      .then((r) => r.json())
      .then(setApplyData7d)
      .catch(console.error);
  }, []);

  const formatPercentage = (pct: number | null) => {
    if (pct === null) return "-";
    const sign = pct >= 0 ? "+" : "";
    return `${sign}${pct}%`;
  };

  const getPercentageColor = (pct: number | null) => {
    if (pct === null) return "white";
    return pct >= 0 ? "red" : "rgb(59, 130, 246)"; // +면 빨간색, -면 파란색
  };

  return (
    <div
      style={{
        width: "92%",
        maxWidth: 1200,
        display: "flex",
        gap: 64,
        alignItems: "stretch",
      }}
    >
      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 32,
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            fontSize: "36px",
            fontWeight: "800",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          지원하기 7/30일 추이
        </h2>
        <div>
          <p style={{ fontSize: "36px", margin: "0" }}>
            직행의 7일 지원하기 유저는 <br />
            <strong>
              {applyData7d
                ? applyData7d.current_7d.toLocaleString("ko-KR")
                : "-"}
            </strong>{" "}
            명입니다.
          </p>
          <p style={{ fontSize: "36px", margin: "0" }}>
            지난 주 대비{" "}
            <span
              style={{
                color: getPercentageColor(applyData7d?.wow_pct ?? null),
              }}
            >
              {applyData7d ? formatPercentage(applyData7d.wow_pct) : "-%"}
            </span>{" "}
            변화했습니다.
          </p>
        </div>
        <div>
          <p style={{ fontSize: "36px", margin: "0" }}>
            직행의 30일 지원하기 유저는 <br />
            <strong>
              {applyData30d
                ? applyData30d.current_30d.toLocaleString("ko-KR")
                : "-"}
            </strong>{" "}
            명입니다.
          </p>
          <p style={{ fontSize: "36px", margin: "0" }}>
            전기간 대비{" "}
            <span
              style={{
                color: getPercentageColor(applyData30d?.wow_pct ?? null),
              }}
            >
              {applyData30d ? formatPercentage(applyData30d.wow_pct) : "-%"}
            </span>{" "}
            변화했습니다.
          </p>
        </div>
      </section>
      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            marginBottom: 32,
            fontSize: "36px",
            fontWeight: "800",
            textAlign: "center",
          }}
        >
          지원하기 1년간 추이
        </h2>
        <div
          style={{
            flex: 1,
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "20px",
            minHeight: "200px",
          }}
        >
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
  const tableHeaders = ["홈 화면", "리스트", "공고상세", "지원하기", "합격"];

  // 홈 화면(유니크 유저) 데이터: /api/metrics/uu?event=home_page_view
  type Block = { current: number; previous: number; wowPct: number | null };
  type Resp = { event: string; d7: Block; d30: Block };
  const [home, setHome] = React.useState<Resp | null>(null);

  // 채용공고(유니크 유저) 데이터: /api/metrics/uu?event=recruitment_page_view
  const [recruitment, setRecruitment] = React.useState<Resp | null>(null);

  // 지원하기(유니크 유저) 데이터: /api/metrics/uu?event=recruitment_apply_click
  const [apply, setApply] = React.useState<Resp | null>(null);

  // 직무별(유니크 유저) 데이터: /api/metrics/uu?event=job_major_page_view
  const [jobMajor, setJobMajor] = React.useState<Resp | null>(null);

  // 합격자수 데이터: 7일/30일 비교 데이터
  const [hire, setHire] = React.useState<Resp | null>(null);

  React.useEffect(() => {
    const eventName = "home_page_view"; // 홈 화면 이벤트명
    fetch(`/api/metrics/uu?event=${encodeURIComponent(eventName)}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then(setHome)
      .catch(console.error);

    const recruitmentEventName = "recruitment_page_view"; // 채용공고 이벤트명
    fetch(`/api/metrics/uu?event=${encodeURIComponent(recruitmentEventName)}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then(setRecruitment)
      .catch(console.error);

    const applyEventName = "recruitment_apply_click"; // 지원하기 이벤트명
    fetch(`/api/metrics/uu?event=${encodeURIComponent(applyEventName)}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then(setApply)
      .catch(console.error);

    const jobMajorEventName = "job_major_page_view"; // 직무별 이벤트명
    fetch(`/api/metrics/uu?event=${encodeURIComponent(jobMajorEventName)}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then(setJobMajor)
      .catch(console.error);

    // 합격자수 API 호출 (7일/30일 비교 데이터)
    fetch("/api/metrics/hire", { cache: "no-store" })
      .then((r) => r.json())
      .then(setHire)
      .catch(console.error);
  }, []);

  // 다른 칸은 임시 값 유지 (추후 같은 API로 교체 가능)
  const weeklyData = ["-", "47,310", "47,310", "47,310", "8"];
  const weeklyChanges = ["-", "x%", "x%", "x%", "x%"];
  const monthlyData = ["-", "47,310", "47,310", "47,310", "8"];
  const monthlyChanges = ["-", "x%", "x%", "x%", "x%"];

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
  const headerStyle: React.CSSProperties = {
    fontWeight: 800,
    fontSize: "32px",
    textAlign: "center",
  };
  const labelStyle: React.CSSProperties = {
    fontWeight: 800,
    fontSize: "32px",
    textAlign: "center",
  };
  const dataStyle: React.CSSProperties = {
    fontSize: "28px",
    textAlign: "center",
    fontWeight: 700,
  };
  const fmt = (n: number) => n.toLocaleString("ko-KR");
  const pct = (v: number | null) =>
    v == null ? "-" : `${v >= 0 ? "+" : ""}${v}%`;
  const getPercentageColor = (pct: number | null) => {
    if (pct === null) return "white";
    return pct >= 0 ? "red" : "rgb(59, 130, 246)"; // +면 빨간색, -면 파란색
  };

  return (
    <div style={tableLayout}>
      {/* 표 헤더 행 */}
      <div /> {/* 빈 칸 (왼쪽 상단) */}
      {tableHeaders.map((header) => (
        <div key={header} style={headerStyle}>
          {header}
        </div>
      ))}
      {/* 7일 데이터 행 */}
      <div style={labelStyle}>7d</div>
      {/* 7일 데이터: 홈 화면(0번 칸), 직무별(1번 칸), 채용공고(2번 칸), 지원하기(3번 칸) 실데이터 반영 */}
      {tableHeaders.map((_, index) => (
        <div key={`weekly-${index}`} style={dataStyle}>
          {index === 0
            ? home
              ? fmt(home.d7.current)
              : "-"
            : index === 1
            ? jobMajor
              ? fmt(jobMajor.d7.current)
              : "-"
            : index === 2
            ? recruitment
              ? fmt(recruitment.d7.current)
              : "-"
            : index === 3
            ? apply
              ? fmt(apply.d7.current)
              : "-"
            : index === 4
            ? hire
              ? fmt(hire.d7.current)
              : "-"
            : weeklyData[index]}
        </div>
      ))}
      {/* 7일 변화율 행 */}
      <div style={labelStyle}>증감</div>
      {tableHeaders.map((_, index) => (
        <div
          key={`weekly-change-${index}`}
          style={{
            ...dataStyle,
            color:
              index === 0
                ? getPercentageColor(home?.d7.wowPct ?? null)
                : index === 1
                ? getPercentageColor(jobMajor?.d7.wowPct ?? null)
                : index === 2
                ? getPercentageColor(recruitment?.d7.wowPct ?? null)
                : index === 3
                ? getPercentageColor(apply?.d7.wowPct ?? null)
                : index === 4
                ? getPercentageColor(hire?.d7.wowPct ?? null)
                : "white",
          }}
        >
          {index === 0
            ? home
              ? pct(home.d7.wowPct)
              : "-"
            : index === 1
            ? jobMajor
              ? pct(jobMajor.d7.wowPct)
              : "-"
            : index === 2
            ? recruitment
              ? pct(recruitment.d7.wowPct)
              : "-"
            : index === 3
            ? apply
              ? pct(apply.d7.wowPct)
              : "-"
            : index === 4
            ? hire
              ? pct(hire.d7.wowPct)
              : "-"
            : weeklyChanges[index]}
        </div>
      ))}
      {/* 구분선 (시각적 간격) */}
      <div style={{ gridColumn: "1 / -1", height: 40 }} />
      {/* 30일 데이터 행 */}
      <div style={labelStyle}>30d</div>
      {tableHeaders.map((_, index) => (
        <div key={`monthly-${index}`} style={dataStyle}>
          {index === 0
            ? home
              ? fmt(home.d30.current)
              : "-"
            : index === 1
            ? jobMajor
              ? fmt(jobMajor.d30.current)
              : "-"
            : index === 2
            ? recruitment
              ? fmt(recruitment.d30.current)
              : "-"
            : index === 3
            ? apply
              ? fmt(apply.d30.current)
              : "-"
            : index === 4
            ? hire
              ? fmt(hire.d30.current)
              : "-"
            : monthlyData[index]}
        </div>
      ))}
      {/* 30일 변화율 행 */}
      <div style={labelStyle}>증감</div>
      {tableHeaders.map((_, index) => (
        <div
          key={`monthly-change-${index}`}
          style={{
            ...dataStyle,
            color:
              index === 0
                ? getPercentageColor(home?.d30.wowPct ?? null)
                : index === 1
                ? getPercentageColor(jobMajor?.d30.wowPct ?? null)
                : index === 2
                ? getPercentageColor(recruitment?.d30.wowPct ?? null)
                : index === 3
                ? getPercentageColor(apply?.d30.wowPct ?? null)
                : index === 4
                ? getPercentageColor(hire?.d30.wowPct ?? null)
                : "white",
          }}
        >
          {index === 0
            ? home
              ? pct(home.d30.wowPct)
              : "-"
            : index === 1
            ? jobMajor
              ? pct(jobMajor.d30.wowPct)
              : "-"
            : index === 2
            ? recruitment
              ? pct(recruitment.d30.wowPct)
              : "-"
            : index === 3
            ? apply
              ? pct(apply.d30.wowPct)
              : "-"
            : index === 4
            ? hire
              ? pct(hire.d30.wowPct)
              : "-"
            : monthlyChanges[index]}
        </div>
      ))}
    </div>
  );
}

// 캐시 관리
let cachedData: { days: number; dateText: string; timestamp: number } | null =
  null;
const CACHE_DURATION = 60 * 60 * 1000; // 1시간

/**
 * 생명시간 카운트다운 - API에서 실제 데이터를 가져와서 보여줌 (캐시 적용)
 */
export function LifeTimeComponent() {
  const [remainingDays, setRemainingDays] = React.useState<number>(247); // 기본값 설정
  const [targetDateText, setTargetDateText] = React.useState<string>(
    "2026년 5월 21일에 끝납니다."
  ); // 기본값 설정

  React.useEffect(() => {
    const fetchData = async () => {
      // 캐시 확인
      const now = Date.now();
      if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
        console.log("캐시된 데이터 사용");
        setRemainingDays(cachedData.days);
        setTargetDateText(cachedData.dateText);
        return;
      }

      try {
        console.log("API 호출 시작...");

        const response = await fetch("/api/metrics/lifetime", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("API 응답 오류");
        }

        const data = await response.json();
        console.log("받은 데이터:", data);

        // 캐시 업데이트
        cachedData = {
          days: data.days,
          dateText: data.dateText,
          timestamp: now,
        };

        // 상태 업데이트
        setRemainingDays(data.days);
        setTargetDateText(data.dateText);

        console.log("데이터 캐시 완료:", data);
      } catch (error) {
        console.error("API 호출 실패:", error);
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
        직행의 수명은{" "}
        <span style={{ fontWeight: 900 }}>
          {remainingDays.toLocaleString()}
        </span>
        일 남았습니다.
      </div>
      <div style={{ fontSize: 48, fontWeight: 800 }}>{targetDateText}</div>
    </div>
  );
}
