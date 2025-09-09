export default function ApplyDetailPage() {
  const cols = ["홈 화면", "직무별", "채용공고", "지원하기", "합격"];

  const data7d = ["47,310", "47,310", "47,310", "47,310", "8"];
  const change7d = ["x%", "x%", "x%", "x%", "x%"];

  const data30d = ["47,310", "47,310", "47,310", "47,310", "8"];
  const change30d = ["x%", "x%", "x%", "x%", "x%"];

  const wrap: React.CSSProperties = {
    minHeight: "100vh",
    background: "black",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
    boxSizing: "border-box",
  };

  const grid: React.CSSProperties = {
    width: "90%",
    maxWidth: 1200,
    display: "grid",
    gridTemplateColumns: "160px repeat(5, 1fr)", // row labels + 5 metric columns
    columnGap: 48,
    rowGap: 28,
  };

  const headerCell: React.CSSProperties = { fontWeight: 800 };
  const rowLabel: React.CSSProperties = { fontWeight: 800 };
  const cell: React.CSSProperties = {};

  return (
    <main style={wrap}>
      <div style={grid}>
        {/* header row: empty top-left corner + column headers */}
        <div />
        {cols.map((c) => (
          <div key={c} style={headerCell}>
            {c}
          </div>
        ))}

        {/* 7d row */}
        <div style={rowLabel}>7d</div>
        {data7d.map((v, i) => (
          <div key={`7d-${i}`} style={cell}>
            {v}
          </div>
        ))}

        {/* 7d change row */}
        <div style={rowLabel}>증감</div>
        {change7d.map((v, i) => (
          <div key={`chg7-${i}`} style={cell}>
            {v}
          </div>
        ))}

        {/* spacer row (visual gap similar to mockup) */}
        <div style={{ gridColumn: "1 / -1", height: 40 }} />

        {/* 30d row */}
        <div style={rowLabel}>30d</div>
        {data30d.map((v, i) => (
          <div key={`30d-${i}`} style={cell}>
            {v}
          </div>
        ))}

        {/* 30d change row */}
        <div style={rowLabel}>증감</div>
        {change30d.map((v, i) => (
          <div key={`chg30-${i}`} style={cell}>
            {v}
          </div>
        ))}
      </div>
    </main>
  );
}