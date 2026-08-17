"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PermitVerifyRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      router.replace(`/verify?code=${encodeURIComponent(code)}`);
    } else {
      router.replace("/verify");
    }
  }, [router, searchParams]);

  return null;
}

export default function PermitVerifyRedirectPage() {
  return (
    <Suspense fallback={null}>
      <PermitVerifyRedirectContent />
    </Suspense>
  );
}
