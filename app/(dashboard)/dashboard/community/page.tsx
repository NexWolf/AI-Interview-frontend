import { Suspense } from "react";
import CommunityPage from "@/features/learning/CommunityPage";

export default function Page() {
  return <Suspense fallback={<div className="p-10 text-sm text-muted-foreground">Loading community…</div>}><CommunityPage /></Suspense>;
}
