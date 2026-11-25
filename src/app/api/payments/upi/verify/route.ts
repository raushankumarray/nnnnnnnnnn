import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature, isValidUtrNumber } from "@/lib/upi-gateway";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      transactionRef,
      totalAmount,
      userId,
      sessionSignature,
      action,
      utrNumber = "",
      failureReason = "",
    } = body as {
      orderId?: unknown;
      transactionRef?: unknown;
      totalAmount?: unknown;
      userId?: unknown;
      sessionSignature?: unknown;
      action?: unknown;
      utrNumber?: unknown;
      failureReason?: unknown;
    };

    const parsedAmount = Number(totalAmount);

    if (
      typeof orderId !== "string" ||
      !orderId.trim() ||
      typeof transactionRef !== "string" ||
      !transactionRef.trim() ||
      typeof userId !== "string" ||
      !userId.trim() ||
      typeof sessionSignature !== "string" ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid UPI verification payload." },
        { status: 400 }
      );
    }

    const isSignatureValid = verifyPaymentSignature(
      {
        orderId: orderId.trim(),
        transactionRef: transactionRef.trim(),
        totalAmount: parsedAmount,
        userId: userId.trim(),
      },
      sessionSignature
    );

    if (!isSignatureValid) {
      return NextResponse.json(
        {
          verified: false,
          paymentStatus: "failed",
          orderStatus: "not_confirmed",
          failureReason: "Payment session signature mismatch. Please initiate a fresh UPI session.",
        },
        { status: 403 }
      );
    }

    // Explicit failure / cancellation reported from UPI flow
    if (action === "report_failure") {
      return NextResponse.json({
        verified: false,
        paymentStatus: "failed",
        orderStatus: "not_confirmed",
        failureReason:
          typeof failureReason === "string" && failureReason.trim()
            ? failureReason.trim().slice(0, 200)
            : "UPI payment was declined or cancelled before completion.",
        verifiedAt: new Date().toISOString(),
      });
    }

    // Verify 12-digit UPI UTR / Reference Number (auto-fetch or manual UTR verification)
    if (action === "verify_utr" || action === "auto_fetch") {
      const cleanedUtr = typeof utrNumber === "string" ? utrNumber.trim() : "";

      if (cleanedUtr) {
        if (!isValidUtrNumber(cleanedUtr)) {
          return NextResponse.json({
            verified: false,
            paymentStatus: "failed",
            orderStatus: "not_confirmed",
            failureReason:
              "Invalid or declined 12-digit UPI UTR number. Order has not been confirmed.",
            verifiedAt: new Date().toISOString(),
          });
        }

        return NextResponse.json({
          verified: true,
          paymentStatus: "success",
          orderStatus: "confirmed",
          utrNumber: cleanedUtr,
          verifiedAt: new Date().toISOString(),
          message: "UPI transaction verified successfully.",
        });
      }

      // When auto-fetching without a UTR yet, stay pending unless a gateway webhook confirmed it
      return NextResponse.json({
        verified: false,
        paymentStatus: "pending",
        orderStatus: "pending",
        message: "Waiting for UPI bank confirmation or 12-digit UTR reference.",
      });
    }

    return NextResponse.json(
      { error: "Unsupported verification action." },
      { status: 400 }
    );
  } catch (error) {
    console.error("UPI verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify UPI payment status." },
      { status: 500 }
    );
  }
}
