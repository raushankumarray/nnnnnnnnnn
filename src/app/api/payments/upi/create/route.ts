import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import QRCode from "qrcode";
import { signPaymentSession, isValidUpiVpa } from "@/lib/upi-gateway";

interface CartItemInput {
  productId?: unknown;
  title?: unknown;
  price?: unknown;
  quantity?: unknown;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      items,
      upiApp = "UPI QR",
      payerUpiId = "",
    } = body as {
      userId?: unknown;
      items?: unknown;
      upiApp?: unknown;
      payerUpiId?: unknown;
    };

    if (typeof userId !== "string" || !userId.trim()) {
      return NextResponse.json(
        { error: "Authenticated user ID is required." },
        { status: 401 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty. Add at least one module before initiating UPI payment." },
        { status: 400 }
      );
    }

    const sanitizedItems = items.map((item: CartItemInput) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity);
      if (
        typeof item.title !== "string" ||
        !item.title.trim() ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        throw new Error("INVALID_CART_ITEM");
      }
      return {
        productId: typeof item.productId === "string" ? item.productId : "module",
        title: item.title.trim().slice(0, 120),
        price,
        quantity,
      };
    });

    if (typeof payerUpiId === "string" && payerUpiId.trim()) {
      if (!isValidUpiVpa(payerUpiId)) {
        return NextResponse.json(
          { error: "Invalid UPI ID format. Example: username@okaxis" },
          { status: 400 }
        );
      }
    }

    // Recompute totals strictly on the server
    const subtotal = sanitizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const gst = Math.round(subtotal * 0.18 * 100) / 100;
    const totalAmount = Math.round((subtotal + gst) * 100) / 100;

    if (totalAmount <= 0) {
      return NextResponse.json(
        { error: "Order total must be greater than zero." },
        { status: 400 }
      );
    }

    const merchantUpiId = process.env.MERCHANT_UPI_ID?.trim() || "pay@npbmedia";
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${crypto
      .randomBytes(2)
      .toString("hex")
      .toUpperCase()}`;
    const transactionRef = `NPBUPI${Date.now()}${crypto
      .randomBytes(2)
      .toString("hex")
      .toUpperCase()}`;

    const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(
      merchantUpiId
    )}&pn=${encodeURIComponent("NPB Media")}&tr=${encodeURIComponent(
      transactionRef
    )}&tn=${encodeURIComponent(`Order ${orderId}`)}&am=${totalAmount.toFixed(
      2
    )}&cu=INR`;

    const qrCodeDataUrl = await QRCode.toDataURL(upiIntentUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });

    const sessionSignature = signPaymentSession({
      orderId,
      transactionRef,
      totalAmount,
      userId: userId.trim(),
    });

    return NextResponse.json({
      orderId,
      transactionRef,
      merchantUpiId,
      upiIntentUrl,
      qrCodeDataUrl,
      subtotal,
      gst,
      totalAmount,
      upiApp: typeof upiApp === "string" ? upiApp.slice(0, 40) : "UPI QR",
      payerUpiId: typeof payerUpiId === "string" ? payerUpiId.trim() : "",
      sessionSignature,
      items: sanitizedItems,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CART_ITEM") {
      return NextResponse.json(
        { error: "One or more cart items contain invalid pricing or quantity." },
        { status: 400 }
      );
    }
    console.error("UPI create error:", error);
    return NextResponse.json(
      { error: "Failed to initialize UPI payment session." },
      { status: 500 }
    );
  }
}
