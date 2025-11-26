export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "../../models/Payment";
import User from "../../models/User";
import connectDb from "../../db/connectDb";

export const POST = async (req) => {
  // console.log("🔔 Razorpay POST called");

  try {
    await connectDb();

    const form = await req.formData();
    // console.log("🧾 Form received:", form);

    // ✅ GET values properly from FormData
    const razorpay_order_id = form.get("razorpay_order_id");
    const razorpay_payment_id = form.get("razorpay_payment_id");
    const razorpay_signature = form.get("razorpay_signature");

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error("❌ Missing fields in form", form);
      return NextResponse.json(
        { success: false, message: "Missing payment fields" },
        { status: 400 }
      );
    }

    const p = await Payment.findOne({ oid: razorpay_order_id });
    // console.log("🔍 Payment found:", p);

    if (!p) {
      console.error("❌ Order ID not found:", razorpay_order_id);
      return NextResponse.json(
        { success: false, message: "Order Id not found" },
        { status: 404 }
      );
    }

    const user = await User.findOne({ username: p.to_User });
    // console.log("🔍 Payment user:", user);

    if (!user) {
      console.error("❌ User not found:", p.to_User);
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    //fetch razorpaysecret from database user
    const secret = user.razorpaySecret;


    // ❗ FIXED — Razorpay secret must be correct
    
    // console.log("🔐 Using secret:", secret);

    const verified = validatePaymentVerification(
      { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
      razorpay_signature,
      secret
    );

    // console.log("🔍 Verified:", verified);

    if (!verified) {
      return NextResponse.json(
        { success: false, message: "Payment Verification Failed" },
        { status: 400 }
      );
    }

    await Payment.findOneAndUpdate(
      { oid: razorpay_order_id },
      { done: true }
    );

    // console.log("✅ Payment verified & marked done");

    return NextResponse.json({
      success: true,
      redirectUrl: `${process.env.NEXT_PUBLIC_URL}/${user.username}?paymentdone=true`,
    });

  } catch (err) {
    console.error("🔥 API Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
};
