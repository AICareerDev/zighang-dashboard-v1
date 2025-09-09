
import { LifeTimeComponent } from "../../../components/PageComponents";

// URL 직접 접근용: /life-time
export default function LifeTimePage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "24px" }}>
      <LifeTimeComponent />
    </main>
  );
}