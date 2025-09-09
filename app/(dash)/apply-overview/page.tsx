export default function ApplyOverviewPage() {
return (
    <main
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "92%", maxWidth: 1200, display: "flex", gap: 64 }}>
        {/* LEFT */}
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

        {/* RIGHT */}
        <section style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h2 style={{ marginBottom: 16 }}>지원하기 1년간 추이</h2>
          <div style={{ height: 260, border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            차트 영역
          </div>
        </section>
      </div>
    </main>
  )
}