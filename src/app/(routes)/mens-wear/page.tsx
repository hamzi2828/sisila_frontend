import { Suspense } from "react";
import MensWearClient from "./MensWearClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="px-6 py-12">Loading…</div>}>
      <MensWearClient />
    </Suspense>
  );
}
