"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ApplyOverviewComponent, ApplyDetailComponent, LifeTimeComponent } from "../components/PageComponents";

/**
 * 메인 홈페이지 - 3개 페이지를 자동으로 순환하며 보여줌
 * 페이지 순서: 지원현황 → 상세통계 → 생명시간
 */
export default function HomePage() {
  // 현재 보여줄 페이지 번호 (0: 지원현황, 1: 상세통계, 2: 생명시간)
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // 7초마다 다음 페이지로 자동 전환
  useEffect(() => {
    const autoSlideTimer = setInterval(() => {
      setCurrentPageIndex((current) => (current + 1) % 3);
    }, 11000);

    return () => clearInterval(autoSlideTimer);
  }, []);

  // 현재 인덱스에 따라 보여줄 컴포넌트 결정
  const getCurrentPageComponent = () => {
    switch (currentPageIndex) {
      case 0: return <ApplyOverviewComponent />;
      case 1: return <ApplyDetailComponent />;
      case 2: return <LifeTimeComponent />;
      default: return <ApplyOverviewComponent />;
    }
  };

  // 룰렛처럼 오른쪽에서 왼쪽으로 슬라이드되는 애니메이션
  const slideAnimation = {
    enter: { x: "100%", opacity: 1 },    // 오른쪽에서 시작
    center: { x: 0, opacity: 1 },        // 중앙에 정착
    exit: { x: "-100%", opacity: 1 },    // 왼쪽으로 사라짐
  };

  return (
    <main style={{ minHeight: "100vh", overflow: "hidden", position: "relative" }}>
      <AnimatePresence initial={false}>
        <motion.div
          key={currentPageIndex}
          variants={slideAnimation}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.4, 0.0, 0.2, 1] }}
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
          {getCurrentPageComponent()}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
