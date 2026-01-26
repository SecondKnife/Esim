"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Container from "@/components/ui/container";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

/**
 * Static-export friendly success page (client component).
 * Reads orderId from query param: /checkout/success?orderId=...
 *
 * Note: This is a minimal implementation to keep static export working.
 * You can extend it to match the previous rich UI.
 */
export default function CheckoutSuccessClientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  return (
    <>
      <Container>
        <div className="py-12 space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Order Success</h1>
          <p className="text-muted-foreground">
            {orderId ? (
              <>
                Thank you! Your order has been created. Order ID:{" "}
                <span className="font-semibold">{orderId}</span>
              </>
            ) : (
              "Missing orderId. Use URL like: /checkout/success?orderId=..."
            )}
          </p>
          <div className="flex gap-3">
            <Button onClick={() => router.push("/shop")}>Continue shopping</Button>
            <Button variant="outline" onClick={() => router.push("/orders")}>
              View orders
            </Button>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
}


