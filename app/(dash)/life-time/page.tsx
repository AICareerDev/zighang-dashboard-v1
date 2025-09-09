
"use client";

export default function LifeTimePage() {
  // 목표 종료일 (원하는 날짜로 수정)
  const endDate = new Date("2026-07-29T00:00:00");

  // 오늘 날짜(시:분:초 제거)
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / msPerDay));

  const y = endDate.getFullYear();
  const m = endDate.getMonth() + 1;
  const d = endDate.getDate();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          직행의 수명은 <span style={{ fontWeight: 900 }}>{daysLeft}</span>일 남았습니다.
        </div>
        <div style={{ fontSize: 28, fontWeight: 800 }}>
          {y}년 {m}월 {d}일에 끝납니다.
        </div>
      </div>
    </main>
  );
}