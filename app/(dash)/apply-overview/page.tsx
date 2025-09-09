import { ApplyOverviewComponent } from "../../../components/PageComponents";

// URL 직접 접근용: /apply-overview
export default function ApplyOverviewPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <ApplyOverviewComponent />
    </main>
  );
}