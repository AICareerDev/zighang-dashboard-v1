
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LifeTimePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
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

  const pages = [
    { path: "/apply-overview", component: "apply-overview" },
    { path: "/apply-detail", component: "apply-detail" },
    { path: "/life-time", component: "life-time" }
  ];

  useEffect(() => {
    const sequence = async () => {
      // 첫 번째 페이지 (apply-overview)
      router.push("/apply-overview");
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setIsAnimating(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 두 번째 페이지 (apply-detail)
      setCurrentStep(1);
      router.push("/apply-detail");
      setIsAnimating(false);
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setIsAnimating(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 세 번째 페이지 (life-time)
      setCurrentStep(2);
      router.push("/life-time");
      setIsAnimating(false);
    };

    sequence();
  }, [router]);

  // 현재 페이지가 life-time이 아니면 빈 화면 반환
  if (currentStep !== 2) {
    return (
      <div 
        style={{
          minHeight: "100vh",
          background: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: isAnimating ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.5s ease-in-out"
        }}
      >
        <div style={{ color: "white", fontSize: 24 }}>로딩 중...</div>
      </div>
    );
  }

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
        transform: isAnimating ? "rotateY(180deg)" : "rotateY(0deg)",
        transition: "transform 0.5s ease-in-out"
      }}
    >
      <div>
        <div style={{ fontSize: 48, fontWeight: 800, marginBottom: 16 }}>
          직행의 수명은 <span style={{ fontWeight: 900 }}>{daysLeft}</span>일 남았습니다.
        </div>
        <div style={{ fontSize: 48, fontWeight: 800 }}>
          {y}년 {m}월 {d}일에 끝납니다.
        </div>
      </div>
    </main>
  );
}