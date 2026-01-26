"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Container from "@/components/ui/container";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

/**
 * Static-export friendly pending page (client component).
 * Reads orderId from query param: /checkout/pending?orderId=...
 *
 * Note: This is a minimal implementation to keep static export working.
 * You can extend it to match the previous rich UI.
 */
export default function CheckoutPendingClientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  return (
    <>
      <Container>
        <div className="py-12 space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Pending Payment</h1>
          <p className="text-muted-foreground">
            {orderId ? (
              <>
                Your order is pending. Order ID: <span className="font-semibold">{orderId}</span>
              </>
            ) : (
              "Missing orderId. Use URL like: /checkout/pending?orderId=..."
            )}
          </p>
          <div className="flex gap-3">
            <Button onClick={() => router.push("/shop")}>Continue shopping</Button>
            {orderId ? (
              <Button variant="outline" onClick={() => router.push(`/checkout/success?orderId=${orderId}`)}>
                View status
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
}


