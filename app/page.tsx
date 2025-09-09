"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);

  const pages = ["apply-overview", "apply-detail", "life-time"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % pages.length);
    }, 3000); // 3초마다 전환

    return () => clearInterval(interval);
  }, [pages.length]);

  const renderCurrentPage = () => {
    if (currentStep === 0) {
      // apply-overview 내용
      return (
        <div style={{ width: "92%", maxWidth: 1200, display: "flex", gap: 64 }}>
          <section style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24, justifyContent: "center" }}>
            <h2>지원하기 7/30일 추이</h2>
            <div>
              <p>직행의 7일 지원하기 유저는 {'{'}$value{'}'} 명입니다.</p>
              <p>지난 주 대비 x% 변화했습니다.</p>
            </div>
            <div>
              <p>직행의 30일 지원하기 유저는 {'{'}$value{'}'} 명입니다.</p>
              <p>지난 주 대비 y% 변화했습니다.</p>
            </div>
          </section>
          <section style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h2 style={{ marginBottom: 16 }}>지원하기 1년간 추이</h2>
            <div style={{ height: 260, border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              차트 영역
            </div>
          </section>
        </div>
      );
    } else if (currentStep === 1) {
      // apply-detail 내용
      const cols = ["홈 화면", "직무별", "채용공고", "지원하기", "합격"];
      const data7d = ["47,310", "47,310", "47,310", "47,310", "8"];
      const change7d = ["x%", "x%", "x%", "x%", "x%"];
      const data30d = ["47,310", "47,310", "47,310", "47,310", "8"];
      const change30d = ["x%", "x%", "x%", "x%", "x%"];

      const grid: React.CSSProperties = {
        width: "90%",
        maxWidth: 1200,
        display: "grid",
        gridTemplateColumns: "160px repeat(5, 1fr)",
        columnGap: 48,
        rowGap: 28,
      };

      const headerCell: React.CSSProperties = { fontWeight: 800 };
      const rowLabel: React.CSSProperties = { fontWeight: 800 };
      const cell: React.CSSProperties = {};

      return (
        <div style={grid}>
          <div />
          {cols.map((c) => (
            <div key={c} style={headerCell}>{c}</div>
          ))}
          <div style={rowLabel}>7d</div>
          {data7d.map((v, i) => (
            <div key={`7d-${i}`} style={cell}>{v}</div>
          ))}
          <div style={rowLabel}>증감</div>
          {change7d.map((v, i) => (
            <div key={`chg7-${i}`} style={cell}>{v}</div>
          ))}
          <div style={{ gridColumn: "1 / -1", height: 40 }} />
          <div style={rowLabel}>30d</div>
          {data30d.map((v, i) => (
            <div key={`30d-${i}`} style={cell}>{v}</div>
          ))}
          <div style={rowLabel}>증감</div>
          {change30d.map((v, i) => (
            <div key={`chg30-${i}`} style={cell}>{v}</div>
          ))}
        </div>
      );
    } else {
      // life-time 내용
      const endDate = new Date("2026-07-29T00:00:00");
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const msPerDay = 1000 * 60 * 60 * 24;
      const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / msPerDay));
      const y = endDate.getFullYear();
      const m = endDate.getMonth() + 1;
      const d = endDate.getDate();

      return (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, fontWeight: 800, marginBottom: 16 }}>
            직행의 수명은 <span style={{ fontWeight: 900 }}>{daysLeft}</span>일 남았습니다.
          </div>
          <div style={{ fontSize: 48, fontWeight: 800 }}>
            {y}년 {m}월 {d}일에 끝납니다.
          </div>
        </div>
      );
    }
  };
  // 룰렛 회전 슬라이드 애니메이션 variants
  const rouletteSlideVariants = {
    enter: {
      x: "100%",
      opacity: 1,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: "-100%",
      opacity: 1,
    },
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        overflow: "hidden",
        position: "relative"
      }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={currentStep}
          variants={rouletteSlideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.7,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          style={{
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {renderCurrentPage()}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
