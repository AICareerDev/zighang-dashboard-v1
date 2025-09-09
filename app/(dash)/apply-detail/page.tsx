import { ApplyDetailComponent } from "../../../components/PageComponents";

// URL 직접 접근용: /apply-detail
export default function ApplyDetailPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
      <ApplyDetailComponent />
    </main>
  );
}