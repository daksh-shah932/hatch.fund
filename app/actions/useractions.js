"use server";

import Razorpay from "razorpay";
import Payment from "../models/Payment";
import connectDb from "../db/connectDb";
import User from "../models/User";
import { authOptions, getServerSession } from "next-auth";



export const initiate = async ({ amount, to_username, Payment_form, caller_email }) => {
  try {
    await connectDb();

    // console.log("initiate called with:", { amount, to_username, Payment_form, caller_email });

    // ----- Validate -----
    if (!amount) return { success: false, message: "Amount is required" };
    const amt = Number.parseInt(amount);
    if (Number.isNaN(amt) || amt <= 0) return { success: false, message: "Invalid amount" };

    if (!to_username) return { success: false, message: "to_username missing" };

    // ----- Fetch user FIRST -----
    const user = await User.findOne({ username: to_username });
    if (!user) return { success: false, message: "User not found" };

    const secret = user.razorpaySecret;
    const razorpayId = user.razorpayId;

    // console.log("Using Razorpay keys of:", to_username, "ID:", razorpayId);

    // ----- Auth check -----
    const session = await getServerSession(authOptions);
    if (!session)
      return { success: false, statusCode: 401, message: "Unauthorized - no session" };

    if (caller_email && session.user?.email !== caller_email)
      return { success: false, statusCode: 401, message: "Caller email mismatch" };

    // ----- Razorpay Instance -----
    const instance = new Razorpay({
      key_id: razorpayId,
      key_secret: secret,
    });

    const options = {
      amount: amt * 100,
      currency: "INR",
    };

    // ----- CREATE ORDER -----
    const order = await instance.orders.create(options);

    if (!order || !order.id) {
      console.error("Razorpay order creation failed:", order);
      return { success: false, message: "Order creation failed" };
    }

    // ----- SAVE PAYMENT ENTRY -----
    await Payment.create({
      oid: order.id,
      amount: amt,
      to_User: to_username,
      name: Payment_form?.name || "",
      message: Payment_form?.message || "",
      done: false,
      createdBy: session.user?.email || caller_email || null,
    });

    return { success: true, order };
  } catch (err) {
    console.error("initiate error:", err);
    return { success: false, message: "Internal server error", error: String(err) };
  }
};


export const fetchuser = async (username) => {
  await connectDb();
  const u = await User.findOne({ username }).lean();
  if (!u) return null;
  return JSON.parse(JSON.stringify(u));
};

export const fetchpayments = async (username) => {
  await connectDb();
  const p = await Payment.find({ to_User: username, done: true })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
  return JSON.parse(JSON.stringify(p));
};

export const updateProfile = async (data, oldUsername) => {
  await connectDb();
  let ndata = data;
  if (oldUsername !== ndata.username) {
    const u = await User.findOne({ username: ndata.username });
    if (u) {
      return { error: "Username already taken" };
    }
    await User.updateOne({ email: ndata.email }, ndata);
    await Payment.updateMany({ to_User: oldUsername }, { to_User: ndata.username });
  } else {
     await User.updateOne({ email: ndata.email }, ndata);
  }
 
}
